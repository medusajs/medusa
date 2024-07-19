import { BigNumberInput, HttpTypes, PricingTypes } from "@medusajs/types"
import { upperCaseFirst } from "@medusajs/utils"

// We want to have one row per variant, so we need to normalize the data
export const normalizeForExport = (
  product: HttpTypes.AdminProduct[]
): object[] => {
  const res = product.reduce((acc: object[], product) => {
    const variants = product.variants ?? []
    if (!variants.length) {
      acc.push(normalizeProductForExport(product))
      return acc
    }

    variants.forEach((v) => {
      const toPush = {
        ...normalizeProductForExport(product),
        ...normalizeVariantForExport(v),
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

  const res = {
    ...prefixFields(product, "product"),
    ...flattenedImages,
    ...flattenedTags,
    ...flattenedSalesChannels,
  } as any

  delete res["Product Images"]
  delete res["Product Tags"]
  delete res["Product Sales Channels"]

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
  }
): object => {
  const flattenedPrices = variant.price_set?.prices?.reduce(
    (acc: Record<string, BigNumberInput>, price) => {
      const regionRule = price.price_rules?.find(
        (r) => r.attribute === "region"
      )
      if (regionRule) {
        acc[beautifyKey(`variant_price_${regionRule.value}`)] = price.amount!
      } else if (!price.price_rules?.length) {
        acc[
          beautifyKey(`variant_price_${price.currency_code!.toUpperCase()}`)
        ] = price.amount!
      }
      return acc
    },
    {}
  )

  const flattenedOptions = variant.options?.reduce(
    (acc: Record<string, string>, option, idx) => {
      acc[beautifyKey(`variant_option_${idx + 1}_name`)] = option.option?.title!
      acc[beautifyKey(`variant_option_${idx + 1}_value`)] = option.value
      return acc
    },
    {}
  )

  const res = {
    ...prefixFields(variant, "variant"),
    ...flattenedPrices,
    ...flattenedOptions,
  } as any
  delete res["Variant Price Set"]
  delete res["Variant Options"]

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
