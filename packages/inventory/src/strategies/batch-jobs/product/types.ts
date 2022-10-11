import { EntityManager } from "typeorm"
import { FileService } from "medusa-interfaces"

import {
  BatchJobService,
  ProductService,
  ProductVariantService,
  RegionService,
  SalesChannelService,
  ShippingProfileService,
} from "../../../services"
import { CsvSchema } from "../../../interfaces/csv-parser"
import { FlagRouter } from "../../../utils/flag-router"
import { BatchJob } from "../../../models"

export type ProductImportBatchJob = BatchJob & {
  result: Pick<BatchJob, "result"> & {
    operations: {
      [K in keyof typeof OperationType]: number
    }
  }
}

/**
 * DI props for the Product import strategy
 */
export type InjectedProps = {
  batchJobService: BatchJobService
  productService: ProductService
  productVariantService: ProductVariantService
  shippingProfileService: ShippingProfileService
  salesChannelService: SalesChannelService
  regionService: RegionService
  fileService: typeof FileService

  featureFlagRouter: FlagRouter
  manager: EntityManager
}

/**
 * Data shape returned by the CSVParser.
 */
export type TParsedProductImportRowData = Record<
  string,
  string | number | object | (string | number | object)[]
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
