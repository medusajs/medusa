import { EntityManager } from "typeorm"
import IORedis from "ioredis"
import pickBy from "lodash/pickBy"

import { AbstractBatchJobStrategy, IFileService } from "../interfaces"
import { BatchJob } from "../models"

import CsvParser from "../services/csv-parser"
import { BatchJobService, ProductService } from "../services"
import { BatchJobStatus } from "../types/batch-job"
import { CsvSchema } from "../interfaces/csv-parser"
import { ProductRepository } from "../repositories/product"
import { ProductVariantRepository } from "../repositories/product-variant"

type TLine = {
  id: string
  name: string
}

type ProductImportCsvSchema = CsvSchema<TLine>

type Context = {
  total: number
  progress: number
  csvFileKey: string
}

enum OperationType {
  ProductCreate = "PRODUCT_CREATE",
  ProductUpdate = "PRODUCT_UPDATE",
  VariantCreate = "VARIANT_CREATE",
  VariantUpdate = "VARIANT_UPDATE",
}

const BATCH_SIZE = 100

function pickProductDataFromRow(
  data: Record<string, string>
): Record<string, string> {
  const productKeysPredicate = (key: string): boolean => /product./.test(key)

  return pickBy(data, productKeysPredicate)
}

function pickVariantDataFromRow(
  data: Record<string, string>
): Record<string, string> {
  const variantKeyPredicate = (key: string): boolean => /variant./.test(key)

  return pickBy(data, variantKeyPredicate)
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

    // @ts-ignore
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

  getImportInstructions(csvData: any[]): Record<OperationType, any[]> {
    const products: Record<string, any> = {}
    const variants: Record<string, any> = {}

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
      if (row.sku) {
        variants[row.sku] = { ...variants[row.sku], ...row }
      } else {
        products[row.handle] = { ...products[row.handle], ...row }
      }
    })

    return {
      [OperationType.ProductCreate]: Object.values(products),
      [OperationType.VariantCreate]: Object.values(variants),
      [OperationType.ProductUpdate]: [],
      [OperationType.VariantUpdate]: [],
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

    const data = await this.csvParser_.parse(csvStream)
    const results = await this.csvParser_.buildData(data)

    const ops = this.getImportInstructions(results)
    await this.setImportDataToRedis(batchJobId, ops)

    await this.batchJobService_.update(batchJobId, {
      context: {
        ...batchJob.context,
        total: results.length,
      },
    })

    return await this.batchJobService_.ready(batchJobId)
  }

  async processJob(batchJobId: string): Promise<BatchJob> {
    return await this.atomicPhase_(async (transactionManager) => {
      let batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      const productRepo = transactionManager.getCustomRepository(
        this.productRepo_ as any
      )

      const productVariantRepo = transactionManager.getCustomRepository(
        this.productVariantRepo_ as any
      )

      const total = batchJob.context.total

      const productOps = await this.getImportDataFromRedis(
        batchJob.id,
        OperationType.ProductCreate
      )

      //  ========== PRODUCTS CREATE ==========

      // await productRepo.save(
      //   productOps.map((op) => op.data),
      //   { chunk: BATCH_SIZE }
      // )
      //
      // batchJob = await this.batchJobService_.update(batchJobId, {
      //   ...batchJob.context,
      //   progress: productOps.length / total,
      // })

      for (const productOp of productOps) {
        await this.productService_.create(
          pickProductDataFromRow(productOp.data) // TODO: pick keys before saving to Redis
        )
      }

      //  ========== VARIANTS CREATE ==========

      // await productVariantRepo.save(
      //   variantOps.map((op) => op.data),
      //   { chunk: BATCH_SIZE }
      // )
      //
      // batchJob = await this.batchJobService_.update(batchJobId, {
      //   ...batchJob.context,
      //   progress: variantOps.length / total,
      // })

      const variantOps = await this.getImportDataFromRedis(
        batchJob.id,
        OperationType.VariantCreate
      )

      for (const variantOp of variantOps) {
        await this.productVariantService_.create(
          pickVariantDataFromRow(variantOp.data)
        )
      }

      return batchJob
    })
  }

  public async completeJob(batchJobId: string): Promise<BatchJob> {
    const batchJob = await this.batchJobService_.retrieve(batchJobId)

    if (batchJob.status !== BatchJobStatus.COMPLETED) {
      await this.clearRedisRecords(batchJob.id)
      return await this.batchJobService_.complete(batchJob)
    } else {
      return batchJob
    }
  }

  async setImportDataToRedis(
    batchJobId: string,
    results: Record<OperationType, any[]>
  ): Promise<void> {
    for (const op in results) {
      await this.redisClient_.client.call(
        "JSON.SET",
        `pij_${batchJobId}`,
        `$.${op}`, // JSONPath, $ is start
        JSON.stringify(results[op])
      )
    }

    await this.redisClient_.expire(`pij_${batchJobId}`, 60 * 60)
  }

  async getImportDataFromRedis(
    batchJobId: string,
    op: OperationType
  ): Promise<any[]> {
    return await this.redisClient_.client.call(
      "JSON.GET",
      `pij_${batchJobId}`,
      `$.${op}`
    )
  }

  async clearRedisRecords(batchJobId: string): Promise<void> {
    return await this.redisClient_.client.call("JSON.DEL", `pij_${batchJobId}`)
  }

  validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return Promise.resolve({})
  }

  validateFile(fileLocation: string): Promise<boolean> {
    return Promise.resolve(false)
  }
}

export default ProductImportStrategy

const CSVSchema: ProductImportCsvSchema = {
  columns: [
    // PRODUCT
    {
      name: "Product Handle",
      mapTo: "product.handle",
      required: true,
      // validator: {
      //   validate(
      //     value: string,
      //     context: CsvParserContext<TLine>
      //   ): Promise<boolean> {},
      // },
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
    { name: "Product Mid Code", mapTo: "product.mid_code" },
    { name: "Product Material", mapTo: "product.material" },
    // PRODUCT-COLLECTION
    { name: "Product Collection Title", mapTo: "product.collection.title" },
    { name: "Product Collection Handle", mapTo: "product.collection.handle" },
    // PRODUCT-TYPE
    { name: "Product Type", mapTo: "product.type.value" },
    // PRODUCT-TAGS
    { name: "Product Tags", mapTo: "product.tags" },
    //
    { name: "Product Discountable", mapTo: "product.discountable" },
    { name: "Product External ID", mapTo: "product.external_id" },
    // PRODUCT-SHIPPING_PROFILE
    { name: "Product Profile Name", mapTo: "product.profile.name" },
    { name: "Product Profile Type", mapTo: "product.profile.type" },
    // Variants
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
    { name: "Variant Mid Code", mapTo: "variant.mid_code" },
    { name: "Variant Material", mapTo: "variant.material" },

    // ==== DYNAMIC FIELDS ====

    // PRODUCT_OPTIONS
    {
      name: "Option Name",
      match: /Option \d+ Name/,
      mapTo: "product.options.name",
    },
    {
      name: "Option Value",
      match: /Option \d+ Value/,
      mapTo: "product.options.value",
    },
    // Prices
    {
      name: "Price Currency code",
      match: /Price \d+ Currency code/,
      mapTo: "ma.currency.code",
    },
    {
      name: "Price Region name",
      match: /Price \d+ Region name/,
      mapTo: "ma.region.name",
    },
    {
      name: "Price Amount",
      match: /Price \d+ Amount/,
      mapTo: "ma.amount",
    },
    // Images
    {
      name: "Image Url",
      match: /Image \d+ Url/,
      mapTo: "product.images.url",
    },
  ],
}
