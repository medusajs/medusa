import {
  MedusaError,
  OrderStatus,
  PromotionStatus,
} from "@zjedene-medusa/framework/utils"
import type { OrderDTO, PromotionDTO } from "@zjedene-medusa/framework/types"

interface ThrowIfNotDraftOrderInput {
  order: OrderDTO
}

export function throwIfNotDraftOrder({ order }: ThrowIfNotDraftOrderInput) {
  if (order.status !== OrderStatus.DRAFT && !order.is_draft_order) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Order is not a draft"
    )
  }
}

function getMessageByCount(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

export function throwIfCodesAreMissing(
  promo_codes: string[],
  promotions: PromotionDTO[]
) {
  const missingPromoCodes = promo_codes.filter(
    (code) => !promotions.some((promotion) => promotion.code === code)
  )

  if (missingPromoCodes.length > 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      getMessageByCount(
        missingPromoCodes.length,
        `Promotion code "${missingPromoCodes[0]}" not found`,
        `Promotion codes "${missingPromoCodes.join('", "')}" not found`
      )
    )
  }
}

export function throwIfCodesAreInactive(
  promo_codes: string[],
  promotions: PromotionDTO[]
) {
  const inactivePromoCodes = promo_codes.filter((code) =>
    promotions.some(
      (promotion) =>
        promotion.code === code && promotion.status !== PromotionStatus.ACTIVE
    )
  )

  if (inactivePromoCodes.length > 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      getMessageByCount(
        inactivePromoCodes.length,
        `Promotion code "${inactivePromoCodes[0]}" is not active`,
        `Promotion codes "${inactivePromoCodes.join('", "')}" are not active`
      )
    )
  }
}
