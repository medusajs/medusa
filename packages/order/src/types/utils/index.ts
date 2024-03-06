export type VirtualOrder = {
  items: {
    id: string
    unit_price: number
    quantity: number

    fulfilled_quantity: number
    return_requested_quantity: number
    return_received_quantity: number
    return_dismissed_quantity: number
    written_off_quantity: number
  }[]

  shipping_methods: {
    id: string
    price: number
  }[]

  total: number
  shipping_total: number
}

export enum EVENT_STATUS {
  PENDING = "pending",
  VOIDED = "voided",
  DONE = "done",
}

export interface OrderSummary {
  currentOrderTotal: number
  originalOrderTotal: number
  transactionTotal: number
  futureDifference: number
  pendingDifference: number
  futureTemporaryDifference: number
  temporaryDifference: number
  differenceSum: number
}

export interface OrderTransaction {
  amount: number
}

export interface OrderChangeEvent {
  action: string
  amount?: number

  reference?: string
  reference_id?: string

  group_id?: string

  evaluationOnly?: boolean

  details?: any

  resolve?: {
    group_id?: string
    reference_id?: string
    amount?: number
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
  summary: OrderSummary
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
  operation?: (obj: OrderReferences) => number | void
  revert?: (obj: OrderReferences) => number | void
  validate?: (obj: OrderReferences) => void
  [key: string]: unknown
}
