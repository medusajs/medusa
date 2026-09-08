import type { ProductTypes } from "@medusajs/framework/types"
import type { HttpTypes, RegionTypes } from "@medusajs/framework/types"
import { MedusaError, lowerCaseFirst, normalizeCurrencyCode } from "@medusajs/framework/utils"

/**
 * Normalizes raw CSV product data into standardized AdminCreateProduct DTOs.
 * 
 * This function converts product data from CSV import format to the standard DTO format
 * expected by the product creation API. It handles product grouping by handle,
 * variant aggregation, option extraction, and validation against existing regions and tags.
 * 
 * @param rawProducts - Array of raw product objects from CSV import
 * @param additional - Additional context data needed for normalization
 * @param additional.regions - Available regions for price validation
 * @param additional.tags - Available product tags for validation
 * @returns Array of normalized AdminCreateProduct DTOs ready for import
 * 
 * @throws {MedusaError} When referenced tags or regions are not found
 * 
 * @example
 * ```typescript
 * const products = normalizeForImport(csvData, {
 *   regions: existingRegions,
 *   tags: existingTags
 * })
 * ```
 */
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
      optionMeta: Map<string, ImportOptionMeta>
    }
  >()

  // Currently region names are treated as case-insensitive.
  const regionsMap = new Map(
    additional.regions.map((r) => [r.name.toLowerCase(), r])
  )
  const tagsMap = new Map(additional.tags.map((t) => [t.value, t]))

  rawProducts.forEach((rawProduct) => {
    const productInMap = productMap.get(rawProduct["Product Handle"])
    const rowOptionMeta = extractOptionMetaForImport(rawProduct)

    if (!productInMap) {
      productMap.set(rawProduct["Product Handle"], {
        product: normalizeProductForImport(rawProduct, tagsMap),
        variants: [normalizeVariantForImport(rawProduct, regionsMap)],
        optionMeta: rowOptionMeta,
      })
      return
    }

    // First non-empty meta seen for an option wins; subsequent rows may omit
    // the id/is_exclusive columns and we shouldn't clobber what we have.
    for (const [name, meta] of rowOptionMeta) {
      const existing = productInMap.optionMeta.get(name) ?? {}
      productInMap.optionMeta.set(name, {
        id: existing.id ?? meta.id,
        is_exclusive: existing.is_exclusive ?? meta.is_exclusive,
      })
    }

    productMap.set(rawProduct["Product Handle"], {
      product: productInMap.product,
      variants: [
        ...productInMap.variants,
        normalizeVariantForImport(rawProduct, regionsMap),
      ],
      optionMeta: productInMap.optionMeta,
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
      options: Object.entries(options).map(([key, value]) => {
        const meta = p.optionMeta.get(key)
        return {
          title: key,
          values: Array.from(value),
          ...(meta?.id ? { id: meta.id } : {}),
          ...(meta?.is_exclusive !== undefined
            ? { is_exclusive: meta.is_exclusive }
            : {}),
        }
      }),
      variants: p.variants,
    }
  })
}

type ImportOptionMeta = { id?: string; is_exclusive?: boolean }

const parseBooleanFromCsv = (val: unknown): boolean | undefined => {
  if (typeof val === "boolean") {
    return val
  }
  if (typeof val === "number") {
    if (val === 1) return true
    if (val === 0) return false
    return undefined
  }
  if (typeof val === "string") {
    const v = val.trim().toLowerCase()
    if (v === "true" || v === "1" || v === "yes") return true
    if (v === "false" || v === "0" || v === "no") return false
  }
  return undefined
}

// CSV rows can optionally carry `Variant Option N Id` and
// `Variant Option N Is Exclusive` columns. An id links the product to an
// existing option (typically a global one); is_exclusive is honored only when
// no id is provided and lets the CSV opt out of the exclusive-by-default
// behavior when creating fresh options.
const extractOptionMetaForImport = (
  rawProduct: object
): Map<string, ImportOptionMeta> => {
  const byIndex = new Map<
    number,
    { name?: string; id?: string; is_exclusive?: boolean }
  >()

  Object.entries(rawProduct).forEach(([key, value]) => {
    const normalizedKey = snakecaseKey(key)
    if (!normalizedKey.startsWith("variant_option_")) {
      return
    }

    const normalizedValue = getNormalizedValue(normalizedKey, value)
    if (normalizedValue === "" || normalizedValue == null) {
      return
    }

    const keyBase = normalizedKey.slice("variant_option_".length)
    const firstUnderscore = keyBase.indexOf("_")
    if (firstUnderscore === -1) {
      return
    }

    const optionIndex = parseInt(keyBase.slice(0, firstUnderscore))
    if (Number.isNaN(optionIndex)) {
      return
    }
    const optionType = keyBase.slice(firstUnderscore + 1)

    const current = byIndex.get(optionIndex) ?? {}
    if (optionType === "name") {
      current.name = String(normalizedValue)
    } else if (optionType === "id") {
      current.id = String(normalizedValue)
    } else if (optionType === "is_exclusive") {
      const parsed = parseBooleanFromCsv(normalizedValue)
      if (parsed !== undefined) {
        current.is_exclusive = parsed
      }
    }
    byIndex.set(optionIndex, current)
  })

  const byName = new Map<string, ImportOptionMeta>()
  for (const entry of byIndex.values()) {
    if (!entry.name) {
      continue
    }
    const meta: ImportOptionMeta = {}
    if (entry.id !== undefined) {
      meta.id = entry.id
    }
    if (entry.is_exclusive !== undefined) {
      meta.is_exclusive = entry.is_exclusive
    }
    if (meta.id !== undefined || meta.is_exclusive !== undefined) {
      byName.set(entry.name, meta)
    }
  }
  return byName
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

    if (normalizedKey.startsWith("shipping_profile_id")) {
      response["shipping_profile_id"] = normalizedValue
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
          { currency_code: normalizeCurrencyCode(priceKey), amount: normalizedValue },
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
      const firstUnderscore = keyBase.indexOf("_")
      if (firstUnderscore === -1) {
        return
      }
      const optionIndex = parseInt(keyBase.slice(0, firstUnderscore))
      const optionType = keyBase.slice(firstUnderscore + 1)

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
