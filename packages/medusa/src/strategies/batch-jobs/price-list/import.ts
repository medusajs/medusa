import { EntityManager } from "typeorm"
import { computerizeAmount, MedusaError } from "medusa-core-utils"

import { AbstractBatchJobStrategy, IFileService } from "../../../interfaces"
import CsvParser from "../../../services/csv-parser"
import {
  BatchJobService,
  PriceListService,
  ProductVariantService,
  RegionService,
} from "../../../services"
import { CreateBatchJobInput } from "../../../types/batch-job"
import {
  InjectedProps,
  OperationType,
  ParsedPriceListImportPrice,
  PriceListImportBatchJob,
  PriceListImportCsvSchema,
  PriceListImportOperation,
  PriceListImportOperationPrice,
  TBuiltPriceListImportLine,
  TParsedPriceListImportRowData,
} from "./types"

/*
 * Default strategy class used for a batch import of products/variants.
 */
class PriceListImportStrategy extends AbstractBatchJobStrategy {
  static identifier = "price-list-import-strategy"

  static batchType = "price-list-import"

  private processedCounter: Record<string, number> = {}

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly fileService_: IFileService

  protected readonly regionService_: RegionService
  protected readonly priceListService_: PriceListService
  protected readonly batchJobService_: BatchJobService
  protected readonly productVariantService_: ProductVariantService

  protected readonly csvParser_: CsvParser<
    PriceListImportCsvSchema,
    Record<string, string>,
    Record<string, string>
  >

  constructor({
    batchJobService,
    productVariantService,
    priceListService,
    regionService,
    fileService,
    manager,
  }: InjectedProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.csvParser_ = new CsvParser(CSVSchema)

    this.manager_ = manager
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.priceListService_ = priceListService
    this.productVariantService_ = productVariantService
    this.regionService_ = regionService
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
    row: TParsedPriceListImportRowData,
    errorDescription?: string
  ): never {
    const message = `Error while processing row with:
      variant ID: ${row[PriceListRowKeys.VARIANT_ID]},
      variant SKU: ${row[PriceListRowKeys.VARIANT_SKU]},
      ${errorDescription}`

    throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
  }

  async prepareBatchJobForProcessing(
    batchJob: CreateBatchJobInput,
    reqContext: any
  ): Promise<CreateBatchJobInput> {
    const manager = this.transactionManager_ ?? this.manager_

    if (!batchJob.context?.price_list_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Price list id is required"
      )
    }

    // Validate that PriceList exists
    const priceListId = batchJob.context.price_list_id as string
    await this.priceListService_.withTransaction(manager).retrieve(priceListId)

    return batchJob
  }

  /**
   * Generate instructions for creation of prices from parsed CSV rows.
   *
   * @param priceListId - the ID of the price list where the prices will be created
   * @param csvData - An array of parsed CSV rows.
   */
  async getImportInstructions(
    priceListId: string,
    csvData: TParsedPriceListImportRowData[]
  ): Promise<Record<OperationType, PriceListImportOperation[]>> {
    // Validate that PriceList exists
    const manager = this.transactionManager_ ?? this.manager_
    await this.priceListService_.withTransaction(manager).retrieve(priceListId)

    const pricesToCreate: PriceListImportOperation[] = []

    for (const row of csvData) {
      let variantId = row[PriceListRowKeys.VARIANT_ID]

      if (!variantId) {
        if (!row[PriceListRowKeys.VARIANT_SKU]) {
          PriceListImportStrategy.throwDescriptiveError(
            row,
            "SKU or ID is required"
          )
        }

        const variant = await this.productVariantService_.retrieveBySKU(
          `${row[PriceListRowKeys.VARIANT_SKU]}`,
          {
            select: ["id"],
          }
        )
        variantId = variant.id
      } else {
        // Validate that product exists
        await this.productVariantService_.retrieve(`${variantId}`, {
          select: ["id"],
        })
      }

      const pricesOperationData = await this.prepareVariantPrices(
        row[PriceListRowKeys.PRICES] as ParsedPriceListImportPrice[]
      )

      pricesToCreate.push({
        variant_id: `${variantId}`,
        prices: pricesOperationData,
      })
    }

    return {
      [OperationType.PricesCreate]: pricesToCreate,
    }
  }

  /**
   * Prepare prices records for insert - find and append region ids to records that contain a region name.
   *
   * @param prices - the parsed prices to prepare
   * @returns the prepared prices. All prices have amount in DB format, currency_code and if applicable region_id.
   */
  protected async prepareVariantPrices(
    prices: ParsedPriceListImportPrice[]
  ): Promise<PriceListImportOperationPrice[]> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    const operationalPrices: PriceListImportOperationPrice[] = []

    for (const price of prices) {
      const record: Partial<PriceListImportOperationPrice> = {
        amount: price.amount,
      }

      if ("region_name" in price) {
        try {
          const region = await this.regionService_
            .withTransaction(transactionManager)
            .retrieveByName(price.region_name)

          record.region_id = region.id
          record.currency_code = region.currency_code
        } catch (e) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Trying to set a price for a region ${price.region_name} that doesn't exist`
          )
        }
      } else {
        // TODO: Verify that currency is activated for store
        record.currency_code = price.currency_code
      }

      record.amount = computerizeAmount(
        record.amount as number,
        record.currency_code
      )

      operationalPrices.push(record as PriceListImportOperationPrice)
    }

    return operationalPrices
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
    const batchJob = (await this.batchJobService_
      .withTransaction(transactionManager)
      .retrieve(batchJobId)) as PriceListImportBatchJob

    const csvFileKey = batchJob.context.fileKey
    const priceListId = batchJob.context.price_list_id
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

    const ops = await this.getImportInstructions(priceListId, builtData)

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
              key: "price-list-import-count",
              name: "PriceList to import",
              message: `${
                ops[OperationType.PricesCreate].length
              } prices will be added`,
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
        .retrieve(batchJobId)) as PriceListImportBatchJob

      const priceListId = batchJob.context.price_list_id
      const txPriceListService = this.priceListService_.withTransaction(manager)

      // Delete Existing prices for price list
      await txPriceListService.clearPrices(priceListId)

      // Upload new prices for price list
      const priceImportOperations = await this.downloadImportOpsFile(
        batchJobId,
        OperationType.PricesCreate
      )

      await Promise.all(
        priceImportOperations.map(async (op) => {
          await txPriceListService.addPrices(
            priceListId,
            op.prices.map((p) => {
              return {
                ...p,
                variant_id: op.variant_id,
              }
            })
          )
        })
      )

      await this.finalize(batchJob)
    })
  }

  /**
   * Store import ops JSON file to a bucket.
   *
   * @param batchJobId - An id of the current batch job being processed.
   * @param results - An object containing parsed CSV data.
   */
  protected async uploadImportOpsFile(
    batchJobId: string,
    results: Record<OperationType, PriceListImportOperation[]>
  ): Promise<void> {
    const uploadPromises: Promise<void>[] = []
    const transactionManager = this.transactionManager_ ?? this.manager_

    for (const op in results) {
      if (results[op]?.length) {
        const { writeStream, promise } = await this.fileService_
          .withTransaction(transactionManager)
          .getUploadStreamDescriptor({
            name: PriceListImportStrategy.buildFilename(batchJobId, op),
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
  ): Promise<PriceListImportOperation[]> {
    let data = ""
    const transactionManager = this.transactionManager_ ?? this.manager_

    const readableStream = await this.fileService_
      .withTransaction(transactionManager)
      .getDownloadStream({
        fileKey: PriceListImportStrategy.buildFilename(batchJobId, op, {
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
        resolve([] as PriceListImportOperation[])
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
          fileKey: PriceListImportStrategy.buildFilename(batchJobId, op, {
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
  private async finalize(batchJob: PriceListImportBatchJob): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    delete this.processedCounter[batchJob.id]

    await this.batchJobService_
      .withTransaction(transactionManager)
      .update(batchJob.id, {
        result: { advancement_count: batchJob.result.count },
      })

    const { fileKey } = batchJob.context

    await this.fileService_
      .withTransaction(transactionManager)
      .delete({ fileKey })

    await this.deleteOpsFiles(batchJob.id)
  }

  private static buildFilename(
    batchJobId: string,
    operation: string,
    { appendExt }: { appendExt?: string } = { appendExt: undefined }
  ): string {
    const filename = `imports/price-lists/ops/${batchJobId}-${operation}`
    return appendExt ? filename + appendExt : filename
  }
}

export default PriceListImportStrategy

enum PriceListRowKeys {
  VARIANT_ID = "id",
  VARIANT_SKU = "sku",
  PRICES = "prices",
}

/**
 * Schema definition for the CSV parser.
 */
const CSVSchema: PriceListImportCsvSchema = {
  columns: [
    {
      name: "Product Variant ID",
      mapTo: PriceListRowKeys.VARIANT_ID,
    },
    { name: "SKU", mapTo: PriceListRowKeys.VARIANT_SKU },
    {
      name: "Price Region",
      match: /Price (.*) \[([A-Z]{3})\]/,
      reducer: (
        builtLine: TBuiltPriceListImportLine,
        key: string,
        value: string
      ): TBuiltPriceListImportLine => {
        builtLine[PriceListRowKeys.PRICES] =
          builtLine[PriceListRowKeys.PRICES] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const [, regionName] =
          key.trim().match(/Price (.*) \[([A-Z]{3})\]/) || []
        builtLine[PriceListRowKeys.PRICES].push({
          amount: parseFloat(value),
          region_name: regionName,
        })

        return builtLine
      },
    },
    {
      name: "Price Currency",
      match: /Price [A-Z]{3}/,
      reducer: (
        builtLine: TBuiltPriceListImportLine,
        key: string,
        value: string
      ): TBuiltPriceListImportLine => {
        builtLine[PriceListRowKeys.PRICES] =
          builtLine[PriceListRowKeys.PRICES] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const currency = key.trim().split(" ")[1]
        builtLine[PriceListRowKeys.PRICES].push({
          amount: parseFloat(value),
          currency_code: currency.toLowerCase(),
        })

        return builtLine
      },
    },
  ],
}
