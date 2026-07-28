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
 * Normalizes inventory item data for export, creating one row per inventory item.
 * Each row contains the item's details, the barcodes of its linked product variant,
 * its total quantities, and the stocked, reserved, and available quantities for
 * each stock location.
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
  return items.map((item) => {
    const levelsByLocation = new Map(
      (item.location_levels ?? []).map((level) => [level.location_id, level])
    )

    const variant = item.variants?.find(Boolean)

    const res = {
      ...prefixFields(item, "item"),
    } as any

    delete res["Item Location Levels"]
    delete res["Item Metadata"]
    delete res["Item Variants"]

    res["Item Barcode"] = variant?.barcode ?? ""
    res["Item Ean"] = variant?.ean ?? ""
    res["Item Upc"] = variant?.upc ?? ""

    for (const location of locations) {
      const level = levelsByLocation.get(location.id)
      const locationColumn = (field: string) =>
        `Location [${location.name}] ${beautifyKey(field)}`

      res[locationColumn("stocked_quantity")] = normalizeQuantity(
        level?.stocked_quantity
      )
      res[locationColumn("reserved_quantity")] = normalizeQuantity(
        level?.reserved_quantity
      )
      res[locationColumn("available_quantity")] = normalizeQuantity(
        level?.available_quantity
      )
    }

    return res
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
