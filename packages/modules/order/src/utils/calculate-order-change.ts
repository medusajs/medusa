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

interface ProcessOptions {
  addActionReferenceToObject?: boolean
  [key: string]: any
}

export class OrderChangeProcessing {
  private static typeDefinition: { [key: string]: ActionTypeDefinition } = {}
  private static defaultConfig = {
    isDeduction: false,
  }

  private order: VirtualOrder
  private transactions: OrderTransaction[]
  private actions: InternalOrderChangeEvent[]
  private options: ProcessOptions = {}

  private actionsProcessed: { [key: string]: InternalOrderChangeEvent[] } = {}
  private groupTotal: Record<string, BigNumberInput> = {}
  private summary: OrderSummaryCalculated

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
      temporary_difference: 0,
      pending_difference: 0,
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

      if (action.change_id) {
        this.groupTotal[action.change_id] ??= 0
        this.groupTotal[action.change_id] = MathBN.add(
          this.groupTotal[action.change_id],
          amount
        )
      }

      if (type.awaitRequired) {
        summary.temporary_difference = MathBN.add(
          summary.temporary_difference,
          amount
        )
      }

      if (!this.isEventDone(action) && !action.change_id) {
        summary.difference_sum = MathBN.add(summary.difference_sum, amount)
      }
      summary.current_order_total = MathBN.add(
        summary.current_order_total,
        amount
      )
    }

    const groupSum = MathBN.add(...Object.values(this.groupTotal))

    summary.difference_sum = MathBN.add(summary.difference_sum, groupSum)

    summary.transaction_total = MathBN.sum(
      ...this.transactions.map((tr) => tr.amount)
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

    let calculatedAmount = action.amount ?? 0
    const params = {
      actions: this.actions,
      action,
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

    return calculatedAmount
  }

  public getSummary(): OrderSummaryDTO {
    const summary = this.summary
    const orderSummary = {
      transaction_total: new BigNumber(summary.transaction_total),
      original_order_total: new BigNumber(summary.original_order_total),
      current_order_total: new BigNumber(summary.current_order_total),
      temporary_difference: new BigNumber(summary.temporary_difference),
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
