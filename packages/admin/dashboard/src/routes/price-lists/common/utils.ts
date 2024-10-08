import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { json } from "react-router-dom"
import { castNumber } from "../../../lib/cast-number"
import { PriceListDateStatus, PriceListStatus } from "./constants"
import {
  PriceListCreateCurrencyPrice,
  PriceListCreateProductVariantSchema,
  PriceListCreateProductsSchema,
} from "./schemas"

const getValues = (priceList: HttpTypes.AdminPriceList) => {
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
  priceList: HttpTypes.AdminPriceList
) => {
  const { isExpired, isScheduled, isDraft } = getValues(priceList)

  let text = t("priceLists.fields.status.options.active")
  let color: "red" | "grey" | "orange" | "green" = "green"
  let status: string = PriceListStatus.ACTIVE

  if (isDraft) {
    color = "grey"
    text = t("priceLists.fields.status.options.draft")
    status = PriceListStatus.DRAFT
  }

  if (isExpired) {
    color = "red"
    text = t("priceLists.fields.status.options.expired")
    status = PriceListDateStatus.EXPIRED
  }

  if (isScheduled) {
    color = "orange"
    text = t("priceLists.fields.status.options.scheduled")
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

const extractPricesFromVariants = (
  variantId: string,
  variant: PriceListCreateProductVariantSchema,
  regions: HttpTypes.AdminRegion[]
) => {
  const extractPriceDetails = (
    price: PriceListCreateCurrencyPrice,
    priceType: "region" | "currency",
    id: string
  ) => {
    const currencyCode =
      priceType === "currency"
        ? id
        : regions.find((r) => r.id === id)?.currency_code

    if (!currencyCode) {
      throw json({ message: "Currency code not found" }, 400)
    }

    return {
      amount: castNumber(price.amount!),
      ...(priceType === "region" ? { rules: { region_id: id } } : {}),
      currency_code: currencyCode,
      variant_id: variantId,
    }
  }

  const currencyPrices = Object.entries(variant.currency_prices || {}).flatMap(
    ([currencyCode, currencyPrice]) => {
      return currencyPrice?.amount
        ? [extractPriceDetails(currencyPrice, "currency", currencyCode)]
        : []
    }
  )

  const regionPrices = Object.entries(variant.region_prices || {}).flatMap(
    ([regionId, regionPrice]) => {
      return regionPrice?.amount
        ? [extractPriceDetails(regionPrice, "region", regionId)]
        : []
    }
  )

  return [...currencyPrices, ...regionPrices]
}

export const exctractPricesFromProducts = (
  products: PriceListCreateProductsSchema,
  regions: HttpTypes.AdminRegion[]
) => {
  return Object.values(products).flatMap(({ variants }) =>
    Object.entries(variants).flatMap(([variantId, variant]) =>
      extractPricesFromVariants(variantId, variant, regions)
    )
  )
}
