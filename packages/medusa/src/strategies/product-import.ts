import { EntityManager } from "typeorm"

import { AbstractBatchJobStrategy, IFileService } from "../interfaces"
import { BatchJob } from "../models"

import CsvParser from "../services/csv-parser"
import { BatchJobService, ProductService } from "../services"
import { BatchJobStatus } from "../types/batch-job"
import {
  AbstractCsvValidator,
  CsvParserContext,
  CsvSchema,
} from "../interfaces/csv-parser"
import IORedis from "ioredis"

type TLine = {
  id: string
  name: string
}

type ProductImportCsvSchema = CsvSchema<TLine>

type Context = {
  progress: number
  csvFileKey: string
}

/**
 * THE FLOW
 *
 * ======== PREPARE BATCH JOB ========
 *
 * 1. (Upload) read a file
 * 2. Pipe the file to the CSV Parser
 * 3. Validate the results and pass them to Redis
 * 4. Dispatch an event (READY)
 *
 * ======== PROCESS BATCH JOB ========
 *
 * 5. Read from Redis
 * 6. In a loop insert batch by batch (of size N)
 * 7. Set as complete
 *
 */

class ProductImportStrategy extends AbstractBatchJobStrategy<ProductImportStrategy> {
  static identifier = "product-import"

  static batchType = "product_import"

  static CSVSchema: ProductImportCsvSchema = {
    columns: [
      {
        name: "handle",
        required: true,
        validator: {
          validate(
            value: string,
            context: CsvParserContext<TLine>
          ): Promise<boolean> {
            return Promise.resolve(false)
          },
        },
      },
    ],
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly csvParser_: CsvParser
  protected readonly batchJobService_: BatchJobService
  protected readonly productService: ProductService
  protected readonly redisClient_: IORedis.Redis

  protected readonly fileService_: IFileService<any>

  constructor({
    batchJobService,
    productService,
    fileService,
    redisClient,
    manager,
    // csvParser
  }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.csvParser_ = new CsvParser<ProductImportCsvSchema, unknown, unknown>(
      // eslint-disable-next-line prefer-rest-params
      arguments[0],
      ProductImportStrategy.CSVSchema
    )

    this.manager_ = manager
    this.redisClient_ = redisClient
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.productService = productService
  }

  buildTemplate(): Promise<string> {
    throw new Error("Not implemented!")
  }

  async setParsingResultsToRedis(
    results: any,
    batchJobId: string
  ): Promise<void> {
    await this.redisClient_.client.call(
      "JSON.SET",
      `pij_${batchJobId}`,
      "$",
      JSON.stringify(results) // TODO: check if `stringify` is needed
    )
    // TODO: expire
  }

  async getParsingResultsFromRedis(batchJobId: string): Promise<void> {
    return await this.redisClient_.client.call("JSON.GET", `pij_${batchJobId}`)
  }

  async prepareBatchJobForProcessing(
    batchJobId: string,
    req: any
  ): Promise<BatchJob> {
    const batchJob = await this.batchJobService_.retrieve(batchJobId)

    const csvFileKey = (batchJob.context as Context).csvFileKey
    const csvStream = await this.fileService_.getDownloadStream({
      key: csvFileKey,
    })

    const results = await this.csvParser_.parse(csvStream)
    await this.redisClient_.set(`pij_${batchJobId}`, JSON.stringify(results)) // TODO: do this better

    return await this.batchJobService_.ready(batchJobId)
  }

  async processJob(batchJobId: string): Promise<BatchJob> {
    return await this.atomicPhase_(async (transactionManager) => {
      const batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      return batchJob
    })
  }

  public async completeJob(batchJobId: string): Promise<BatchJob> {
    const batchJob = await this.batchJobService_.retrieve(batchJobId)

    if (batchJob.status !== BatchJobStatus.COMPLETED) {
      return await this.batchJobService_.complete(batchJob)
    } else {
      return batchJob
    }
  }

  validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return Promise.resolve(undefined)
  }

  validateFile(fileLocation: string): Promise<boolean> {
    return Promise.resolve(false)
  }
}

export default ProductImportStrategy
