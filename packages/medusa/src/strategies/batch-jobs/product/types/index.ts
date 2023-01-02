import { BatchJob, Product, ProductVariant } from "../../../../models"
import { Selector } from "../../../../types/common"
import { CsvSchema, CsvSchemaColumn } from "../../../../interfaces/csv-parser"
import {
  BatchJobService,
  ProductCollectionService,
  ProductService,
  ProductVariantService,
  RegionService,
  SalesChannelService,
  ShippingProfileService,
} from "../../../../services"
import { FileService } from "medusa-interfaces"
import { FlagRouter } from "../../../../utils/flag-router"
import { EntityManager } from "typeorm"
import { IFileService } from "../../../../interfaces"

export type ProductExportInjectedDependencies = {
  manager: EntityManager
  batchJobService: BatchJobService
  productService: ProductService
  fileService: IFileService
  featureFlagRouter: FlagRouter
}

export type ProductExportBatchJobContext = {
  retry_count?: number
  max_retry?: number
  offset?: number
  limit?: number
  batch_size?: number
  order?: string
  fields?: string
  expand?: string
  shape: {
    prices: ProductExportPriceData[]
    dynamicOptionColumnCount: number
    dynamicImageColumnCount: number
    dynamicSalesChannelsColumnCount: number
  }
  list_config?: {
    select?: string[]
    relations?: string[]
    skip?: number
    take?: number
    order?: Record<string, "ASC" | "DESC">
  }
  filterable_fields?: Selector<unknown>
}

export type ProductExportBatchJob = BatchJob & {
  context: ProductExportBatchJobContext
}

export type ProductExportPriceData = {
  currency_code?: string
  region?: { name: string; currency_code: string; id: string }
}

export type ProductExportColumnSchemaEntity = "product" | "variant"

export type DynamicProductExportDescriptor = {
  isDynamic: true
  buildDynamicColumnName: (dataOrIndex: any) => string
}

export type ProductExportDescriptor =
  | {
      accessor: (product: Product) => string
      entityName: Extract<ProductExportColumnSchemaEntity, "product">
    }
  | {
      accessor: (variant: ProductVariant) => string
      entityName: Extract<ProductExportColumnSchemaEntity, "variant">
    }

export type ProductImportInjectedProps = {
  batchJobService: BatchJobService
  productService: ProductService
  productVariantService: ProductVariantService
  shippingProfileService: ShippingProfileService
  salesChannelService: SalesChannelService
  regionService: RegionService
  productCollectionService: ProductCollectionService
  fileService: typeof FileService

  featureFlagRouter: FlagRouter
  manager: EntityManager
}

/**
 * Import Batch job context column type.
 */
export type ProductImportJobContext = {
  total: number
  fileKey: string
}

export type ProductImportBatchJob = BatchJob & {
  result: Pick<BatchJob, "result"> & {
    operations: {
      [K in keyof typeof OperationType]: number
    }
  }
}

/**
 * Schema definition of for an import CSV file.
 */
export type ProductImportCsvSchema = CsvSchema<
  TParsedProductImportRowData,
  TBuiltProductImportLine
>

/**
 * Supported batch job import ops.
 */
export enum OperationType {
  ProductCreate = "PRODUCT_CREATE",
  ProductUpdate = "PRODUCT_UPDATE",
  VariantCreate = "VARIANT_CREATE",
  VariantUpdate = "VARIANT_UPDATE",
}

/**
 * Data shape returned by the CSVParser.
 */
export type TParsedProductImportRowData = Record<
  string,
  string | number | object | undefined | (string | number | object)[]
>

/**
 * CSV parser's row reducer result data shape.
 */
export type TBuiltProductImportLine = Record<string, any>

export type ProductImportDescriptor = CsvSchemaColumn<
  TParsedProductImportRowData,
  TBuiltProductImportLine,
  true
>

export type ProductColumnDefinition = {
  [key: string]: {
    name: string
    importDescriptor?: ProductImportDescriptor
    exportDescriptor?: ProductExportDescriptor | DynamicProductExportDescriptor
  }
}
