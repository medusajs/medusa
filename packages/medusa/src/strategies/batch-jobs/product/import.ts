/* eslint-disable valid-jsdoc */
import { computerizeAmount, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"

import { AbstractBatchJobStrategy, IFileService } from "../../../interfaces"
import SalesChannelFeatureFlag from "../../../loaders/feature-flags/sales-channels"
import { BatchJob, SalesChannel } from "../../../models"
import {
  BatchJobService,
  ProductCollectionService,
  ProductService,
  ProductVariantService,
  RegionService,
  SalesChannelService,
  ShippingProfileService,
} from "../../../services"
import CsvParser from "../../../services/csv-parser"
import { CreateProductInput } from "../../../types/product"
import { CreateProductVariantInput } from "../../../types/product-variant"
import { FlagRouter } from "../../../utils/flag-router"
import {
  OperationType,
  ProductImportBatchJob,
  ProductImportCsvSchema,
  ProductImportInjectedProps,
  ProductImportJobContext,
  TParsedProductImportRowData,
} from "./types"
import {
  productImportColumnsDefinition,
  productImportSalesChannelsColumnsDefinition,
} from "./types/columns-definition"
import { transformProductData, transformVariantData } from "./utils"

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
  protected readonly productCollectionService_: ProductCollectionService
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
    productCollectionService,
    manager,
    featureFlagRouter,
  }: ProductImportInjectedProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    const isSalesChannelsFeatureOn = featureFlagRouter.isFeatureEnabled(
      SalesChannelFeatureFlag.key
    )

    this.csvParser_ = new CsvParser({
      columns: [
        ...productImportColumnsDefinition.columns,
        ...(isSalesChannelsFeatureOn
          ? productImportSalesChannelsColumnsDefinition.columns
          : []),
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
    this.productCollectionService_ = productCollectionService
  }

  async buildTemplate(): Promise<string> {
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
        if (row["product.id"]) {
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
          const region = await this.regionService_
            .withTransaction(transactionManager)
            .retrieveByName(price.regionName)

          record.region_id = region.id
          record.currency_code = region.currency_code
        } catch (e) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Trying to set a price for a region ${price.regionName} that doesn't exist`
          )
        }
      } else {
        record.currency_code = price.currency_code
      }

      record.amount = computerizeAmount(
        Number(record.amount),
        record.currency_code as string
      )
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

    const csvFileKey = (batchJob.context as ProductImportJobContext).fileKey
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
    const productCollectionServiceTx =
      this.productCollectionService_.withTransaction(transactionManager)

    const isSalesChannelsFeatureOn = this.featureFlagRouter_.isFeatureEnabled(
      SalesChannelFeatureFlag.key
    )

    for (const productOp of productOps) {
      const productData = transformProductData(productOp)

      try {
        if (isSalesChannelsFeatureOn && productOp["product.sales_channels"]) {
          productData["sales_channels"] = await this.processSalesChannels(
            productOp["product.sales_channels"] as Pick<
              SalesChannel,
              "name" | "id" | "description"
            >[]
          )
        }

        if (
          productOp["product.collection.handle"] != null &&
          productOp["product.collection.handle"] !== ""
        ) {
          productData.collection_id = (
            await productCollectionServiceTx.retrieveByHandle(
              productOp["product.collection.handle"] as string,
              { select: ["id"] }
            )
          ).id
          delete productData.collection
        }

        // TODO: we should only pass the expected data and should not have to cast the entire object. Here we are passing everything contained in productData
        await productServiceTx.create(
          productData as unknown as CreateProductInput
        )
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
    const productCollectionServiceTx =
      this.productCollectionService_.withTransaction(transactionManager)

    const isSalesChannelsFeatureOn = this.featureFlagRouter_.isFeatureEnabled(
      SalesChannelFeatureFlag.key
    )

    for (const productOp of productOps) {
      const productData = transformProductData(productOp)
      try {
        if (isSalesChannelsFeatureOn && productOp["product.sales_channels"]) {
          productData["sales_channels"] = await this.processSalesChannels(
            productOp["product.sales_channels"] as Pick<
              SalesChannel,
              "name" | "id" | "description"
            >[]
          )
        }

        delete productData.options // for now not supported in the update method

        if (
          productOp["product.collection.handle"] != null &&
          productOp["product.collection.handle"] !== ""
        ) {
          productData.collection_id = (
            await productCollectionServiceTx.retrieveByHandle(
              productOp["product.collection.handle"] as string,
              { select: ["id"] }
            )
          ).id
          delete productData.collection
        }

        // TODO: we should only pass the expected data. Here we are passing everything contained in productData
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
              )?.id
          ) || []

        variant.options =
          (variant.options as Record<string, any>[])?.map((o, index) => ({
            ...o,
            option_id: optionIds[index],
          })) || []

        delete variant.id
        delete variant.product

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

        const updateData = transformVariantData(variantOp)
        delete updateData.product
        delete updateData["product.handle"]

        await this.productVariantService_
          .withTransaction(transactionManager)
          .update(variantOp["variant.id"] as string, updateData)
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

    const { fileKey } = batchJob.context as ProductImportJobContext

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
