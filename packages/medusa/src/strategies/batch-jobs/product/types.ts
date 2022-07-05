import { CsvSchema } from "../../../interfaces/csv-parser"

/**
 * Schema definition of for an import CSV file.
 */
export type ProductImportCsvSchema = CsvSchema<
  Record<string, string>,
  Record<string, string>
>
/**
 * Data shape returned by the CSVParser.
 */
export type TParsedRowData = Record<
  string,
  string | number | (string | number | object)[]
>
/**
 * Import Batch job context column type.
 */
export type ImportJobContext = {
  total: number
  progress: number
  fileKey: string
}

/**
 * Supported batch job import ops.
 */
export enum OperationType {
  ProductCreate = "PRODUCT_CREATE",
  ProductUpdate = "PRODUCT_UPDATE",
  VariantCreate = "VARIANT_CREATE",
  VariantUpdate = "VARIANT_UPDATE",
}
