import { BigNumberInput } from "@medusajs/types"

export type VirtualOrder = {
  id: string

  items: {
    id: string
    order_id: string
    return_id?: string
    claim_id?: string
    exchange_id?: string

    unit_price: BigNumberInput
    quantity: BigNumberInput

    detail: {
      id?: string
      order_id: string
      return_id?: string
      claim_id?: string
      exchange_id?: string

      quantity: BigNumberInput
      shipped_quantity: BigNumberInput
      fulfilled_quantity: BigNumberInput
      return_requested_quantity: BigNumberInput
      return_received_quantity: BigNumberInput
      return_dismissed_quantity: BigNumberInput
      written_off_quantity: BigNumberInput
      metadata?: Record<string, unknown>
    }
  }[]

  shipping_methods: {
    shipping_method_id: string
    order_id: string
    return_id?: string
    claim_id?: string
    exchange_id?: string

    detail?: {
      id?: string
      order_id: string
      return_id?: string
      claim_id?: string
      exchange_id?: string
    }

    price: BigNumberInput
  }[]

  total: BigNumberInput

  transactions?: OrderTransaction[]
  metadata?: Record<string, unknown>
}

export enum EVENT_STATUS {
  PENDING = "pending",
  VOIDED = "voided",
  DONE = "done",
}

export interface OrderSummaryCalculated {
  current_order_total: BigNumberInput
  original_order_total: BigNumberInput
  transaction_total: BigNumberInput
  future_difference: BigNumberInput
  pending_difference: BigNumberInput
  future_temporary_difference: BigNumberInput
  temporary_difference: BigNumberInput
  difference_sum: BigNumberInput
  paid_total: BigNumberInput
  refunded_total: BigNumberInput
}

export interface OrderTransaction {
  amount: BigNumberInput
}

export interface OrderChangeEvent {
  action: string
  amount?: BigNumberInput

  reference?: string
  reference_id?: string

  return_id?: string
  claim_id?: string
  exchange_id?: string

  group_id?: string

  evaluationOnly?: boolean

  details?: any

  resolve?: {
    group_id?: string
    reference_id?: string
    amount?: BigNumberInput
  }
}

export type InternalOrderChangeEvent = OrderChangeEvent & {
  status?: EVENT_STATUS
  original_?: InternalOrderChangeEvent
}

export type OrderReferences = {
  action: InternalOrderChangeEvent
  previousEvents?: InternalOrderChangeEvent[]
  currentOrder: VirtualOrder
  summary: OrderSummaryCalculated
  transactions: OrderTransaction[]
  type: ActionTypeDefinition
  actions: InternalOrderChangeEvent[]
}

export interface ActionTypeDefinition {
  isDeduction?: boolean
  awaitRequired?: boolean
  versioning?: boolean
  void?: boolean
  commitsAction?: string
  operation?: (obj: OrderReferences) => BigNumberInput | void
  revert?: (obj: OrderReferences) => BigNumberInput | void
  validate?: (obj: OrderReferences) => void
  [key: string]: unknown
}
