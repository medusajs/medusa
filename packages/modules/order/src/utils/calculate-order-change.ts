import { BigNumberInput, OrderSummaryDTO } from "@medusajs/types"
import {
  BigNumber,
  MathBN,
  isDefined,
  transformPropertiesToBigNumber,
} from "@medusajs/utils"
import {
  ActionTypeDefinition,
  EVENT_STATUS,
  InternalOrderChangeEvent,
  OrderChangeEvent,
  OrderSummaryCalculated,
  OrderTransaction,
  VirtualOrder,
} from "@types"

type InternalOrderSummary = OrderSummaryCalculated & {
  futureTemporarySum: BigNumberInput
}

export class OrderChangeProcessing {
  private static typeDefinition: { [key: string]: ActionTypeDefinition } = {}
  private static defaultConfig = {
    awaitRequired: false,
    isDeduction: false,
  }

  private order: VirtualOrder
  private transactions: OrderTransaction[]
  private actions: InternalOrderChangeEvent[]

  private actionsProcessed: { [key: string]: InternalOrderChangeEvent[] } = {}
  private groupTotal: Record<string, BigNumberInput> = {}
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
    actions: InternalOrderChangeEvent[]
  }) {
    this.order = JSON.parse(JSON.stringify(order))
    this.transactions = JSON.parse(JSON.stringify(transactions ?? []))
    this.actions = JSON.parse(JSON.stringify(actions ?? []))

    const transactionTotal = MathBN.add(...transactions.map((tr) => tr.amount))

    transformPropertiesToBigNumber(this.order.metadata)

    this.summary = {
      futureDifference: 0,
      futureTemporaryDifference: 0,
      temporaryDifference: 0,
      pendingDifference: 0,
      futureTemporarySum: 0,
      differenceSum: 0,
      currentOrderTotal: this.order.total ?? 0,
      originalOrderTotal: this.order.total ?? 0,
      transactionTotal,
    }
  }

  private isEventActive(action: InternalOrderChangeEvent): boolean {
    const status = action.status
    return (
      status === undefined ||
      status === EVENT_STATUS.PENDING ||
      status === EVENT_STATUS.DONE
    )
  }
  private isEventDone(action: InternalOrderChangeEvent): boolean {
    const status = action.status
    return status === EVENT_STATUS.DONE
  }

  private isEventPending(action: InternalOrderChangeEvent): boolean {
    const status = action.status
    return status === undefined || status === EVENT_STATUS.PENDING
  }

  public processActions() {
    for (const action of this.actions) {
      this.processAction_(action)
    }

    const summary = this.summary
    for (const action of this.actions) {
      if (!this.isEventActive(action)) {
        continue
      }

      const type = {
        ...OrderChangeProcessing.defaultConfig,
        ...OrderChangeProcessing.typeDefinition[action.action],
      }

      const amount = MathBN.mult(action.amount!, type.isDeduction ? -1 : 1)

      if (action.group_id && !action.evaluationOnly) {
        this.groupTotal[action.group_id] ??= 0
        this.groupTotal[action.group_id] = MathBN.add(
          this.groupTotal[action.group_id],
          amount
        )
      }

      if (type.awaitRequired && !this.isEventDone(action)) {
        if (action.evaluationOnly) {
          summary.futureTemporarySum = MathBN.add(
            summary.futureTemporarySum,
            amount
          )
        } else {
          summary.temporaryDifference = MathBN.add(
            summary.temporaryDifference,
            amount
          )
        }
      }

      if (action.evaluationOnly) {
        summary.futureDifference = MathBN.add(summary.futureDifference, amount)
      } else {
        if (!this.isEventDone(action) && !action.group_id) {
          summary.differenceSum = MathBN.add(summary.differenceSum, amount)
        }
        summary.currentOrderTotal = MathBN.add(
          summary.currentOrderTotal,
          amount
        )
      }
    }

    const groupSum = MathBN.add(...Object.values(this.groupTotal))

    summary.differenceSum = MathBN.add(summary.differenceSum, groupSum)

    summary.transactionTotal = MathBN.sum(
      ...this.transactions.map((tr) => tr.amount)
    )

    summary.futureTemporaryDifference = MathBN.sub(
      summary.futureDifference,
      summary.futureTemporarySum
    )

    summary.temporaryDifference = MathBN.sub(
      summary.differenceSum,
      summary.temporaryDifference
    )

    summary.pendingDifference = MathBN.sub(
      summary.currentOrderTotal,
      summary.transactionTotal
    )
  }

  private processAction_(
    action: InternalOrderChangeEvent,
    isReplay = false
  ): BigNumberInput | void {
    const type = {
      ...OrderChangeProcessing.defaultConfig,
      ...OrderChangeProcessing.typeDefinition[action.action],
    }

    this.actionsProcessed[action.action] ??= []

    if (!isReplay) {
      this.actionsProcessed[action.action].push(action)
    }

    let previousEvents: InternalOrderChangeEvent[] | undefined
    if (type.commitsAction) {
      previousEvents = (this.actionsProcessed[type.commitsAction] ?? []).filter(
        (ac_) =>
          ac_.reference_id === action.reference_id &&
          ac_.status !== EVENT_STATUS.VOIDED
      )
    }

    let calculatedAmount = action.amount ?? 0
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
      calculatedAmount = type.operation(params) as BigNumberInput

      // the action.amount has priority over the calculated amount
      if (!isDefined(action.amount)) {
        action.amount = calculatedAmount ?? 0
      }
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
        this.groupTotal[groupId] = MathBN.sub(
          this.groupTotal[groupId],
          action.resolve.amount
        )
      }
    }

    return calculatedAmount
  }

  private resolveReferences(self: InternalOrderChangeEvent) {
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
          let previousEvents: InternalOrderChangeEvent[] | undefined
          if (type.commitsAction) {
            previousEvents = (
              this.actionsProcessed[type.commitsAction] ?? []
            ).filter(
              (ac_) =>
                ac_.reference_id === action.reference_id &&
                ac_.status !== EVENT_STATUS.VOIDED
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

  private resolveGroup(self: InternalOrderChangeEvent) {
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
          let previousEvents: InternalOrderChangeEvent[] | undefined
          if (type.commitsAction) {
            previousEvents = (
              this.actionsProcessed[type.commitsAction] ?? []
            ).filter(
              (ac_) =>
                ac_.reference_id === action.reference_id &&
                ac_.status !== EVENT_STATUS.VOIDED
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

  public getSummary(): OrderSummaryDTO {
    const summary = this.summary
    const orderSummary = {
      transactionTotal: new BigNumber(summary.transactionTotal),
      originalOrderTotal: new BigNumber(summary.originalOrderTotal),
      currentOrderTotal: new BigNumber(summary.currentOrderTotal),
      temporaryDifference: new BigNumber(summary.temporaryDifference),
      futureDifference: new BigNumber(summary.futureDifference),
      futureTemporaryDifference: new BigNumber(
        summary.futureTemporaryDifference
      ),
      pendingDifference: new BigNumber(summary.pendingDifference),
      differenceSum: new BigNumber(summary.differenceSum),
    } as unknown as OrderSummaryDTO

    /*
    {
      total: summary.currentOrderTotal
      
      subtotal: number
      total_tax: number

      ordered_total: summary.originalOrderTotal
      fulfilled_total: number
      returned_total: number
      return_request_total: number
      write_off_total: number
      projected_total: number

      net_total: number
      net_subtotal: number
      net_total_tax: number

      future_total: number
      future_subtotal: number
      future_total_tax: number
      future_projected_total: number

      balance: summary.pendingDifference
      future_balance: number
    }
    */

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
