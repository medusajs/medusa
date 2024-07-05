import { BigNumberInput } from "@medusajs/types"

export type VirtualOrder = {
  items: {
    id: string
    unit_price: BigNumberInput
    quantity: BigNumberInput

    detail: {
      id?: string
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
    id: string
    price: BigNumberInput
  }[]

  total: BigNumberInput

  metadata?: Record<string, unknown>
}

export enum EVENT_STATUS {
  PENDING = "pending",
  VOIDED = "voided",
  DONE = "done",
}

export interface OrderSummaryCalculated {
  currentOrderTotal: BigNumberInput
  originalOrderTotal: BigNumberInput
  transactionTotal: BigNumberInput
  futureDifference: BigNumberInput
  pendingDifference: BigNumberInput
  futureTemporaryDifference: BigNumberInput
  temporaryDifference: BigNumberInput
  differenceSum: BigNumberInput
}

export interface OrderTransaction {
  amount: BigNumberInput
}

export interface OrderChangeEvent {
  action: string
  amount?: BigNumberInput

  reference?: string
  reference_id?: string

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
