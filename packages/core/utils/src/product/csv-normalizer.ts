import {
  isPresent,
  MedusaError,
  normalizeCSVValue,
  tryConvertToBoolean,
  tryConvertToNumber,
} from "../common"
import { AdminCreateProduct, AdminCreateProductVariant } from "@medusajs/types"

/**
 * Contextual data made available to column processors that need to resolve
 * values against the store (e.g. region prices need to resolve a region name
 * to its id). It is kept as plain data so the normalizer stays pure.
 */
export type CSVNormalizerContext = {
  /**
   * Regions keyed by their lowercased name, used to resolve region-scoped
   * variant prices (e.g. "Variant Price Europe [EUR]") to a region id.
   */
  regionsByName?: Map<string, { id: string; currency_code: string }>
}

/**
 * Column processor is a function that process the CSV column
 * and writes its value to the output
 */
type ColumnProcessor<Output> = (
  csvRow: Record<string, string | boolean | number>,
  rowColumns: string[],
  rowNumber: number,
  output: Output,
  context: CSVNormalizerContext
) => void

type NormalizedRow =
  | (Record<string, string | number | boolean> & {
      "product id": string
      "product handle": string
    })
  | {
      "product id"?: string
      "product handle": string
    }
  | {
      "product id": string
      "product handle"?: string
    }

/**
 * Creates an error with the CSV row number
 */
function createError(rowNumber: number, message: string) {
  return new MedusaError(
    MedusaError.Types.INVALID_DATA,
    `Row ${rowNumber}: ${message}`
  )
}

const VARIANT_PRICE_COLUMN_PREFIX = "variant price "

/**
 * Parses a variant price column name into its currency ISO code and, for
 * region-scoped prices, the region name. This matches the format written by
 * the product export:
 *
 * - Store-wide price: "Variant Price <CURRENCY>" (e.g. "Variant Price EUR")
 * - Region price:     "Variant Price <Region Name> [<CURRENCY>]"
 *                     (e.g. "Variant Price Europe [EUR]")
 *
 * The ISO code is returned lowercased. `region` is the (case-insensitive)
 * region name for region prices, and `undefined` for store-wide prices.
 *
 * Note: column names reaching this function are already lowercased.
 */
function parseVariantPriceColumn(columnName: string, rowNumber: number) {
  // Region prices carry the currency in trailing brackets, with the region
  // name in between, e.g. "variant price europe [eur]".
  const trailingBracket = /\[([^\]]+)\]\s*$/.exec(columnName)
  if (trailingBracket) {
    const iso = trailingBracket[1].trim()
    const region = columnName
      .slice(VARIANT_PRICE_COLUMN_PREFIX.length, trailingBracket.index)
      .trim()

    if (!iso) {
      throw createError(
        rowNumber,
        `Invalid price format used by "${columnName}". Expect the currency ISO code inside the brackets. For example: "Variant Price Europe [EUR]"`
      )
    }

    return {
      iso: iso.toLowerCase(),
      region: region || undefined,
    }
  }

  // Store-wide price: the currency ISO code is the remainder of the column name.
  const iso = columnName.slice(VARIANT_PRICE_COLUMN_PREFIX.length).trim()

  if (!iso) {
    throw createError(
      rowNumber,
      `Invalid price format used by "${columnName}". Expect the column name to contain the currency ISO code. For example: "Variant Price EUR" or "Variant Price Europe [EUR]"`
    )
  }

  return {
    iso: iso.toLowerCase(),
    region: undefined,
  }
}

/**
 * Processes a column value as a string
 */
function processAsString<Output>(
  inputKey: string,
  outputKey: keyof Output
): ColumnProcessor<Output> {
  return (csvRow, _, __, output) => {
    const value = csvRow[inputKey]
    if (isPresent(value)) {
      output[outputKey as any] = value
    }
  }
}

/**
 * Process a column value as a json object
 */
function processAsJson<Output>(
  inputKey: string,
  outputKey: keyof Output
): ColumnProcessor<Output> {
  return (csvRow, _, rowNumber, output) => {
    const value = csvRow[inputKey]
    if (isPresent(value)) {
      if (typeof value === "string") {
        try {
          output[outputKey] = JSON.parse(value)
        } catch (error) {
          throw createError(
            rowNumber,
            `Invalid value provided for "${inputKey}". Expected a valid JSON string, received "${value}"`
          )
        }
      }
    }
    return undefined
  }
}

/**
 * Processes a column value but ignores it (no-op processor for system-generated fields)
 */
function processAsIgnored<Output>(): ColumnProcessor<Output> {
  return () => {
    // Do nothing - this column is intentionally ignored
  }
}

/**
 * Processes the column value as a boolean
 */
function processAsBoolean<Output>(
  inputKey: string,
  outputKey: keyof Output
): ColumnProcessor<Output> {
  return (csvRow, _, __, output) => {
    const value = csvRow[inputKey]
    if (isPresent(value)) {
      output[outputKey as any] = tryConvertToBoolean(value, value)
    }
  }
}

/**
 * Processes the column value as a number
 */
function processAsNumber<Output>(
  inputKey: string,
  outputKey: keyof Output,
  options?: { asNumericString: boolean }
): ColumnProcessor<Output> {
  return (csvRow, _, rowNumber, output) => {
    const value = csvRow[inputKey]
    if (isPresent(value)) {
      const numericValue = tryConvertToNumber(value)
      if (numericValue === undefined) {
        throw createError(
          rowNumber,
          `Invalid value provided for "${inputKey}". Expected value to be a number, received "${value}"`
        )
      } else {
        if (options?.asNumericString) {
          output[outputKey as any] = String(numericValue)
        } else {
          output[outputKey as any] = numericValue
        }
      }
    }
  }
}

/**
 * Processes the CSV column as a counter value. The counter values
 * are defined as "<Column Name> <1>". Duplicate values are not
 * added twice.
 */
function processAsCounterValue<Output extends Record<string, any[]>>(
  inputMatcher: RegExp,
  arrayItemKey: string,
  outputKey: keyof Output
): ColumnProcessor<Output> {
  return (csvRow, rowColumns, _, output) => {
    const matchingColumns = rowColumns.filter((rowKey) => inputMatcher.test(rowKey))

    // Only initialize the array if there are matching columns in the CSV
    if (matchingColumns.length > 0) {
      output[outputKey] = output[outputKey] ?? []

      const existingIds = output[outputKey].map((item) => item[arrayItemKey])

      matchingColumns.forEach((rowKey) => {
        const value = csvRow[rowKey]
        if (!existingIds.includes(value) && isPresent(value)) {
          output[outputKey].push({ [arrayItemKey]: value })
        }
      })
    }
  }
}

/**
 * Collection of static product columns whose values must be copied
 * as it is without any further processing.
 */
const productStaticColumns: {
  [columnName: string]: ColumnProcessor<{
    [K in keyof AdminCreateProduct | "id"]?: any
  }>
} = {
  "product id": processAsString("product id", "id"),
  "product handle": processAsString("product handle", "handle"),
  "product title": processAsString("product title", "title"),
  "product subtitle": processAsString("product subtitle", "subtitle"),
  "product status": processAsString("product status", "status"),
  "product description": processAsString("product description", "description"),
  "product external id": processAsString("product external id", "external_id"),
  "product thumbnail": processAsString("product thumbnail", "thumbnail"),
  "product collection id": processAsString(
    "product collection id",
    "collection_id"
  ),
  "product type id": processAsString("product type id", "type_id"),
  "product discountable": processAsBoolean(
    "product discountable",
    "discountable"
  ),
  "product height": processAsNumber("product height", "height"),
  "product hs code": processAsString("product hs code", "hs_code"),
  "product length": processAsNumber("product length", "length"),
  "product material": processAsString("product material", "material"),
  "product mid code": processAsString("product mid code", "mid_code"),
  "product origin country": processAsString(
    "product origin country",
    "origin_country"
  ),
  "product weight": processAsNumber("product weight", "weight"),
  "product width": processAsNumber("product width", "width"),
  "product metadata": processAsJson("product metadata", "metadata"),
  "shipping profile id": processAsString(
    "shipping profile id",
    "shipping_profile_id"
  ),
  // Product properties that should be imported
  "product is giftcard": processAsBoolean("product is giftcard", "is_giftcard"),
  // System-generated timestamp fields that should be ignored during import
  "product created at": processAsIgnored(),
  "product deleted at": processAsIgnored(),
  "product updated at": processAsIgnored(),
}

/**
 * Collection of wildcard product columns whose values will be computed by
 * one or more columns from the CSV row.
 */
const productWildcardColumns: {
  [columnName: string]: ColumnProcessor<{
    [K in keyof AdminCreateProduct]?: any
  }>
} = {
  "product category": processAsCounterValue(
    /product category \d/,
    "id",
    "categories"
  ),
  "product image": processAsCounterValue(/product image \d/, "url", "images"),
  "product tag": processAsCounterValue(/product tag \d/, "id", "tags"),
  "product sales channel": processAsCounterValue(
    /product sales channel \d/,
    "id",
    "sales_channels"
  ),
}

/**
 * Collection of static variant columns whose values must be copied
 * as it is without any further processing.
 */
const variantStaticColumns: {
  [columnName: string]: ColumnProcessor<{
    [K in keyof AdminCreateProductVariant | "id"]?: any
  }>
} = {
  "variant id": processAsString("variant id", "id"),
  "variant title": processAsString("variant title", "title"),
  "variant sku": processAsString("variant sku", "sku"),
  "variant upc": processAsString("variant upc", "upc"),
  "variant ean": processAsString("variant ean", "ean"),
  "variant hs code": processAsString("variant hs code", "hs_code"),
  "variant mid code": processAsString("variant mid code", "mid_code"),
  "variant manage inventory": processAsBoolean(
    "variant manage inventory",
    "manage_inventory"
  ),
  "variant allow backorder": processAsBoolean(
    "variant allow backorder",
    "allow_backorder"
  ),
  "variant barcode": processAsString("variant barcode", "barcode"),
  "variant height": processAsNumber("variant height", "height"),
  "variant length": processAsNumber("variant length", "length"),
  "variant material": processAsString("variant material", "material"),
  "variant metadata": processAsJson("variant metadata", "metadata"),
  "variant origin country": processAsString(
    "variant origin country",
    "origin_country"
  ),
  "variant variant rank": processAsNumber(
    "variant variant rank",
    "variant_rank"
  ),
  "variant width": processAsNumber("variant width", "width"),
  "variant weight": processAsNumber("variant weight", "weight"),
  // System-generated timestamp fields that should be ignored during import
  "variant created at": processAsIgnored(),
  "variant deleted at": processAsIgnored(),
  "variant updated at": processAsIgnored(),
  // This field should be ignored as it's redundant (variant already belongs to product)
  "variant product id": processAsIgnored(),
}

/**
 * Collection of wildcard variant columns whose values will be computed by
 * one or more columns from the CSV row.
 */
const variantWildcardColumns: {
  [columnName: string]: ColumnProcessor<{
    [K in keyof AdminCreateProductVariant]?: any
  }>
} = {
  "variant price": (csvRow, rowColumns, rowNumber, output, context) => {
    const pricesColumns = rowColumns.filter((rowKey) => {
      return rowKey.startsWith("variant price ") && isPresent(csvRow[rowKey])
    })
    output["prices"] = output["prices"] ?? []

    pricesColumns.forEach((columnName) => {
      const { iso, region: regionName } = parseVariantPriceColumn(
        columnName,
        rowNumber
      )
      const value = csvRow[columnName]

      const numericValue = tryConvertToNumber(value)
      if (numericValue === undefined) {
        throw createError(
          rowNumber,
          `Invalid value provided for "${columnName}". Expected value to be a number, received "${value}"`
        )
      }

      if (regionName) {
        // Region prices need to resolve the region name to its id so the
        // price is created with a `region_id` rule (mirroring the export).
        const region = context?.regionsByName?.get(regionName)
        if (!region) {
          throw createError(
            rowNumber,
            `Region with name "${regionName}" not found for column "${columnName}"`
          )
        }

        output["prices"].push({
          amount: numericValue,
          currency_code: region.currency_code,
          rules: { region_id: region.id },
        })
      } else {
        output["prices"].push({
          currency_code: iso,
          amount: numericValue,
        })
      }
    })
  },
}

/**
 * Options are processed separately and then defined on both the products and
 * the variants.
 */
const optionColumns: {
  [columnName: string]: ColumnProcessor<{
    options: {
      key: any
      value: any
      id?: string
      is_exclusive?: boolean
    }[]
  }>
} = {
  "variant option": (csvRow, rowColumns, rowNumber, output) => {
    const matcher = /variant option \d+ name/
    const optionNameColumns = rowColumns.filter((rowKey) => {
      return matcher.test(rowKey) && isPresent(csvRow[rowKey])
    })

    output["options"] = optionNameColumns.map((columnName) => {
      const [, , counter] = columnName.split(" ")
      const key = csvRow[columnName]
      const value = csvRow[`variant option ${counter} value`]
      const id = csvRow[`variant option ${counter} id`]
      const isExclusiveRaw = csvRow[`variant option ${counter} is exclusive`]

      if (!isPresent(value)) {
        throw createError(rowNumber, `Missing option value for "${columnName}"`)
      }

      const entry: {
        key: any
        value: any
        id?: string
        is_exclusive?: boolean
      } = { key, value }

      if (isPresent(id)) {
        entry.id = String(id)
      }
      if (isPresent(isExclusiveRaw)) {
        const parsed = tryConvertToBoolean(isExclusiveRaw)
        if (parsed !== undefined) {
          entry.is_exclusive = parsed
        }
      }
      return entry
    })
  },
}

/**
 * An array of known columns
 */
const knownStaticColumns = Object.keys(productStaticColumns).concat(
  Object.keys(variantStaticColumns)
)
const knownWildcardColumns = Object.keys(productWildcardColumns)
  .concat(Object.keys(variantWildcardColumns))
  .concat(Object.keys(optionColumns))

/**
 * CSV normalizer processes all the allowed columns from a CSV file and remaps
 * them into a new object with properties matching the "AdminCreateProduct".
 *
 * However, further validations must be performed to validate the format and
 * the required fields in the normalized output.
 */
export class CSVNormalizer {
  /**
   * Normalizes a row by converting all keys to lowercase and removing
   * the leading "\r" from the keys and the values.
   *
   * Also, it values the row to contain unknown columns and must contain
   * the "product id" or "product handle" columns.
   */
  static preProcess(
    row: Record<string, string | boolean | number>,
    rowNumber: number
  ): NormalizedRow {
    const unknownColumns: string[] = []

    const normalized = Object.keys(row).reduce((result, key) => {
      const lowerCaseKey = normalizeCSVValue(key).toLowerCase()

      if (
        !knownStaticColumns.includes(lowerCaseKey) &&
        !knownWildcardColumns.some((column) => lowerCaseKey.startsWith(column))
      ) {
        unknownColumns.push(key)
      }

      result[lowerCaseKey] = normalizeCSVValue(row[key])
      return result
    }, {})

    if (unknownColumns.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid column name(s) "${unknownColumns.join('","')}"`
      )
    }

    const productId = normalized["product id"]
    const productHandle = normalized["product handle"]
    if (!isPresent(productId) && !isPresent(productHandle)) {
      throw createError(
        rowNumber,
        "Missing product id and handle. One of these columns are required to process the row"
      )
    }

    return normalized as NormalizedRow
  }

  #rows: Record<string, string | boolean | number>[]

  #products: {
    toCreate: {
      [handle: string]: {
        [K in keyof AdminCreateProduct]?: any
      }
    }
    toUpdate: {
      [id: string]: {
        [K in keyof AdminCreateProduct]?: any
      }
    }
  } = {
    toCreate: {},
    toUpdate: {},
  }

  #context: CSVNormalizerContext

  constructor(rows: NormalizedRow[], context: CSVNormalizerContext = {}) {
    this.#rows = rows
    this.#context = context
  }

  /**
   * Initializes a product object or returns an existing one
   * by its id. The products with ids are treated as updates
   */
  #getOrInitializeProductById(id: string) {
    if (!this.#products.toUpdate[id]) {
      this.#products.toUpdate[id] = {}
    }
    return this.#products.toUpdate[id]!
  }

  /**
   * Initializes a product object or returns an existing one
   * by its handle. The products with handle are treated as creates
   */
  #getOrInitializeProductByHandle(handle: string) {
    if (!this.#products.toCreate[handle]) {
      this.#products.toCreate[handle] = {}
    }
    return this.#products.toCreate[handle]!
  }

  /**
   * Processes a given CSV row
   */
  #processRow(
    row: Record<string, string | boolean | number>,
    rowNumber: number
  ) {
    const rowColumns = Object.keys(row)
    const productId = row["product id"]
    const productHandle = row["product handle"]

    /**
     * Create representation of a product by its id or handle and process
     * its static + wildcard columns
     */
    const product = productId
      ? this.#getOrInitializeProductById(String(productId))
      : this.#getOrInitializeProductByHandle(String(productHandle))
    Object.keys(productStaticColumns).forEach((column) => {
      productStaticColumns[column](
        row,
        rowColumns,
        rowNumber,
        product,
        this.#context
      )
    })
    Object.keys(productWildcardColumns).forEach((column) => {
      productWildcardColumns[column](
        row,
        rowColumns,
        rowNumber,
        product,
        this.#context
      )
    })

    /**
     * Create representation of a variant and process
     * its static + wildcard columns
     */
    const variant: {
      [K in keyof AdminCreateProductVariant]?: any
    } = {}
    Object.keys(variantStaticColumns).forEach((column) => {
      variantStaticColumns[column](
        row,
        rowColumns,
        rowNumber,
        variant,
        this.#context
      )
    })
    Object.keys(variantWildcardColumns).forEach((column) => {
      variantWildcardColumns[column](
        row,
        rowColumns,
        rowNumber,
        variant,
        this.#context
      )
    })

    /**
     * Process variant options as a standalone array
     */
    const options: {
      options: {
        key: any
        value: any
        id?: string
        is_exclusive?: boolean
      }[]
    } = { options: [] }
    Object.keys(optionColumns).forEach((column) => {
      optionColumns[column](row, rowColumns, rowNumber, options, this.#context)
    })

    /**
     * Specify options on both the variant and the product
     */
    options.options.forEach(({ key, value, id, is_exclusive }) => {
      variant.options = variant.options ?? {}
      variant.options[key] = value

      product.options = product.options ?? []
      const matchingKey = product.options.find(
        (option: any) => option.title === key
      )
      if (!matchingKey) {
        const newOption: any = { title: key, values: [value] }
        if (id !== undefined) {
          newOption.id = id
        }
        if (is_exclusive !== undefined) {
          newOption.is_exclusive = is_exclusive
        }
        product.options.push(newOption)
      } else {
        if (!matchingKey.values.includes(value)) {
          matchingKey.values.push(value)
        }
        // First-seen meta wins so subsequent rows with empty Id/Is Exclusive
        // columns don't clobber an earlier row that had them set.
        if (matchingKey.id === undefined && id !== undefined) {
          matchingKey.id = id
        }
        if (
          matchingKey.is_exclusive === undefined &&
          is_exclusive !== undefined
        ) {
          matchingKey.is_exclusive = is_exclusive
        }
      }
    })

    /**
     * Assign variant to the product
     */
    product.variants = product.variants ?? []
    product.variants.push(variant)
  }

  /**
   * Process CSV rows. The return value is a tree of products
   */
  proccess(resumingFromIndex: number = 0) {
    this.#rows.forEach((row, index) =>
      this.#processRow(row, resumingFromIndex + index + 1)
    )
    this.#rows = []
    return this.#products
  }
}
