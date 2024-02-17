export type TransactionDTO = {
  id: string
  order_id: string
  reference_id: string
  referece: string
  amount: string
  currency_code: string
  status: string
  type: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
