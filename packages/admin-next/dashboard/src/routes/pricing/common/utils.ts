import { HttpTypes, PriceListDTO } from "@medusajs/types"
import { TFunction } from "i18next"
import { PriceListDateStatus, PriceListStatus } from "./constants"

const getValues = (priceList: PriceListDTO) => {
  const startsAt = priceList.starts_at
  const endsAt = priceList.ends_at

  const isExpired = endsAt ? new Date(endsAt) < new Date() : false
  const isScheduled = startsAt ? new Date(startsAt) > new Date() : false
  const isDraft = priceList.status === PriceListStatus.DRAFT

  return {
    isExpired,
    isScheduled,
    isDraft,
  }
}

export const getPriceListStatus = (
  t: TFunction<"translation">,
  priceList: PriceListDTO
) => {
  const { isExpired, isScheduled, isDraft } = getValues(priceList)

  let text = t("pricing.status.active")
  let color: "red" | "grey" | "orange" | "green" = "green"
  let status: string = PriceListStatus.ACTIVE

  if (isDraft) {
    color = "grey"
    text = t("pricing.status.draft")
    status = PriceListStatus.DRAFT
  }

  if (isExpired) {
    color = "red"
    text = t("pricing.status.expired")
    status = PriceListDateStatus.EXPIRED
  }

  if (isScheduled) {
    color = "orange"
    text = t("pricing.status.scheduled")
    status = PriceListDateStatus.SCHEDULED
  }

  return {
    color,
    text,
    status,
  }
}

export const isProductRow = (
  row: HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
): row is HttpTypes.AdminProduct => {
  return "variants" in row
}
