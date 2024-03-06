import { Discount } from "@medusajs/medusa"
import { end, parse } from "iso8601-duration"

export enum PromotionStatus {
  SCHEDULED = "SCHEDULED",
  EXPIRED = "EXPIRED",
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export const getDiscountStatus = (discount: Discount) => {
  if (discount.is_disabled) {
    return PromotionStatus.DISABLED
  }

  const date = new Date()
  if (new Date(discount.starts_at) > date) {
    return PromotionStatus.SCHEDULED
  }

  if (
    (discount.ends_at && new Date(discount.ends_at) < date) ||
    (discount.valid_duration &&
      date >
        end(parse(discount.valid_duration), new Date(discount.starts_at))) ||
    discount.usage_count === discount.usage_limit
  ) {
    return PromotionStatus.EXPIRED
  }

  return PromotionStatus.ACTIVE
}
