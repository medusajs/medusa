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
  [key: string]: unknown
}

export interface OrderChangeEvent {
  action: string
  amount?: number

  reference?: string
  reference_id?: string

  group_id?: string

  evaluationOnly?: boolean

  details?: any
  status?: EVENT_STATUS

  resolve?: {
    group_id?: string
    reference_id?: string
    amount?: number
  }
  original_?: OrderChangeEvent
}

export type OrderReferences = {
  action: OrderChangeEvent
  previousEvents?: OrderChangeEvent[]
  currentOrder: VirtualOrder
  summary: OrderSummary
  transactions: OrderTransaction[]
  type: ActionTypeDefinition
  actions: OrderChangeEvent[]
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
