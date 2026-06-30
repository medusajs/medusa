import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { json } from "react-router-dom"
import { castNumber } from "../../../lib/cast-number"
import { PriceListDateStatus, PriceListStatus } from "./constants"
import {
  PriceListCreateCurrencyPrice,
  PriceListCreateProductVariantSchema,
  PriceListCreateProductsSchema,
  PriceListUpdateProductsSchema,
  PriceListUpdateProductVariantsSchema,
  PriceListUpdateCurrencyPrice,
  PriceListUpdateRegionPrice,
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

    const rules: Record<string, string> = {}
    if (priceType === "region") {
      rules.region_id = id
    }
    if (price.min_quantity) {
      rules.min_quantity = price.min_quantity.toString()
    }
    if (price.max_quantity) {
      rules.max_quantity = price.max_quantity.toString()
    }

    return {
      amount: castNumber(price.amount!),
      currency_code: currencyCode,
      variant_id: variantId,
      rules: Object.keys(rules).length > 0 ? rules : undefined,
    }
  }

  const processPrices = (
    pricesMap:
      | Record<string, PriceListCreateCurrencyPrice[] | undefined>
      | undefined,
    priceType: "region" | "currency"
  ) => {
    return Object.entries(pricesMap || {}).flatMap(([id, prices]) => {
      return (prices || []).flatMap((price) =>
        price?.amount ? [extractPriceDetails(price, priceType, id)] : []
      )
    })
  }

  const currencyPrices = processPrices(variant.currency_prices, "currency")
  const conditionalCurrencyPrices = processPrices(
    variant.conditional_currency_prices,
    "currency"
  )
  const regionPrices = processPrices(variant.region_prices, "region")
  const conditionalRegionPrices = processPrices(
    variant.conditional_region_prices,
    "region"
  )

  return [
    ...currencyPrices,
    ...conditionalCurrencyPrices,
    ...regionPrices,
    ...conditionalRegionPrices,
  ]
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

export function initRecord(
  priceList: HttpTypes.AdminPriceList,
  products: HttpTypes.AdminProduct[]
): PriceListUpdateProductsSchema {
  const record: PriceListUpdateProductsSchema = {}

  const variantPrices = priceList.prices?.reduce((variants, price) => {
    const variantObject = variants[price.variant_id] || {}

    const isRegionPrice = !!price.rules?.region_id

    const isTiered = !!(price.rules?.min_quantity || price.rules?.max_quantity)

    if (isRegionPrice) {
      const regionId = price.rules.region_id as string
      const field = isTiered ? "conditional_region_prices" : "region_prices"
      ;(variantObject[field] = variantObject[field] || {})[regionId] = [
        ...(variantObject[field]?.[regionId] || []),
        {
          amount: price.amount.toString(),
          id: price.id,
          min_quantity: price.rules?.min_quantity?.toString(),
          max_quantity: price.rules?.max_quantity?.toString(),
        },
      ]
    } else {
      const field = isTiered ? "conditional_currency_prices" : "currency_prices"
      ;(variantObject[field] = variantObject[field] || {})[
        price.currency_code
      ] = [
        ...(variantObject[field]?.[price.currency_code] || []),
        {
          amount: price.amount.toString(),
          id: price.id,
          min_quantity: price.rules?.min_quantity?.toString(),
          max_quantity: price.rules?.max_quantity?.toString(),
        },
      ]
    }

    variants[price.variant_id] = variantObject
    return variants
  }, {} as PriceListUpdateProductVariantsSchema)

  for (const product of products) {
    record[product.id] = {
      variants:
        product.variants?.reduce((variants, variant) => {
          const prices = variantPrices[variant.id] || {}
          variants[variant.id] = {
            currency_prices: prices.currency_prices || {},
            region_prices: prices.region_prices || {},
            conditional_currency_prices:
              prices.conditional_currency_prices || {},
            conditional_region_prices: prices.conditional_region_prices || {},
          }
          return variants
        }, {} as PriceListUpdateProductVariantsSchema) || {},
    }
  }

  return record
}

type PriceObject = {
  variantId: string
  currencyCode: string
  regionId?: string
  amount: number
  id?: string | null
  minQuantity?: number
  maxQuantity?: number
}

export function convertToPriceArray(
  data: PriceListUpdateProductsSchema,
  regions: HttpTypes.AdminRegion[]
) {
  const prices: PriceObject[] = []

  const regionCurrencyMap = regions.reduce((map, region) => {
    map[region.id] = region.currency_code
    return map
  }, {} as Record<string, string>)

  for (const [_productId, product] of Object.entries(data || {})) {
    const { variants } = product || {}

    for (const [variantId, variant] of Object.entries(variants || {})) {
      const {
        currency_prices: variantCurrencyPrices,
        region_prices: variantRegionPrices,
      } = variant || {}

      const processCurrencyPrices = (
        currencyPricesMap:
          | Record<string, PriceListUpdateCurrencyPrice[] | undefined>
          | undefined
      ) => {
        for (const [currencyCode, currencyPrices] of Object.entries(
          currencyPricesMap || {}
        )) {
          ;(
            (currencyPrices as PriceListUpdateCurrencyPrice[] | undefined) || []
          ).forEach((currencyPrice: PriceListUpdateCurrencyPrice) => {
            if (
              currencyPrice?.amount !== "" &&
              typeof currencyPrice?.amount !== "undefined"
            ) {
              prices.push({
                variantId,
                currencyCode,
                amount: castNumber(currencyPrice.amount),
                id: currencyPrice.id,
                minQuantity: currencyPrice.min_quantity
                  ? castNumber(currencyPrice.min_quantity)
                  : undefined,
                maxQuantity: currencyPrice.max_quantity
                  ? castNumber(currencyPrice.max_quantity)
                  : undefined,
              })
            }
          })
        }
      }

      processCurrencyPrices(variantCurrencyPrices)
      processCurrencyPrices(variant.conditional_currency_prices)

      const processRegionPrices = (
        regionPricesMap:
          | Record<string, PriceListUpdateRegionPrice[] | undefined>
          | undefined
      ) => {
        for (const [regionId, regionPrices] of Object.entries(
          regionPricesMap || {}
        )) {
          ;(
            (regionPrices as PriceListUpdateRegionPrice[] | undefined) || []
          ).forEach((regionPrice: PriceListUpdateRegionPrice) => {
            if (
              regionPrice?.amount !== "" &&
              typeof regionPrice?.amount !== "undefined"
            ) {
              prices.push({
                variantId,
                regionId,
                currencyCode: regionCurrencyMap[regionId],
                amount: castNumber(regionPrice.amount),
                id: regionPrice.id,
                minQuantity: regionPrice.min_quantity
                  ? castNumber(regionPrice.min_quantity)
                  : undefined,
                maxQuantity: regionPrice.max_quantity
                  ? castNumber(regionPrice.max_quantity)
                  : undefined,
              })
            }
          })
        }
      }

      processRegionPrices(variantRegionPrices)
      processRegionPrices(variant.conditional_region_prices)
    }
  }

  return prices
}

function createMapKey(obj: PriceObject) {
  if (obj.id) {
    return `id-${obj.id}`
  }
  return `${obj.variantId}-${obj.currencyCode}-${obj.regionId || "none"}-${
    obj.amount
  }-${obj.minQuantity || "none"}-${obj.maxQuantity || "none"}`
}

export function comparePrices(
  initialPrices: PriceObject[],
  newPrices: PriceObject[]
) {
  const pricesToUpdate: HttpTypes.AdminUpdatePriceListPrice[] = []
  const pricesToCreate: HttpTypes.AdminCreatePriceListPrice[] = []
  const pricesToDelete: string[] = []

  const initialPriceMap = initialPrices.reduce((map, price) => {
    map[createMapKey(price)] = price
    return map
  }, {} as Record<string, (typeof initialPrices)[0]>)

  const newPriceMap = newPrices.reduce((map, price) => {
    map[createMapKey(price)] = price
    return map
  }, {} as Record<string, (typeof newPrices)[0]>)

  const keys = new Set([
    ...Object.keys(initialPriceMap),
    ...Object.keys(newPriceMap),
  ])

  for (const key of keys) {
    const initialPrice = initialPriceMap[key]
    const newPrice = newPriceMap[key]

    if (initialPrice && newPrice) {
      if (isNaN(newPrice.amount) && newPrice.id) {
        pricesToDelete.push(newPrice.id)
      } else if (
        initialPrice.amount !== newPrice.amount ||
        initialPrice.minQuantity !== newPrice.minQuantity ||
        initialPrice.maxQuantity !== newPrice.maxQuantity
      ) {
        if (newPrice.id) {
          pricesToUpdate.push({
            id: newPrice.id,
            variant_id: newPrice.variantId,
            currency_code: newPrice.currencyCode,
            amount: newPrice.amount,
            rules: {
              ...(newPrice.regionId ? { region_id: newPrice.regionId } : {}),
              ...(newPrice.minQuantity
                ? { min_quantity: newPrice.minQuantity.toString() }
                : {}),
              ...(newPrice.maxQuantity
                ? { max_quantity: newPrice.maxQuantity.toString() }
                : {}),
            },
          })
        }
      }
    }

    if (!initialPrice && newPrice) {
      pricesToCreate.push({
        variant_id: newPrice.variantId,
        currency_code: newPrice.currencyCode,
        amount: newPrice.amount,
        rules: {
          ...(newPrice.regionId ? { region_id: newPrice.regionId } : {}),
          ...(newPrice.minQuantity
            ? { min_quantity: newPrice.minQuantity.toString() }
            : {}),
          ...(newPrice.maxQuantity
            ? { max_quantity: newPrice.maxQuantity.toString() }
            : {}),
        },
      })
    }

    if (initialPrice && !newPrice && initialPrice.id) {
      pricesToDelete.push(initialPrice.id)
    }
  }

  return { pricesToDelete, pricesToCreate, pricesToUpdate }
}

export function sortPrices(
  data: PriceListUpdateProductsSchema,
  initialValue: PriceListUpdateProductsSchema,
  regions: HttpTypes.AdminRegion[]
) {
  const initialPrices = convertToPriceArray(initialValue, regions)
  const newPrices = convertToPriceArray(data, regions)

  return comparePrices(initialPrices, newPrices)
}

export function formatQuantityPrices(
  prices: {
    amount?: string
    min_quantity?: string | null
    max_quantity?: string | null
    id?: string
  }[]
): PriceListUpdateCurrencyPrice[] {
  return prices
    .filter((p) => p.amount && p.amount.trim() !== "")
    .map((p) => ({
      ...p,
      amount: castNumber(p.amount!),
      min_quantity: p.min_quantity ? castNumber(p.min_quantity) : undefined,
      max_quantity: p.max_quantity ? castNumber(p.max_quantity) : undefined,
    }))
}
