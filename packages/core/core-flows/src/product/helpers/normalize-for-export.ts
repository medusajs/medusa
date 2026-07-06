import {
  BigNumberInput,
  HttpTypes,
  PricingTypes,
  RegionTypes,
} from "@medusajs/framework/types"
import { MedusaError, upperCaseFirst } from "@medusajs/framework/utils"

/**
 * Normalizes product data for export, creating one row per product variant.
 * Products without variants will have a single row, while products with variants
 * will have one row per variant containing both product and variant data.
 *
 * @param product - The array of products to normalize for export.
 * @param regions - Object containing an array of region data used for price formatting.
 * @returns An array of normalized objects ready for export, with flattened product and variant data.
 *
 * @example
 * const normalizedData = normalizeForExport(
 *   [productA, productB],
 *   { regions: [region1, region2] }
 * )
 */
export const normalizeForExport = (
  product: HttpTypes.AdminProduct[],
  { regions }: { regions: RegionTypes.RegionDTO[] }
): object[] => {
  // Currently region names are treated as case-insensitive.
  const regionsMap = new Map(regions.map((r) => [r.id, r]))

  const res = product.reduce((acc: object[], product) => {
    const variants = product.variants ?? []
    if (!variants.length) {
      acc.push(normalizeProductForExport(product))
      return acc
    }

    variants.forEach((v) => {
      const toPush = {
        ...normalizeProductForExport(product),
        ...normalizeVariantForExport(v, regionsMap, product),
      } as any
      delete toPush["Product Variants"]

      acc.push(toPush)
    })

    return acc
  }, [])

  return res
}

const normalizeProductForExport = (product: HttpTypes.AdminProduct): object => {
  const flattenedImages = product.images?.reduce(
    (acc: Record<string, string>, image, idx) => {
      acc[beautifyKey(`product_image_${idx + 1}`)] = image.url
      return acc
    },
    {}
  )

  const flattenedTags = product.tags?.reduce(
    (acc: Record<string, string>, tag, idx) => {
      acc[beautifyKey(`product_tag_${idx + 1}`)] = tag.value
      return acc
    },
    {}
  )

  const flattenedSalesChannels = product.sales_channels?.reduce(
    (acc: Record<string, string>, salesChannel, idx) => {
      acc[beautifyKey(`product_sales_channel_${idx + 1}`)] = salesChannel.id
      return acc
    },
    {}
  )

  const flattenedCategories = product.categories?.reduce(
    (acc: Record<string, string>, category, idx) => {
      acc[beautifyKey(`product_category_${idx + 1}`)] = category.id
      return acc
    },
    {}
  )

  const res = {
    ...prefixFields(product, "product"),
    ...flattenedImages,
    ...flattenedTags,
    ...flattenedSalesChannels,
    ...flattenedCategories,
  } as any

  delete res["Product Images"]
  delete res["Product Tags"]
  delete res["Product Sales Channels"]
  delete res["Product Categories"]

  // We can decide if we want the metadata in the export and how that would look like
  delete res["Product Metadata"]

  // We only want the IDs for the type and collection
  delete res["Product Type"]
  delete res["Product Collection"]

  // We just rely on the variant options to reconstruct the product options, so we want to
  // omit the product options to keep the file simpler
  delete res["Product Options"]

  return res
}

const normalizeVariantForExport = (
  variant: HttpTypes.AdminProductVariant & {
    price_set?: PricingTypes.PriceSetDTO
  },
  regionsMap: Map<string, RegionTypes.RegionDTO>,
  product: HttpTypes.AdminProduct
): object => {
  const flattenedPrices = variant.price_set?.prices
    ?.sort((a, b) => b.currency_code!.localeCompare(a.currency_code!))
    .reduce((acc: Record<string, BigNumberInput>, price) => {
      const regionRule = price.price_rules?.find(
        (r) => r.attribute === "region_id"
      )

      if (regionRule) {
        const region = regionsMap.get(regionRule?.value!)
        if (!region) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Region with id ${regionRule?.value} not found`
          )
        }

        const regionKey = `variant_price_${region.name
          .toLowerCase()
          .split(" ")
          .join("_")}_[${region.currency_code.toUpperCase()}]`

        acc[beautifyKey(regionKey)] = price.amount!
      } else if (!price.price_rules?.length) {
        acc[
          beautifyKey(`variant_price_${price.currency_code!.toUpperCase()}`)
        ] = price.amount!
      }
      return acc
    }, {})

  const options = product.options ?? []

  const flattenedOptions = variant.options?.reduce(
    (acc: Record<string, string>, option, idx) => {
      const prodOptions = options.find(
        (prodOption) => prodOption.id === option.option_id
      )
      acc[beautifyKey(`variant_option_${idx + 1}_name`)] = prodOptions?.title!
      acc[beautifyKey(`variant_option_${idx + 1}_value`)] = option.value
      return acc
    },
    {}
  )

  const flattenedImages = variant.images?.reduce(
    (acc: Record<string, string>, image, idx) => {
      acc[beautifyKey(`variant_image_${idx + 1}`)] = image.url
      return acc
    },
    {}
  )

  const res = {
    ...prefixFields(variant, "variant"),
    ...flattenedPrices,
    ...flattenedOptions,
    ...flattenedImages,
  } as any
  delete res["Variant Price Set"]
  delete res["Variant Options"]
  delete res["Variant Images"]

  return res
}

const prefixFields = (obj: object, prefix: string): object => {
  const res = {}
  Object.keys(obj).forEach((key) => {
    res[beautifyKey(`${prefix}_${key}`)] = obj[key]
  })

  return res
}

const beautifyKey = (key: string): string => {
  return key.split("_").map(upperCaseFirst).join(" ")
}
