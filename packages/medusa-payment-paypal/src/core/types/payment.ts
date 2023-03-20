import { Links, MoneyAmount, PaymentInstruction } from "./common"

export interface CapturesRefund {
  amount?: MoneyAmount
  invoice_id?: string
  note_to_payer?: string
  payment_instruction?: PaymentInstruction
}

export interface CapturesRefundResponse {
  id: string
  amount: MoneyAmount
  status: string
  note: string
  seller_payable_breakdown: any
  invoice_id: string
  create_time: string
  update_time: string
  links: Links
}
