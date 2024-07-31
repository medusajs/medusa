import { HttpTypes, RegionTypes } from "@medusajs/types"
import { MedusaError, lowerCaseFirst } from "@medusajs/utils"

// We want to convert the csv data format to a standard DTO format.
export const normalizeForImport = (
  rawProducts: object[],
  regions: RegionTypes.RegionDTO[]
): HttpTypes.AdminCreateProduct[] => {
  const productMap = new Map<
    string,
    {
      product: HttpTypes.AdminCreateProduct
      variants: HttpTypes.AdminCreateProductVariant[]
    }
  >()
  const regionsMap = new Map(regions.map((r) => [r.id, r]))

  rawProducts.forEach((rawProduct) => {
    const productInMap = productMap.get(rawProduct["Product Handle"])
    if (!productInMap) {
      productMap.set(rawProduct["Product Handle"], {
        product: normalizeProductForImport(rawProduct),
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
  "variant_barcode",
  "variant_sku",
  "variant_ean",
  "variant_upc",
  "variant_hs_code",
  "variant_mid_code",
]

const normalizeProductForImport = (
  rawProduct: object
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
      response["tags"] = [
        ...(response["tags"] || []),
        { value: normalizedValue },
      ]
      return
    }

    if (normalizedKey.startsWith("product_sales_channel_")) {
      response["sales_channels"] = [
        ...(response["sales_channels"] || []),
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
      // Note: If we start using the region name instead of ID, this check might not always work.
      if (priceKey.length === 3) {
        response["prices"] = [
          ...(response["prices"] || []),
          { currency_code: priceKey.toLowerCase(), amount: normalizedValue },
        ]
      } else {
        const region = regionsMap.get(priceKey)
        if (!region) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Region with ID ${priceKey} not found`
          )
        }

        response["prices"] = [
          ...(response["prices"] || []),
          {
            amount: normalizedValue,
            currency_code: region.currency_code,
            rules: { region_id: priceKey },
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
  return stringFields.some((field) => key.startsWith(field))
    ? value.toString()
    : value
}

const snakecaseKey = (key: string): string => {
  return key.split(" ").map(lowerCaseFirst).join("_")
}
