import { BigNumberInput, OrderSummaryDTO } from "@medusajs/types"
import {
  BigNumber,
  MathBN,
  isDefined,
  isPresent,
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

interface InternalOrderSummary extends OrderSummaryCalculated {
  future_temporary_sum: BigNumberInput
}
interface ProcessOptions {
  addActionReferenceToObject?: boolean
  [key: string]: any
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
  private options: ProcessOptions = {}

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
    options,
  }: {
    order: VirtualOrder
    transactions: OrderTransaction[]
    actions: InternalOrderChangeEvent[]
    options: ProcessOptions
  }) {
    this.order = JSON.parse(JSON.stringify(order))
    this.transactions = JSON.parse(JSON.stringify(transactions ?? []))
    this.actions = JSON.parse(JSON.stringify(actions ?? []))
    this.options = options

    let paid = MathBN.convert(0)
    let refunded = MathBN.convert(0)
    let transactionTotal = MathBN.convert(0)

    for (const tr of transactions) {
      if (MathBN.lt(tr.amount, 0)) {
        refunded = MathBN.add(refunded, MathBN.abs(tr.amount))
      } else {
        paid = MathBN.add(paid, tr.amount)
      }
      transactionTotal = MathBN.add(transactionTotal, tr.amount)
    }

    transformPropertiesToBigNumber(this.order.metadata)

    this.summary = {
      future_difference: 0,
      future_temporary_difference: 0,
      temporary_difference: 0,
      pending_difference: 0,
      future_temporary_sum: 0,
      difference_sum: 0,
      current_order_total: this.order.total ?? 0,
      original_order_total: this.order.total ?? 0,
      transaction_total: transactionTotal,
      paid_total: paid,
      refunded_total: refunded,
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

      if (action.change_id && !action.evaluationOnly) {
        this.groupTotal[action.change_id] ??= 0
        this.groupTotal[action.change_id] = MathBN.add(
          this.groupTotal[action.change_id],
          amount
        )
      }

      if (type.awaitRequired && !this.isEventDone(action)) {
        if (action.evaluationOnly) {
          summary.future_temporary_sum = MathBN.add(
            summary.future_temporary_sum,
            amount
          )
        } else {
          summary.temporary_difference = MathBN.add(
            summary.temporary_difference,
            amount
          )
        }
      }

      if (action.evaluationOnly) {
        summary.future_difference = MathBN.add(
          summary.future_difference,
          amount
        )
      } else {
        if (!this.isEventDone(action) && !action.change_id) {
          summary.difference_sum = MathBN.add(summary.difference_sum, amount)
        }
        summary.current_order_total = MathBN.add(
          summary.current_order_total,
          amount
        )
      }
    }

    const groupSum = MathBN.add(...Object.values(this.groupTotal))

    summary.difference_sum = MathBN.add(summary.difference_sum, groupSum)

    summary.transaction_total = MathBN.sum(
      ...this.transactions.map((tr) => tr.amount)
    )

    summary.future_temporary_difference = MathBN.sub(
      summary.future_difference,
      summary.future_temporary_sum
    )

    summary.temporary_difference = MathBN.sub(
      summary.difference_sum,
      summary.temporary_difference
    )

    summary.pending_difference = MathBN.sub(
      summary.current_order_total,
      summary.transaction_total
    )
  }

  private processAction_(
    action: InternalOrderChangeEvent,
    isReplay = false
  ): BigNumberInput | void {
    const definedType = OrderChangeProcessing.typeDefinition[action.action]
    if (!isPresent(definedType)) {
      throw new Error(`Action type ${action.action} is not defined`)
    }

    const type = {
      ...OrderChangeProcessing.defaultConfig,
      ...definedType,
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
      options: this.options,
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
      const groupId = action.resolve.change_id ?? "__default"
      if (action.resolve.change_id) {
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
        if (!resolve?.change_id || action?.change_id !== resolve.change_id) {
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
      transaction_total: new BigNumber(summary.transaction_total),
      original_order_total: new BigNumber(summary.original_order_total),
      current_order_total: new BigNumber(summary.current_order_total),
      temporary_difference: new BigNumber(summary.temporary_difference),
      future_difference: new BigNumber(summary.future_difference),
      future_temporary_difference: new BigNumber(
        summary.future_temporary_difference
      ),
      pending_difference: new BigNumber(summary.pending_difference),
      difference_sum: new BigNumber(summary.difference_sum),
      paid_total: new BigNumber(summary.paid_total),
      refunded_total: new BigNumber(summary.refunded_total),
    } as unknown as OrderSummaryDTO

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
  options = {},
}: {
  order: VirtualOrder
  transactions?: OrderTransaction[]
  actions?: OrderChangeEvent[]
  options?: ProcessOptions
}) {
  const calc = new OrderChangeProcessing({
    order,
    transactions,
    actions,
    options,
  })
  calc.processActions()

  return {
    summary: calc.getSummary(),
    order: calc.getCurrentOrder(),
  }
}
