import {
  BigNumberInput,
  HttpTypes,
  StockLocationTypes,
} from "@medusajs/framework/types"
import { BigNumber, upperCaseFirst } from "@medusajs/framework/utils"

type ExportableInventoryItem = HttpTypes.AdminInventoryItem & {
  /**
   * The product variants linked to the inventory item.
   */
  variants?: (HttpTypes.AdminProductVariant | null)[] | null
}

/**
 * Normalizes inventory item data for export, creating one row per linked product
 * variant. Items without a linked variant have a single row. Each row contains the
 * item's details, the linked variant's barcodes, the item's total quantities, and
 * the stocked, reserved, and available quantities for each stock location.
 *
 * @param items - The array of inventory items to normalize for export.
 * @param locations - Object containing an array of stock locations used to build the per-location columns.
 * @returns An array of normalized objects ready for export, with flattened inventory item and location level data.
 *
 * @example
 * const normalizedData = normalizeForExport(
 *   [itemA, itemB],
 *   { locations: [location1, location2] }
 * )
 */
export const normalizeForExport = (
  items: ExportableInventoryItem[],
  { locations }: { locations: StockLocationTypes.StockLocationDTO[] }
): object[] => {
  return items.flatMap((item) => {
    const levelsByLocation = new Map(
      (item.location_levels ?? []).map((level) => [level.location_id, level])
    )

    const itemFields = {
      ...prefixFields(item, "item"),
    } as any

    delete itemFields["Item Location Levels"]
    delete itemFields["Item Metadata"]
    delete itemFields["Item Variants"]

    const locationColumns: Record<string, number | string> = {}
    for (const location of locations) {
      const level = levelsByLocation.get(location.id)
      const locationColumn = (field: string) =>
        `Location [${location.name}] ${beautifyKey(field)}`

      locationColumns[locationColumn("stocked_quantity")] = normalizeQuantity(
        level?.stocked_quantity
      )
      locationColumns[locationColumn("reserved_quantity")] = normalizeQuantity(
        level?.reserved_quantity
      )
      locationColumns[locationColumn("available_quantity")] = normalizeQuantity(
        level?.available_quantity
      )
    }

    const variants = (item.variants ?? []).filter(
      (variant): variant is HttpTypes.AdminProductVariant => !!variant
    )

    // One row per linked variant, or a single row for unlinked items.
    const rowVariants = variants.length
      ? variants
      : [null as HttpTypes.AdminProductVariant | null]

    return rowVariants.map((variant) => ({
      ...itemFields,
      "Variant Id": variant?.id ?? "",
      "Variant Title": variant?.title ?? "",
      "Variant Barcode": variant?.barcode ?? "",
      "Variant Ean": variant?.ean ?? "",
      "Variant Upc": variant?.upc ?? "",
      ...locationColumns,
    }))
  })
}

const normalizeQuantity = (value?: BigNumberInput | null): number | string => {
  return value == null ? "" : new BigNumber(value).numeric
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
