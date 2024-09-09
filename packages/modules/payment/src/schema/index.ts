export default `
enum PaymentCollectionStatus {
  not_paid
  awaiting
  authorized
  partially_authorized
  canceled
}

enum PaymentSessionStatus {
  authorized
  captured
  pending
  requires_more
  error
  canceled
}

type PaymentCollection {
  id: ID!
  currency_code: String!
  region_id: String!
  amount: Float!
  authorized_amount: Float
  refunded_amount: Float
  captured_amount: Float
  completed_at: DateTime
  created_at: DateTime
  updated_at: DateTime
  metadata: JSON
  status: PaymentCollectionStatus!
  payment_providers: [PaymentProviderDTO!]!
  payment_sessions: [PaymentSessionDTO]
  payments: [PaymentDTO]
}

type Payment {
  id: ID!
  amount: Float!
  raw_amount: Float
  authorized_amount: Float
  raw_authorized_amount: Float
  currency_code: String!
  provider_id: String!
  cart_id: String
  order_id: String
  order_edit_id: String
  customer_id: String
  data: JSON
  created_at: DateTime
  updated_at: DateTime
  captured_at: DateTime
  canceled_at: DateTime
  captured_amount: Float
  raw_captured_amount: Float
  refunded_amount: Float
  raw_refunded_amount: Float
  captures: [CaptureDTO]
  refunds: [RefundDTO]
  payment_collection_id: String!
  payment_collection: PaymentCollectionDTO
  payment_session: PaymentSessionDTO
}

type Capture {
  id: ID!
  amount: Float!
  created_at: DateTime!
  created_by: String
  payment: Payment!
}

type Refund {
  id: ID!
  amount: Float!
  refund_reason_id: String
  refund_reason: RefundReason
  note: String
  created_at: DateTime!
  created_by: String
  payment: Payment!
}

type PaymentSession {
  id: ID!
  amount: Float!
  currency_code: String!
  provider_id: String!
  data: JSON!
  context: JSON
  status: PaymentSessionStatus!
  authorized_at: DateTime
  payment_collection_id: String!
  payment_collection: PaymentCollection
  payment: Payment
}

type PaymentProvider {
  id: ID!
  is_enabled: String!
}

type RefundReason {
  id: ID!
  label: String!
  description: String
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
}
`
