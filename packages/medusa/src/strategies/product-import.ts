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
import { ProductRepository } from "../repositories/product"
import { ProductVariantRepository } from "../repositories/product-variant"

type TLine = {
  id: string
  name: string
}

type ProductImportCsvSchema = CsvSchema<TLine>

type Context = {
  progress: number
  csvFileKey: string
}

type ImportOperation = {
  entityType: "product" | "variant"
  opType: "update" | "create"
}

const BATCH_SIZE = 100

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

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly csvParser_: CsvParser
  protected readonly batchJobService_: BatchJobService
  protected readonly productService_: ProductService
  protected readonly productVariantService_: ProductService
  protected readonly productRepo_: ProductRepository
  protected readonly productVariantRepo_: ProductVariantRepository
  protected readonly redisClient_: IORedis.Redis

  protected readonly fileService_: IFileService<any>

  constructor({
    batchJobService,
    productService,
    productRepository,
    productVariantService,
    productVariantRepository,
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
      CSVSchema
    )

    this.manager_ = manager
    this.redisClient_ = redisClient
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.productService_ = productService
    this.productVariantService_ = productVariantService
    this.productRepo_ = productRepository
    this.productVariantRepo_ = productVariantRepository
  }

  buildTemplate(): Promise<string> {
    throw new Error("Not implemented!")
  }

  async setImportDataToRedis(batchJobId: string, results: any): Promise<void> {
    await this.redisClient_.client.call(
      "JSON.SET",
      `pij_${batchJobId}`,
      "$",
      JSON.stringify(results) // TODO: check if `stringify` is needed
    )
    await this.redisClient_.expire(`pij_${batchJobId}`, 60 * 60)
  }

  async getImportDataFromRedis(
    batchJobId: string
  ): Promise<Record<string, string>[]> {
    return await this.redisClient_.client.call("JSON.GET", `pij_${batchJobId}`)
  }

  getImportInstructions(csvData: any[]) {
    const products: Record<string, ImportOperation> = {}
    const variants: Record<string, ImportOperation> = {}

    // const transactionManager = this.transactionManager_ ?? this.manager_
    //
    // const productRepo = transactionManager.getCustomRepository(
    //   this.productRepo_
    // )
    //
    // const productVariantRepo = transactionManager.getCustomRepository(
    //   this.productVariantRepo_
    // )

    // TODO: for now, pretend that every record is op == create
    csvData.forEach((row) => {
      // is variant OP
      if (row.variant_id) {
        variants[row.variant_id] = {
          data: row,
          entityType: "variant",
          opType: "create",
        }
      } else {
        products[row.product_id] = {
          data: row,
          entityType: "product",
          opType: "create",
        }
      }
    })

    return {
      products: Object.values(products),
      variants: Object.values(variants),
    }
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

    const ops = this.getImportInstructions(results)

    await this.setImportDataToRedis(`pij_${batchJobId}`, ops)

    return await this.batchJobService_.ready(batchJobId)
  }

  async processJob(batchJobId: string): Promise<BatchJob> {
    return await this.atomicPhase_(async (transactionManager) => {
      let batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      const productRepo = transactionManager.getCustomRepository(
        this.productRepo_
      )

      const productVariantRepo = transactionManager.getCustomRepository(
        this.productVariantRepo_
      )

      const { products: productOps, variants: variantOps } =
        (await this.getImportDataFromRedis(batchJob.id)) as {
          products: ImportOperation[]
          variants: ImportOperation[]
        }

      const total = productOps.length + variantOps.length

      //  ========== PRODUCTS CREATE ==========

      await productRepo.save(
        productOps.map((op) => op.data),
        { chunk: BATCH_SIZE }
      )

      batchJob = await this.batchJobService_.update(batchJobId, {
        ...batchJob.context,
        progress: productOps.length / total,
      })

      //  ========== VARIANTS CREATE ==========

      await productVariantRepo.save(
        variantOps.map((op) => op.data),
        { chunk: BATCH_SIZE }
      )

      batchJob = await this.batchJobService_.update(batchJobId, {
        ...batchJob.context,
        progress: variantOps.length / total,
      })

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

const CSVSchema: ProductImportCsvSchema = {
  columns: [
    { name: "Product Id", mapTo: "id", required: true },
    {
      name: "Product Handle",
      mapTo: "handle",
      // validator: {
      //   validate(
      //     value: string,
      //     context: CsvParserContext<TLine>
      //   ): Promise<boolean> {
      //     return Promise.resolve(false)
      //   },
      // },
    },
    { name: "Product Title", mapTo: "title" },
    { name: "Product Subtitle", mapTo: "subtitle" },
    { name: "Product Description", mapTo: "description" },
  ],
}
