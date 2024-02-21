import {
  ActionTypeDefinition,
  EVENT_STATUS,
  OrderChangeEvent,
  OrderSummary,
  OrderTransaction,
  VirtualOrder,
} from "@types"

type InternalOrderSummary = OrderSummary & {
  futureTemporarySum: number
}

export class OrderChangeProcessing {
  private static typeDefinition: { [key: string]: ActionTypeDefinition } = {}
  private static defaultConfig = {
    awaitRequired: false,
    isDeduction: false,
  }

  private order: VirtualOrder
  private transactions: OrderTransaction[]
  private actions: OrderChangeEvent[]

  private actionsProcessed: { [key: string]: OrderChangeEvent[] } = {}
  private groupTotal: Record<string, number> = {}
  private summary: InternalOrderSummary

  public static registerActionType(key: string, type: ActionTypeDefinition) {
    OrderChangeProcessing.typeDefinition[key] = type
  }

  constructor({
    order,
    transactions,
    actions,
  }: {
    order: VirtualOrder
    transactions: OrderTransaction[]
    actions: OrderChangeEvent[]
  }) {
    this.order = JSON.parse(JSON.stringify(order))
    this.transactions = JSON.parse(JSON.stringify(transactions ?? []))
    this.actions = JSON.parse(JSON.stringify(actions ?? []))

    const transactionTotal = transactions.reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0)

    this.summary = {
      futureDifference: 0,
      futureTemporaryDifference: 0,
      temporaryDifference: 0,
      pendingDifference: 0,
      futureTemporarySum: 0,
      differenceSum: 0,
      currentOrderTotal: order.total as number,
      originalOrderTotal: order.total as number,
      transactionTotal,
    }
  }

  private isEventActive(action: OrderChangeEvent): boolean {
    const status = action.status
    return (
      status === undefined ||
      status === EVENT_STATUS.PENDING ||
      status === EVENT_STATUS.DONE
    )
  }
  private isEventDone(action: OrderChangeEvent): boolean {
    const status = action.status
    return status === EVENT_STATUS.DONE
  }

  private isEventPending(action: OrderChangeEvent): boolean {
    const status = action.status
    return status === undefined || status === EVENT_STATUS.PENDING
  }

  public processActions(): void {
    for (const action of this.actions) {
      this.processAction_(action)
    }

    const summary = this.summary
    for (let idx = 0; idx < this.actions.length; idx++) {
      const action = this.actions[idx]

      if (!this.isEventActive(action)) {
        continue
      }

      const type = {
        ...OrderChangeProcessing.defaultConfig,
        ...OrderChangeProcessing.typeDefinition[action.action],
      }

      const amount = action.amount! * (type.isDeduction ? -1 : 1)

      if (action.group_id && !action.evaluationOnly) {
        this.groupTotal[action.group_id] ??= 0
        this.groupTotal[action.group_id] += amount
      }

      if (type.awaitRequired && !this.isEventDone(action)) {
        if (action.evaluationOnly) {
          summary.futureTemporarySum += amount
        } else {
          summary.temporaryDifference += amount
        }
      }

      if (action.evaluationOnly) {
        summary.futureDifference += amount
      } else {
        if (!this.isEventDone(action) && !action.group_id) {
          summary.differenceSum += amount
        }
        summary.currentOrderTotal += amount
      }
    }

    const groupSum = Object.values(this.groupTotal).reduce((acc, amount) => {
      return acc + amount
    }, 0)

    summary.differenceSum += groupSum

    summary.transactionTotal = this.transactions.reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0)

    summary.futureTemporaryDifference =
      -summary.futureTemporarySum + summary.futureDifference

    summary.temporaryDifference =
      -summary.temporaryDifference + summary.differenceSum

    summary.pendingDifference =
      summary.currentOrderTotal - summary.transactionTotal
  }

  private processAction_(
    action: OrderChangeEvent,
    isReplay = false
  ): number | void {
    const type = {
      ...OrderChangeProcessing.defaultConfig,
      ...OrderChangeProcessing.typeDefinition[action.action],
    }

    this.actionsProcessed[action.action] ??= []

    if (!isReplay) {
      this.actionsProcessed[action.action].push(action)
    }

    let previousEvents: OrderChangeEvent[] | undefined
    if (type.commitsAction) {
      previousEvents = (this.actionsProcessed[type.commitsAction] ?? []).filter(
        (action) =>
          action.reference_id === action.reference_id &&
          action.status !== EVENT_STATUS.VOIDED
      )
    }

    let calculatedAmount: number = action.amount ?? 0
    const params = {
      actions: this.actions,
      action,
      previousEvents,
      currentOrder: this.order,
      summary: this.summary,
      transactions: this.transactions,
      type,
    }
    if (typeof type.validate === "function") {
      type.validate(params)
    }

    if (typeof type.operation === "function") {
      calculatedAmount = type.operation(params) as number

      action.amount = calculatedAmount ?? 0
    }

    // If an action commits previous ones, replay them with updated values
    if (type.commitsAction) {
      for (const previousEvent of previousEvents ?? []) {
        this.processAction_(previousEvent, true)
      }
    }

    if (action.resolve) {
      if (action.resolve.reference_id) {
        this.resolveReferences(action)
      }
      const groupId = action.resolve.group_id ?? "__default"
      if (action.resolve.group_id) {
        // resolve all actions in the same group
        this.resolveGroup(action)
      }
      if (action.resolve.amount && !action.evaluationOnly) {
        this.groupTotal[groupId] ??= 0
        this.groupTotal[groupId] -= action.resolve.amount
      }
    }

    return calculatedAmount
  }

  private resolveReferences(self: OrderChangeEvent): void {
    const resolve = self.resolve
    const resolveType = OrderChangeProcessing.typeDefinition[self.action]

    Object.keys(this.actionsProcessed).forEach((actionKey) => {
      const type = OrderChangeProcessing.typeDefinition[actionKey]

      const actions = this.actionsProcessed[actionKey]

      for (const action of actions) {
        if (
          action === self ||
          !this.isEventPending(action) ||
          action.reference_id !== resolve?.reference_id
        ) {
          continue
        }

        if (type.revert && (action.evaluationOnly || resolveType.void)) {
          let previousEvents: OrderChangeEvent[] | undefined
          if (type.commitsAction) {
            previousEvents = (
              this.actionsProcessed[type.commitsAction] ?? []
            ).filter(
              (action) =>
                action.reference_id === action.reference_id &&
                action.status !== EVENT_STATUS.VOIDED
            )
          }

          type.revert({
            actions: this.actions,
            action,
            previousEvents,
            currentOrder: this.order,
            summary: this.summary,
            transactions: this.transactions,
            type,
          })

          for (const previousEvent of previousEvents ?? []) {
            this.processAction_(previousEvent, true)
          }

          action.status =
            action.evaluationOnly || resolveType.void
              ? EVENT_STATUS.VOIDED
              : EVENT_STATUS.DONE
        }
      }
    })
  }

  private resolveGroup(self: OrderChangeEvent): void {
    const resolve = self.resolve

    Object.keys(this.actionsProcessed).forEach((actionKey) => {
      const type = OrderChangeProcessing.typeDefinition[actionKey]
      const actions = this.actionsProcessed[actionKey]
      for (const action of actions) {
        if (!resolve?.group_id || action?.group_id !== resolve.group_id) {
          continue
        }

        if (
          type.revert &&
          action.status !== EVENT_STATUS.DONE &&
          action.status !== EVENT_STATUS.VOIDED &&
          (action.evaluationOnly || type.void)
        ) {
          let previousEvents: OrderChangeEvent[] | undefined
          if (type.commitsAction) {
            previousEvents = (
              this.actionsProcessed[type.commitsAction] ?? []
            ).filter(
              (action) =>
                action.reference_id === action.reference_id &&
                action.status !== EVENT_STATUS.VOIDED
            )
          }

          type.revert({
            actions: this.actions,
            action: action,
            previousEvents,
            currentOrder: this.order,
            summary: this.summary,
            transactions: this.transactions,
            type: OrderChangeProcessing.typeDefinition[action.action],
          })

          for (const previousEvent of previousEvents ?? []) {
            this.processAction_(previousEvent, true)
          }

          action.status =
            action.evaluationOnly || type.void
              ? EVENT_STATUS.VOIDED
              : EVENT_STATUS.DONE
        }
      }
    })
  }

  public getSummary(): OrderSummary {
    const summary = this.summary
    const orderSummary = {
      transactionTotal: summary.transactionTotal,
      originalOrderTotal: summary.originalOrderTotal,
      currentOrderTotal: summary.currentOrderTotal,
      temporaryDifference: summary.temporaryDifference,
      futureDifference: summary.futureDifference,
      futureTemporaryDifference: summary.futureTemporaryDifference,
      pendingDifference: summary.pendingDifference,
      differenceSum: summary.differenceSum,
    }

    return orderSummary
  }

  public getCurrentOrder(): VirtualOrder {
    return this.order
  }
}

export function calculateOrderChange({
  order,
  transactions = [],
  actions = [],
}: {
  order: VirtualOrder
  transactions?: OrderTransaction[]
  actions?: OrderChangeEvent[]
}) {
  const calc = new OrderChangeProcessing({ order, transactions, actions })
  calc.processActions()

  return {
    summary: calc.getSummary(),
    order: calc.getCurrentOrder(),
  }
}
