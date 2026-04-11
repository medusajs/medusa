import {
  BigNumberInput,
  OrderDTO,
  OrderSummaryDTO,
} from "@medusajs/framework/types"
import {
  BigNumber,
  ChangeActionType,
  MathBN,
  isPresent,
  transformPropertiesToBigNumber,
} from "@medusajs/framework/utils"
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
    let creditLineTotal = (this.order.credit_lines || []).reduce(
      (acc, creditLine) => MathBN.add(acc, creditLine.amount),
      MathBN.convert(0)
    )

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
      pending_difference: 0,
      current_order_total: this.order.total ?? 0,
      original_order_total: this.order.total ?? 0,
      transaction_total: transactionTotal,
      paid_total: paid,
      refunded_total: refunded,
      credit_line_total: creditLineTotal,
      accounting_total: MathBN.sub(this.order.total ?? 0, creditLineTotal),
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

  public processActions() {
    let newCreditLineTotal = (this.order.credit_lines ?? [])
      .filter((cl) => !("id" in cl))
      .reduce(
        (acc, creditLine) => MathBN.add(acc, creditLine.amount),
        MathBN.convert(0)
      )

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

      if (action.action === ChangeActionType.CREDIT_LINE_ADD) {
        newCreditLineTotal = MathBN.add(newCreditLineTotal, amount)
        summary.current_order_total = MathBN.sub(
          summary.current_order_total,
          amount
        )
      } else {
        summary.current_order_total = MathBN.add(
          summary.current_order_total,
          amount
        )
      }
    }

    summary.credit_line_total = newCreditLineTotal
    summary.accounting_total = summary.current_order_total

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
  ): void {
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
      if (action.amount == undefined) {
        action.amount = calculatedAmount ?? 0
      }
    }
  }

  /**
   * Only used for order creation.
   */
  public getSummary(): OrderSummaryDTO {
    const summary = this.summary
    const orderSummary = {
      transaction_total: new BigNumber(summary.transaction_total),
      original_order_total: new BigNumber(summary.original_order_total),
      current_order_total: new BigNumber(summary.current_order_total),
      pending_difference: new BigNumber(summary.pending_difference),
      paid_total: new BigNumber(summary.paid_total),
      refunded_total: new BigNumber(summary.refunded_total),
      credit_line_total: new BigNumber(summary.credit_line_total),
      accounting_total: new BigNumber(summary.accounting_total),
    } as unknown as OrderSummaryDTO

    return orderSummary
  }

  // Returns the order summary from a calculated order including taxes <- this is used for order preview flow
  public getSummaryFromOrder(order: OrderDTO): OrderSummaryDTO {
    const summary_ = this.summary
    const total = order.total
    const pendingDifference = MathBN.sub(total, summary_.transaction_total)

    const orderSummary = {
      transaction_total: new BigNumber(summary_.transaction_total),
      original_order_total: new BigNumber(summary_.original_order_total),
      current_order_total: new BigNumber(total),
      pending_difference: new BigNumber(pendingDifference),
      paid_total: new BigNumber(summary_.paid_total),
      refunded_total: new BigNumber(summary_.refunded_total),
      credit_line_total: new BigNumber(summary_.credit_line_total),
      accounting_total: new BigNumber(summary_.accounting_total),
    } as any

    orderSummary.accounting_total = orderSummary.current_order_total

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
    instance: calc,
    summary: calc.getSummary(), // used for order creation, in other flows we call `getSummaryFromOrder` to get values from calculated totals
    getSummaryFromOrder: (order: OrderDTO) => calc.getSummaryFromOrder(order),
    order: calc.getCurrentOrder(),
  }
}
