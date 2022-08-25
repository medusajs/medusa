import { EntityManager } from "typeorm"
import { FileService } from "medusa-interfaces"

import {
  BatchJobService,
  ProductService,
  ProductVariantService,
  RegionService,
  ShippingProfileService,
} from "../../../services"
import { ProductOptionRepository } from "../../../repositories/product-option"
import { CsvSchema } from "../../../interfaces/csv-parser"

/**
 * DI props for the Product import strategy
 */
export type InjectedProps = {
  batchJobService: BatchJobService
  productService: ProductService
  productVariantService: ProductVariantService
  shippingProfileService: ShippingProfileService
  regionService: RegionService
  fileService: typeof FileService

  manager: EntityManager
}

/**
 * Data shape returned by the CSVParser.
 */
export type TParsedProductImportRowData = Record<
  string,
  string | number | (string | number | object)[]
>

/**
 * CSV parser's row reducer result data shape.
 */
export type TBuiltProductImportLine = Record<string, any>

/**
 * Schema definition of for an import CSV file.
 */
export type ProductImportCsvSchema = CsvSchema<
  TParsedProductImportRowData,
  TBuiltProductImportLine
>

/**
 * Import Batch job context column type.
 */
export type ImportJobContext = {
  total: number
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
