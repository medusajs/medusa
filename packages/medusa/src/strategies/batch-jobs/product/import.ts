/* eslint-disable valid-jsdoc */
import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"

import { AbstractBatchJobStrategy, IFileService } from "../../../interfaces"
import CsvParser from "../../../services/csv-parser"
import {
  BatchJobService,
  ProductService,
  ProductVariantService,
  RegionService,
  SalesChannelService,
  ShippingProfileService,
} from "../../../services"
import { CreateProductInput, UpdateProductInput } from "../../../types/product"
import {
  CreateProductVariantInput,
  UpdateProductVariantInput,
} from "../../../types/product-variant"
import {
  ImportJobContext,
  InjectedProps,
  OperationType,
  ProductImportBatchJob,
  ProductImportCsvSchema,
  TBuiltProductImportLine,
  TParsedProductImportRowData,
} from "./types"
import { BatchJob, SalesChannel } from "../../../models"
import { FlagRouter } from "../../../utils/flag-router"
import { transformProductData, transformVariantData } from "./utils"
import SalesChannelFeatureFlag from "../../../loaders/feature-flags/sales-channels"

/**
 * Process this many variant rows before reporting progress.
 */
const BATCH_SIZE = 100

/**
 * Default strategy class used for a batch import of products/variants.
 */
class ProductImportStrategy extends AbstractBatchJobStrategy {
  static identifier = "product-import-strategy"

  static batchType = "product-import"

  private processedCounter: Record<string, number> = {}

  protected readonly featureFlagRouter_: FlagRouter

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly fileService_: IFileService

  protected readonly regionService_: RegionService
  protected readonly productService_: ProductService
  protected readonly batchJobService_: BatchJobService
  protected readonly salesChannelService_: SalesChannelService
  protected readonly productVariantService_: ProductVariantService
  protected readonly shippingProfileService_: ShippingProfileService

  protected readonly csvParser_: CsvParser<
    ProductImportCsvSchema,
    Record<string, string>,
    Record<string, string>
  >

  constructor({
    batchJobService,
    productService,
    salesChannelService,
    productVariantService,
    shippingProfileService,
    regionService,
    fileService,
    manager,
    featureFlagRouter,
  }: InjectedProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    const isSalesChannelsFeatureOn = featureFlagRouter.isFeatureEnabled(
      SalesChannelFeatureFlag.key
    )

    this.csvParser_ = new CsvParser({
      ...CSVSchema,
      columns: [
        ...CSVSchema.columns,
        ...(isSalesChannelsFeatureOn ? SalesChannelsSchema.columns : []),
      ],
    })

    this.featureFlagRouter_ = featureFlagRouter

    this.manager_ = manager
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.productService_ = productService
    this.salesChannelService_ = salesChannelService
    this.productVariantService_ = productVariantService
    this.shippingProfileService_ = shippingProfileService
    this.regionService_ = regionService
  }

  buildTemplate(): Promise<string> {
    throw new Error("Not implemented!")
  }

  /**
   * Create a description of a row on which the error occurred and throw a Medusa error.
   *
   * @param row - Parsed CSV row data
   * @param errorDescription - Concrete error
   */
  protected static throwDescriptiveError(
    row: TParsedProductImportRowData,
    errorDescription?: string
  ): never {
    const message = `Error while processing row with:
      product id: ${row["product.id"]},
      product handle: ${row["product.handle"]},
      variant id: ${row["variant.id"]}
      variant sku: ${row["variant.sku"]}
      ${errorDescription}`

    throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
  }

  /**
   * Generate instructions for update/create of products/variants from parsed CSV rows.
   *
   * @param csvData - An array of parsed CSV rows.
   */
  async getImportInstructions(
    csvData: TParsedProductImportRowData[]
  ): Promise<Record<OperationType, TParsedProductImportRowData[]>> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const shippingProfile = await this.shippingProfileService_
      .withTransaction(transactionManager)
      .retrieveDefault()

    const seenProducts = {}

    const productsCreate: TParsedProductImportRowData[] = []
    const productsUpdate: TParsedProductImportRowData[] = []

    const variantsCreate: TParsedProductImportRowData[] = []
    const variantsUpdate: TParsedProductImportRowData[] = []

    for (const row of csvData) {
      if ((row["variant.prices"] as Record<string, any>[]).length) {
        await this.prepareVariantPrices(row)
      }

      if (row["variant.id"]) {
        variantsUpdate.push(row)
      } else {
        variantsCreate.push(row)
      }

      // save only first occurrence
      if (!seenProducts[row["product.handle"] as string]) {
        row["product.profile_id"] = shippingProfile!.id
        if (row["product.product.id"]) {
          productsUpdate.push(row)
        } else {
          productsCreate.push(row)
        }

        seenProducts[row["product.handle"] as string] = true
      }
    }

    return {
      [OperationType.ProductCreate]: productsCreate,
      [OperationType.VariantCreate]: variantsCreate,
      [OperationType.ProductUpdate]: productsUpdate,
      [OperationType.VariantUpdate]: variantsUpdate,
    }
  }

  /**
   * Prepare prices records for insert - find and append region ids to records that contain a region name.
   *
   * @param row - An object containing parsed row data.
   */
  protected async prepareVariantPrices(row): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    const prices: Record<string, string | number>[] = []

    for (const price of row["variant.prices"]) {
      const record: Record<string, string | number> = {
        amount: price.amount,
      }

      if (price.regionName) {
        try {
          record.region_id = (
            await this.regionService_
              .withTransaction(transactionManager)
              .retrieveByName(price.regionName)
          )?.id
        } catch (e) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Trying to set a price for a region ${price.regionName} that doesn't exist`
          )
        }
      } else {
        record.currency_code = price.currency_code
      }

      prices.push(record)
    }

    row["variant.prices"] = prices
  }

  /**
   * A worker method called after a batch job has been created.
   * The method parses a CSV file, generates sets of instructions
   * for processing and stores these instructions to a JSON file
   * which is uploaded to a bucket.
   *
   * @param batchJobId - An id of a job that is being preprocessed.
   */
  async preProcessBatchJob(batchJobId: string): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const batchJob = await this.batchJobService_
      .withTransaction(transactionManager)
      .retrieve(batchJobId)

    const csvFileKey = (batchJob.context as ImportJobContext).fileKey
    const csvStream = await this.fileService_.getDownloadStream({
      fileKey: csvFileKey,
    })

    let builtData: Record<string, string>[]
    try {
      const parsedData = await this.csvParser_.parse(csvStream)
      builtData = await this.csvParser_.buildData(parsedData)
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The csv file parsing failed due to: " + e.message
      )
    }

    const ops = await this.getImportInstructions(builtData)

    await this.uploadImportOpsFile(batchJobId, ops)

    let totalOperationCount = 0
    const operationsCounts = {}
    Object.keys(ops).forEach((key) => {
      operationsCounts[key] = ops[key].length
      totalOperationCount += ops[key].length
    })

    await this.batchJobService_
      .withTransaction(transactionManager)
      .update(batchJobId, {
        result: {
          advancement_count: 0,
          // number of update/create operations to execute
          count: totalOperationCount,
          operations: operationsCounts,
          stat_descriptors: [
            {
              key: "product-import-count",
              name: "Products/variants to import",
              message: `There will be ${
                ops[OperationType.ProductCreate].length
              } products created (${
                ops[OperationType.ProductUpdate].length
              }  updated).
             ${
               ops[OperationType.VariantCreate].length
             } variants will be created and ${
                ops[OperationType.VariantUpdate].length
              } updated`,
            },
          ],
        },
      })
  }

  /**
   * The main processing method called after a batch job
   * is ready/confirmed for processing.
   *
   * @param batchJobId - An id of a batch job that is being processed.
   */
  async processJob(batchJobId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const batchJob = (await this.batchJobService_
        .withTransaction(manager)
        .retrieve(batchJobId)) as ProductImportBatchJob

      await this.createProducts(batchJob)
      await this.updateProducts(batchJob)
      await this.createVariants(batchJob)
      await this.updateVariants(batchJob)

      await this.finalize(batchJob)
    })
  }

  /**
   * Create, or retrieve by name, sales channels from the input data.
   *
   * NOTE: Sales channel names provided in the CSV must exist in the DB.
   *       New sales channels will not be created.
   *
   * @param data an array of sales channels partials
   * @return an array of sales channels created or retrieved by name
   */
  private async processSalesChannels(
    data: Pick<SalesChannel, "name" | "id">[]
  ): Promise<SalesChannel[]> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const salesChannelServiceTx =
      this.salesChannelService_.withTransaction(transactionManager)

    const salesChannels: SalesChannel[] = []

    for (const input of data) {
      let channel: SalesChannel | null = null

      if (input.id) {
        try {
          channel = await salesChannelServiceTx.retrieve(input.id, {
            select: ["id"],
          })
        } catch (e) {
          // noop - check if the channel exists with provided name
        }
      }

      if (!channel) {
        try {
          channel = (await salesChannelServiceTx.retrieveByName(input.name, {
            select: ["id"],
          })) as SalesChannel
        } catch (e) {
          // noop
        }
      }

      if (channel) {
        salesChannels.push(channel)
      }
    }

    return salesChannels
  }

  /**
   * Method creates products using `ProductService` and parsed data from a CSV row.
   *
   * @param batchJob - The current batch job being processed.
   */
  private async createProducts(batchJob: ProductImportBatchJob): Promise<void> {
    if (!batchJob.result.operations[OperationType.ProductCreate]) {
      return
    }

    const transactionManager = this.transactionManager_ ?? this.manager_

    const productOps = await this.downloadImportOpsFile(
      batchJob.id,
      OperationType.ProductCreate
    )

    const productServiceTx =
      this.productService_.withTransaction(transactionManager)

    const isSalesChannelsFeatureOn = this.featureFlagRouter_.isFeatureEnabled(
      SalesChannelFeatureFlag.key
    )

    for (const productOp of productOps) {
      const productData = transformProductData(
        productOp
      ) as unknown as CreateProductInput

      try {
        if (isSalesChannelsFeatureOn && productOp["product.sales_channels"]) {
          productData["sales_channels"] = await this.processSalesChannels(
            productOp["product.sales_channels"] as Pick<
              SalesChannel,
              "name" | "id"
            >[]
          )
        }

        await productServiceTx.create(productData)
      } catch (e) {
        ProductImportStrategy.throwDescriptiveError(productOp, e.message)
      }

      await this.updateProgress(batchJob.id)
    }
  }

  /**
   * Method updates existing products in the DB using a CSV row data.
   *
   * @param batchJob - The current batch job being processed.
   */
  private async updateProducts(batchJob: ProductImportBatchJob): Promise<void> {
    if (!batchJob.result.operations[OperationType.ProductUpdate]) {
      return
    }

    const transactionManager = this.transactionManager_ ?? this.manager_
    const productOps = await this.downloadImportOpsFile(
      batchJob.id,
      OperationType.ProductUpdate
    )

    const productServiceTx =
      this.productService_.withTransaction(transactionManager)

    const isSalesChannelsFeatureOn = this.featureFlagRouter_.isFeatureEnabled(
      SalesChannelFeatureFlag.key
    )

    for (const productOp of productOps) {
      const productData = transformProductData(productOp) as UpdateProductInput
      try {
        if (isSalesChannelsFeatureOn) {
          productData["sales_channels"] = await this.processSalesChannels(
            productOp["product.sales_channels"] as Pick<
              SalesChannel,
              "name" | "id"
            >[]
          )
        }

        await productServiceTx.update(
          productOp["product.id"] as string,
          productData
        )
      } catch (e) {
        ProductImportStrategy.throwDescriptiveError(productOp, e.message)
      }

      await this.updateProgress(batchJob.id)
    }
  }

  /**
   * Method creates product variants from a CSV data.
   * Method also handles processing of variant options.
   *
   * @param batchJob - The current batch job being processed.
   */
  private async createVariants(batchJob: ProductImportBatchJob): Promise<void> {
    if (!batchJob.result.operations[OperationType.VariantCreate]) {
      return
    }

    const transactionManager = this.transactionManager_ ?? this.manager_

    const variantOps = await this.downloadImportOpsFile(
      batchJob.id,
      OperationType.VariantCreate
    )

    for (const variantOp of variantOps) {
      try {
        const variant = transformVariantData(variantOp)

        const product = await this.productService_
          .withTransaction(transactionManager)
          .retrieveByHandle(variantOp["product.handle"] as string, {
            relations: ["variants", "variants.options", "options"],
          })

        const optionIds =
          (variantOp["product.options"] as Record<string, string>[])?.map(
            (variantOption) =>
              product!.options.find(
                (createdProductOption) =>
                  createdProductOption.title === variantOption.title
              )!.id
          ) || []

        variant.options =
          (variant.options as Record<string, any>[])?.map((o, index) => ({
            ...o,
            option_id: optionIds[index],
          })) || []

        await this.productVariantService_
          .withTransaction(transactionManager)
          .create(product!, variant as unknown as CreateProductVariantInput)

        await this.updateProgress(batchJob.id)
      } catch (e) {
        ProductImportStrategy.throwDescriptiveError(variantOp, e.message)
      }
    }
  }

  /**
   * Method updates product variants from a CSV data.
   *
   * @param batchJob - The current batch job being processed.
   */
  private async updateVariants(batchJob: ProductImportBatchJob): Promise<void> {
    if (!batchJob.result.operations[OperationType.VariantUpdate]) {
      return
    }

    const transactionManager = this.transactionManager_ ?? this.manager_

    const variantOps = await this.downloadImportOpsFile(
      batchJob.id,
      OperationType.VariantUpdate
    )

    const productServiceTx =
      this.productService_.withTransaction(transactionManager)

    for (const variantOp of variantOps) {
      try {
        const product = await productServiceTx.retrieveByHandle(
          variantOp["product.handle"] as string
        )

        await this.prepareVariantOptions(variantOp, product.id)

        await this.productVariantService_
          .withTransaction(transactionManager)
          .update(
            variantOp["variant.id"] as string,
            transformVariantData(variantOp) as UpdateProductVariantInput
          )
      } catch (e) {
        ProductImportStrategy.throwDescriptiveError(variantOp, e.message)
      }

      await this.updateProgress(batchJob.id)
    }
  }

  /**
   * Extend records used for creating variant options with corresponding product option ids.
   *
   * @param variantOp - Parsed row data form CSV
   * @param productId - id of variant's product
   */
  protected async prepareVariantOptions(
    variantOp,
    productId: string
  ): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const productOptions = variantOp["variant.options"] || []

    const productServiceTx =
      this.productService_.withTransaction(transactionManager)
    for (const o of productOptions) {
      const option = await productServiceTx.retrieveOptionByTitle(
        o._title,
        productId
      )
      o.option_id = option?.id
    }
  }

  /**
   * Store import ops JSON file to a bucket.
   *
   * @param batchJobId - An id of the current batch job being processed.
   * @param results - An object containing parsed CSV data.
   */
  protected async uploadImportOpsFile(
    batchJobId: string,
    results: Record<OperationType, TParsedProductImportRowData[]>
  ): Promise<void> {
    const uploadPromises: Promise<void>[] = []
    const transactionManager = this.transactionManager_ ?? this.manager_

    for (const op in results) {
      if (results[op]?.length) {
        const { writeStream, promise } = await this.fileService_
          .withTransaction(transactionManager)
          .getUploadStreamDescriptor({
            name: ProductImportStrategy.buildFilename(batchJobId, op),
            ext: "json",
          })

        uploadPromises.push(promise)

        writeStream.write(JSON.stringify(results[op]))
        writeStream.end()
      }
    }

    await Promise.all(uploadPromises)
  }

  /**
   * Remove parsed ops JSON file.
   *
   * @param batchJobId - An id of the current batch job being processed.
   * @param op - Type of import operation.
   */
  protected async downloadImportOpsFile(
    batchJobId: string,
    op: OperationType
  ): Promise<TParsedProductImportRowData[]> {
    let data = ""
    const transactionManager = this.transactionManager_ ?? this.manager_

    const readableStream = await this.fileService_
      .withTransaction(transactionManager)
      .getDownloadStream({
        fileKey: ProductImportStrategy.buildFilename(batchJobId, op, {
          appendExt: ".json",
        }),
      })

    return await new Promise((resolve) => {
      readableStream.on("data", (chunk) => {
        data += chunk
      })
      readableStream.on("end", () => {
        resolve(JSON.parse(data))
      })
      readableStream.on("error", () => {
        // TODO: maybe should throw
        resolve([] as TParsedProductImportRowData[])
      })
    })
  }

  /**
   * Delete parsed CSV ops files.
   *
   * @param batchJobId - An id of the current batch job being processed.
   */
  protected async deleteOpsFiles(batchJobId: string): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    const fileServiceTx = this.fileService_.withTransaction(transactionManager)
    for (const op of Object.values(OperationType)) {
      try {
        await fileServiceTx.delete({
          fileKey: ProductImportStrategy.buildFilename(batchJobId, op, {
            appendExt: ".json",
          }),
        })
      } catch (e) {
        // noop
      }
    }
  }

  /**
   * Update count of processed data in the batch job `result` column
   * and cleanup temp JSON files.
   *
   * @param batchJob - The current batch job being processed.
   */
  private async finalize(batchJob: BatchJob): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    delete this.processedCounter[batchJob.id]

    await this.batchJobService_
      .withTransaction(transactionManager)
      .update(batchJob.id, {
        result: { advancement_count: batchJob.result.count },
      })

    const { fileKey } = batchJob.context as ImportJobContext

    await this.fileService_
      .withTransaction(transactionManager)
      .delete({ fileKey })

    await this.deleteOpsFiles(batchJob.id)
  }

  /**
   * Store the progress in the batch job `result` column.
   * Method is called after every update/create operation,
   * but after every `BATCH_SIZE` processed rows info is written to the DB.
   *
   * @param batchJobId - An id of the current batch job being processed.
   */
  private async updateProgress(batchJobId: string): Promise<void> {
    const newCount = (this.processedCounter[batchJobId] || 0) + 1
    this.processedCounter[batchJobId] = newCount

    if (newCount % BATCH_SIZE !== 0) {
      return
    }

    await this.batchJobService_
      .withTransaction(this.transactionManager_ ?? this.manager_)
      .update(batchJobId, {
        result: {
          advancement_count: newCount,
        },
      })
  }

  private static buildFilename(
    batchJobId: string,
    operation: string,
    { appendExt }: { appendExt?: string } = { appendExt: undefined }
  ): string {
    const filename = `imports/products/ops/${batchJobId}-${operation}`
    return appendExt ? filename + appendExt : filename
  }
}

export default ProductImportStrategy

/**
 * Schema definition for the CSV parser.
 */
const CSVSchema: ProductImportCsvSchema = {
  columns: [
    // PRODUCT
    {
      name: "Product id",
      mapTo: "product.id",
    },
    {
      name: "Product Handle",
      mapTo: "product.handle",
      required: true,
    },
    { name: "Product Title", mapTo: "product.title" },
    { name: "Product Subtitle", mapTo: "product.subtitle" },
    { name: "Product Description", mapTo: "product.description" },
    { name: "Product Status", mapTo: "product.status" },
    { name: "Product Thumbnail", mapTo: "product.thumbnail" },
    { name: "Product Weight", mapTo: "product.weight" },
    { name: "Product Length", mapTo: "product.length" },
    { name: "Product Width", mapTo: "product.width" },
    { name: "Product Height", mapTo: "product.height" },
    { name: "Product HS Code", mapTo: "product.hs_code" },
    { name: "Product Origin Country", mapTo: "product.origin_country" },
    { name: "Product MID Code", mapTo: "product.mid_code" },
    { name: "Product Material", mapTo: "product.material" },
    // PRODUCT-COLLECTION
    { name: "Product Collection Title", mapTo: "product.collection.title" },
    { name: "Product Collection Handle", mapTo: "product.collection.handle" },
    // PRODUCT-TYPE
    { name: "Product Type", mapTo: "product.type.value" },
    // PRODUCT-TAGS
    {
      name: "Product Tags",
      mapTo: "product.tags",
      transform: (value: string) =>
        `${value}`.split(",").map((v) => ({ value: v })),
    },
    //
    { name: "Product Discountable", mapTo: "product.discountable" },
    { name: "Product External ID", mapTo: "product.external_id" },
    // PRODUCT-SHIPPING_PROFILE
    { name: "Product Profile Name", mapTo: "product.profile.name" },
    { name: "Product Profile Type", mapTo: "product.profile.type" },
    // VARIANTS
    {
      name: "Variant id",
      mapTo: "variant.id",
    },
    { name: "Variant Title", mapTo: "variant.title" },
    { name: "Variant SKU", mapTo: "variant.sku" },
    { name: "Variant Barcode", mapTo: "variant.barcode" },
    { name: "Variant Inventory Quantity", mapTo: "variant.inventory_quantity" },
    { name: "Variant Allow backorder", mapTo: "variant.allow_backorder" },
    { name: "Variant Manage inventory", mapTo: "variant.manage_inventory" },
    { name: "Variant Weight", mapTo: "variant.weight" },
    { name: "Variant Length", mapTo: "variant.length" },
    { name: "Variant Width", mapTo: "variant.width" },
    { name: "Variant Height", mapTo: "variant.height" },
    { name: "Variant HS Code", mapTo: "variant.hs_code" },
    { name: "Variant Origin Country", mapTo: "variant.origin_country" },
    { name: "Variant MID Code", mapTo: "variant.mid_code" },
    { name: "Variant Material", mapTo: "variant.material" },

    // ==== DYNAMIC FIELDS ====

    // PRODUCT_OPTIONS
    {
      name: "Option Name",
      match: /Option \d+ Name/,
      reducer: (builtLine, key, value): TBuiltProductImportLine => {
        builtLine["product.options"] = builtLine["product.options"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }
        ;(
          builtLine["product.options"] as Record<string, string | number>[]
        ).push({ title: value })

        return builtLine
      },
    },
    {
      name: "Option Value",
      match: /Option \d+ Value/,
      reducer: (
        builtLine: TParsedProductImportRowData,
        key: string,
        value: string,
        context: any
      ): TBuiltProductImportLine => {
        builtLine["variant.options"] = builtLine["variant.options"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        ;(
          builtLine["variant.options"] as Record<string, string | number>[]
        ).push({
          value,
          _title: context.line[key.slice(0, -6) + " Name"],
        })

        return builtLine
      },
    },

    // PRICES
    {
      name: "Price Region",
      match: /Price .* \[([A-Z]{2,4})\]/,
      reducer: (
        builtLine: TParsedProductImportRowData,
        key,
        value
      ): TBuiltProductImportLine => {
        builtLine["variant.prices"] = builtLine["variant.prices"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const regionName = key.split(" ")[1]
        ;(
          builtLine["variant.prices"] as Record<string, string | number>[]
        ).push({
          amount: value,
          regionName,
        })

        return builtLine
      },
    },
    {
      name: "Price Currency",
      match: /Price [A-Z]{2,4}/,
      reducer: (
        builtLine: TParsedProductImportRowData,
        key,
        value
      ): TBuiltProductImportLine => {
        builtLine["variant.prices"] = builtLine["variant.prices"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const currency = key.split(" ")[1]
        ;(
          builtLine["variant.prices"] as Record<string, string | number>[]
        ).push({
          amount: value,
          currency_code: currency,
        })

        return builtLine
      },
    },
    // IMAGES
    {
      name: "Image Url",
      match: /Image \d+ Url/,
      reducer: (builtLine: any, key, value): TBuiltProductImportLine => {
        builtLine["product.images"] = builtLine["product.images"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        builtLine["product.images"].push(value)

        return builtLine
      },
    },
  ],
}

const SalesChannelsSchema: ProductImportCsvSchema = {
  columns: [
    {
      name: "Sales Channel Name",
      match: /Sales Channel \d+ Name/,
      reducer: (builtLine, key, value): TBuiltProductImportLine => {
        builtLine["product.sales_channels"] =
          builtLine["product.sales_channels"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }
        ;(
          builtLine["product.sales_channels"] as Record<
            string,
            string | number
          >[]
        ).push({
          name: value,
        })

        return builtLine
      },
    },
    {
      name: "Sales Channel Id",
      match: /Sales Channel \d+ Id/,
      reducer: (builtLine, key, value): TBuiltProductImportLine => {
        builtLine["product.sales_channels"] =
          builtLine["product.sales_channels"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }
        ;(
          builtLine["product.sales_channels"] as Record<
            string,
            string | number
          >[]
        ).push({
          id: value,
        })

        return builtLine
      },
    },
  ],
}
