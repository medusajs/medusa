import { ProductTypes } from "@medusajs/types"
import { HttpTypes, RegionTypes } from "@medusajs/types"
import { MedusaError, lowerCaseFirst } from "@medusajs/utils"

// We want to convert the csv data format to a standard DTO format.
export const normalizeForImport = (
  rawProducts: object[],
  additional: {
    regions: RegionTypes.RegionDTO[]
    tags: ProductTypes.ProductTagDTO[]
  }
): HttpTypes.AdminCreateProduct[] => {
  const productMap = new Map<
    string,
    {
      product: HttpTypes.AdminCreateProduct
      variants: HttpTypes.AdminCreateProductVariant[]
    }
  >()

  // Currently region names are treated as case-insensitive.
  const regionsMap = new Map(
    additional.regions.map((r) => [r.name.toLowerCase(), r])
  )
  const tagsMap = new Map(additional.tags.map((t) => [t.value, t]))

  rawProducts.forEach((rawProduct) => {
    const productInMap = productMap.get(rawProduct["Product Handle"])
    if (!productInMap) {
      productMap.set(rawProduct["Product Handle"], {
        product: normalizeProductForImport(rawProduct, tagsMap),
        variants: [normalizeVariantForImport(rawProduct, regionsMap)],
      })
      return
    }

    productMap.set(rawProduct["Product Handle"], {
      product: productInMap.product,
      variants: [
        ...productInMap.variants,
        normalizeVariantForImport(rawProduct, regionsMap),
      ],
    })
  })

  return Array.from(productMap.values()).map((p) => {
    const options = p.variants.reduce(
      (agg: Record<string, Set<string>>, variant) => {
        Object.entries(variant.options ?? {}).forEach(([key, value]) => {
          if (!agg[key]) {
            agg[key] = new Set()
          }

          agg[key].add(value as string)
        })

        return agg
      },
      {}
    )

    return {
      ...p.product,
      options: Object.entries(options).map(([key, value]) => ({
        title: key,
        values: Array.from(value),
      })),
      variants: p.variants,
    }
  })
}

const productFieldsToOmit = new Map()
const variantFieldsToOmit = new Map([["variant_product_id", true]])

// We use an array here as we do a substring matching as a check.
// These fields can have a numeric value, but they are stored as string in the DB so we need to normalize them
const stringFields = [
  "product_tag_",
  "variant_option_",
  "variant_barcode",
  "variant_sku",
  "variant_ean",
  "variant_upc",
  "variant_hs_code",
  "variant_mid_code",
]

const booleanFields = [
  "product_discountable",
  "variant_manage_inventory",
  "variant_allow_backorder",
]

const normalizeProductForImport = (
  rawProduct: object,
  tagsMap: Map<string, ProductTypes.ProductTagDTO>
): HttpTypes.AdminCreateProduct => {
  const response = {}

  Object.entries(rawProduct).forEach(([key, value]) => {
    const normalizedKey = snakecaseKey(key)
    const normalizedValue = getNormalizedValue(normalizedKey, value)

    // We have no way of telling if a field is set as an empty string or it was undefined, so we completely omit empty fields.
    if (normalizedValue === "") {
      return
    }

    if (normalizedKey.startsWith("product_image_")) {
      response["images"] = [
        ...(response["images"] || []),
        { url: normalizedValue },
      ]
      return
    }

    if (normalizedKey.startsWith("product_tag_")) {
      const tag = tagsMap.get(normalizedValue)
      if (!tag) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Tag with value ${normalizedValue} not found`
        )
      }

      response["tags"] = [...(response["tags"] || []), { id: tag.id }]
      return
    }

    if (normalizedKey.startsWith("product_sales_channel_")) {
      response["sales_channels"] = [
        ...(response["sales_channels"] || []),
        { id: normalizedValue },
      ]
      return
    }

    if (normalizedKey.startsWith("product_category_")) {
      response["categories"] = [
        ...(response["categories"] || []),
        { id: normalizedValue },
      ]
      return
    }

    if (
      normalizedKey.startsWith("product_") &&
      !productFieldsToOmit.has(normalizedKey)
    ) {
      response[normalizedKey.replace("product_", "")] = normalizedValue
      return
    }
  })

  return response as HttpTypes.AdminCreateProduct
}

const normalizeVariantForImport = (
  rawProduct: object,
  regionsMap: Map<string, RegionTypes.RegionDTO>
): HttpTypes.AdminCreateProductVariant => {
  const response = {}
  const options = new Map<number, { name?: string; value?: string }>()

  Object.entries(rawProduct).forEach(([key, value]) => {
    const normalizedKey = snakecaseKey(key)
    const normalizedValue = getNormalizedValue(normalizedKey, value)

    // We have no way of telling if a field is set as an empty string or it was undefined, so we completely omit empty fields.
    if (normalizedValue === "") {
      return
    }

    if (normalizedKey.startsWith("variant_price_")) {
      const priceKey = normalizedKey.replace("variant_price_", "")
      // Note: Region prices should always have the currency in brackets, eg. "variant_price_region_name_[EUR]"
      if (!priceKey.endsWith("]")) {
        response["prices"] = [
          ...(response["prices"] || []),
          { currency_code: priceKey.toLowerCase(), amount: normalizedValue },
        ]
      } else {
        const regionName = priceKey.split("_").slice(0, -1).join(" ")
        const region = regionsMap.get(regionName)
        if (!region) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Region with name ${regionName} not found`
          )
        }

        response["prices"] = [
          ...(response["prices"] || []),
          {
            amount: normalizedValue,
            currency_code: region.currency_code,
            rules: { region_id: region.id },
          },
        ]
      }
      return
    }

    if (normalizedKey.startsWith("variant_option_")) {
      const keyBase = normalizedKey.replace("variant_option_", "")
      const optionIndex = parseInt(keyBase.split("_")[0])
      const optionType = keyBase.split("_")[1]

      options.set(optionIndex, {
        ...options.get(optionIndex),
        [optionType]: normalizedValue,
      })
      return
    }

    if (
      normalizedKey.startsWith("variant_") &&
      !variantFieldsToOmit.has(normalizedKey)
    ) {
      response[normalizedKey.replace("variant_", "")] = normalizedValue
      return
    }
  })

  response["options"] = Array.from(options.values()).reduce(
    (agg: Record<string, string>, option) => {
      if (!option.name) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Missing option name for product with handle ${rawProduct["Product Handle"]}`
        )
      }

      if (!option.value) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Missing option value for product with handle ${rawProduct["Product Handle"]} and option ${option.name}`
        )
      }

      agg[option.name] = option.value
      return agg
    },
    {}
  )

  return response as HttpTypes.AdminCreateProductVariant
}

const getNormalizedValue = (key: string, value: any): any => {
  if (value === "\r") {
    return ""
  }

  if (stringFields.some((field) => key.startsWith(field))) {
    return value?.toString()
  }

  if (booleanFields.some((field) => key.startsWith(field))) {
    if (value === "TRUE") {
      return true
    }
    if (value === "FALSE") {
      return false
    }
  }

  return value
}

const snakecaseKey = (key: string): string => {
  return key.split(" ").map(lowerCaseFirst).join("_")
}
