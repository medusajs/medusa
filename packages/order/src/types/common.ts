import { BigNumber } from "@medusajs/utils"

export type OrderSummary = {
  total: BigNumber
  subtotal: BigNumber
  total_tax: BigNumber

  ordered_total: BigNumber
  fulfilled_total: BigNumber
  returned_total: BigNumber
  return_request_total: BigNumber
  write_off_total: BigNumber
  projected_total: BigNumber

  net_total: BigNumber
  net_subtotal: BigNumber
  net_total_tax: BigNumber

  future_total: BigNumber
  future_subtotal: BigNumber
  future_total_tax: BigNumber
  future_projected_total: BigNumber

  balance: BigNumber
  future_balance: BigNumber
}
