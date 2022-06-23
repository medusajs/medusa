import { EntityManager } from "typeorm"
import * as IORedis from "ioredis"

import { AbstractBatchJobStrategy, IFileService } from "../../interfaces"
import { BatchJob, ProductOption } from "../../models"

import CsvParser from "../../services/csv-parser"
import {
  BatchJobService,
  ProductService,
  ProductVariantService,
  ShippingProfileService,
} from "../../services"
import { BatchJobStatus } from "../../types/batch-job"
import { CsvSchema } from "../../interfaces/csv-parser"
import { ProductRepository } from "../../repositories/product"
import { ProductVariantRepository } from "../../repositories/product-variant"
import { ProductOptionRepository } from "../../repositories/product-option"

/* ******************** TYPES ******************** */

type TLine = {
  id: string
  name: string
}

type ProductImportCsvSchema = CsvSchema<TLine>

type Context = {
  total: number
  progress: number
  fileKey: string
}

/**
 * Supported batch job ops.
 */
enum OperationType {
  ProductCreate = "PRODUCT_CREATE",
  ProductUpdate = "PRODUCT_UPDATE",
  VariantCreate = "VARIANT_CREATE",
  VariantUpdate = "VARIANT_UPDATE",
}

/**
 * Process this many variant rows before reporting progress.
 */
const BATCH_SIZE = 100

/* ******************** UTILS ******************** */

function pickObjectPropsByRegex(
  data: Record<string, string>,
  regex: RegExp
): Record<string, string> {
  const variantKeyPredicate = (key: string): boolean => regex.test(key)
  const ret = {}

  for (const k in data) {
    if (variantKeyPredicate(k)) {
      ret[k] = data[k]
    }
  }

  return ret
}

function transformProductData(
  data: Record<string, string>
): Record<string, string> {
  const ret = {}
  const productData = pickObjectPropsByRegex(data, /product\./)

  Object.keys(productData).forEach((k) => {
    const key = k.split("product.")[1]
    ret[key] = productData[k]
  })

  return ret
}

function transformVariantData(
  data: Record<string, string>
): Record<string, string | any[]> {
  const ret = {}
  const productData = pickObjectPropsByRegex(data, /variant\./)

  Object.keys(productData).forEach((k) => {
    const key = k.split("variant.")[1]
    ret[key] = productData[k]
  })

  // include product handle to keep track of associated product
  ret["product.handle"] = data["product.handle"]
  ret["product.options"] = data["product.options"]

  return ret
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
 * 5. Read from Redis for each op type
 * 6. In a loop insert/update one by one through the service methods
 *      - notify about progress after BATCH_SIZE of records has been processed
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
  protected readonly shippingProfileService_: typeof ShippingProfileService
  protected readonly productService_: ProductService
  protected readonly productVariantService_: ProductVariantService
  protected readonly productRepo_: typeof ProductRepository
  protected readonly productOptionRepo_: typeof ProductOptionRepository
  protected readonly productVariantRepo_: typeof ProductVariantRepository
  protected readonly redisClient_: IORedis.Redis

  protected readonly fileService_: IFileService<any>

  constructor({
    batchJobService,
    productService,
    productRepository,
    productOptionRepository,
    productVariantService,
    productVariantRepository,
    shippingProfileService,
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
    this.shippingProfileService_ = shippingProfileService
    this.productRepo_ = productRepository
    this.productOptionRepo_ = productOptionRepository
    this.productVariantRepo_ = productVariantRepository
  }

  buildTemplate(): Promise<string> {
    throw new Error("Not implemented!")
  }

  async getImportInstructions(
    csvData: any[]
  ): Promise<Record<OperationType, any[]>> {
    const productRepo = this.manager_.getCustomRepository(this.productRepo_)
    const productVariantRepo = this.manager_.getCustomRepository(
      this.productVariantRepo_
    )

    const shippingProfile = await this.shippingProfileService_.retrieveDefault()

    const seenProducts = {}

    const productsCreate: any[] = []
    const productsUpdate: any[] = []

    const variantsCreate: any[] = []
    const variantsUpdate: any[] = []

    for (const row of csvData) {
      let variant

      if (row["variant.id"]) {
        variant = await productVariantRepo.findOne({
          where: { id: row["variant.id"] },
        })
      }

      if (!variant && row["variant.sku"]) {
        variant = await productVariantRepo.findOne({
          where: { sku: row["variant.sku"] },
          select: ["id"],
        })

        row["variant.id"] = variant?.id
      }

      if (variant) {
        variantsUpdate.push(row)
      } else {
        variantsCreate.push(row)
      }

      // save only first occurrence
      if (!seenProducts[row["product.handle"]]) {
        const existingId = await productRepo.findOne({
          where: { handle: row["product.handle"] },
          select: ["id"],
        })

        row.product_id = existingId?.id
        row["product.profile_id"] = shippingProfile
        ;(existingId ? productsUpdate : productsCreate).push(row)

        seenProducts[row["product.handle"]] = true
      }
    }

    return {
      [OperationType.ProductCreate]: productsCreate,
      [OperationType.VariantCreate]: variantsCreate,
      [OperationType.ProductUpdate]: productsUpdate,
      [OperationType.VariantUpdate]: variantsUpdate,
    }
  }

  async preProcessBatchJob(batchJobId: string): Promise<void> {
    const batchJob = await this.batchJobService_.retrieve(batchJobId)

    const csvFileKey = (batchJob.context as Context).fileKey
    const csvStream = await this.fileService_.getDownloadStream({
      fileKey: csvFileKey,
    })

    const data = await this.csvParser_.parse(csvStream)
    const results = await this.csvParser_.buildData(data)

    const ops = await this.getImportInstructions(results)

    await this.setImportDataToRedis(batchJobId, ops)

    await this.batchJobService_.update(batchJobId, {
      context: {
        total: results.length,
      },
    })
  }

  async processJob(batchJobId: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      await this.createProducts(batchJobId, transactionManager)
      await this.updateProducts(batchJobId, transactionManager)
      await this.createVariants(batchJobId, transactionManager)
      await this.updateVariants(batchJobId, transactionManager)
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

  private async createProducts(
    batchJobId: string,
    transactionManager: EntityManager
  ): Promise<void> {
    const productOps = await this.getImportDataFromRedis(
      batchJobId,
      OperationType.ProductCreate
    )

    for (const productOp of productOps) {
      await this.productService_.withTransaction(transactionManager).create(
        transformProductData(productOp) as any // TODO: pick keys before saving to Redis
      )
    }
  }

  private async updateProducts(
    batchJobId: string,
    transactionManager: EntityManager
  ): Promise<void> {
    const productOps = await this.getImportDataFromRedis(
      batchJobId,
      OperationType.ProductUpdate
    )

    for (const productOp of productOps) {
      await this.productService_
        .withTransaction(transactionManager)
        .update(productOp.product_id, transformProductData(productOp))
    }
  }

  private async createVariants(
    batchJobId: string,
    transactionManager: EntityManager
  ): Promise<void> {
    const productRepo = transactionManager.getCustomRepository(
      this.productRepo_
    )

    const variantOps = await this.getImportDataFromRedis(
      batchJobId,
      OperationType.VariantCreate
    )

    for (const variantOp of variantOps) {
      const variant = transformVariantData(variantOp)

      const product = await productRepo.findOne({
        where: { handle: variantOp["product.handle"] },
        relations: ["variants", "variants.options", "options"],
      })

      const optionIds =
        variantOp["product.options"]?.map(
          (variantOption) =>
            // @ts-ignore
            product.options?.find(
              (createdProductOption) =>
                createdProductOption.title === variantOption.title
            ).id
        ) || []

      variant.options =
        (variant.options as object[])?.map((o, index) => ({
          ...o,
          option_id: optionIds[index],
        })) || []

      await this.productVariantService_
        .withTransaction(transactionManager)
        .create(product!, variant as any)
    }
  }

  private async updateVariants(
    batchJobId: string,
    transactionManager: EntityManager
  ): Promise<void> {
    const productOptionRepo = this.manager_.getCustomRepository(
      this.productOptionRepo_
    )

    const variantOps = await this.getImportDataFromRedis(
      batchJobId,
      OperationType.VariantUpdate
    )

    for (const variantOp of variantOps) {
      const productOptions = variantOp["variant.options"] || []

      for (const o of productOptions) {
        const { id } = (await productOptionRepo.findOne({
          where: { title: o._title },
        })) as ProductOption

        o.option_id = id
      }

      await this.productVariantService_
        .withTransaction(transactionManager)
        .update(variantOp["variant.id"], transformVariantData(variantOp) as any)
    }
  }

  private async updateProgress(
    processedRowsCount: number,
    batchJobId: string,
    transactionManager: EntityManager
  ): Promise<void> {
    const batchJob = await this.batchJobService_
      .withTransaction(transactionManager)
      .retrieve(batchJobId)

    // @ts-ignore
    const progress = batchJob.context.progress + processedRowsCount

    await this.batchJobService_
      .withTransaction(transactionManager)
      .update(batchJobId, {
        context: { progress },
      })
  }

  async setImportDataToRedis(
    batchJobId: string,
    results: Record<OperationType, any[]>
  ): Promise<void> {
    for (const op in results) {
      if (results[op]?.length) {
        // @ts-ignore
        await this.redisClient_.call(
          "JSON.SET",
          `pij_${batchJobId}:${op}`,
          "$", // JSONPath, $ is start
          JSON.stringify(results[op])
        )

        await this.redisClient_.expire(`pij_${batchJobId}:${op}`, 60 * 60)
      }
    }
  }

  async getImportDataFromRedis(
    batchJobId: string,
    op: OperationType
  ): Promise<any[]> {
    return (
      JSON.parse(
        // @ts-ignore
        await this.redisClient_.call("JSON.GET", `pij_${batchJobId}:${op}`, "$")
      )?.[0] || []
    ) // JSONPath always returns an array of results that matched a query
  }

  async clearRedisRecords(batchJobId: string): Promise<void> {
    // @ts-ignore
    return await this.redisClient_.call("JSON.DEL", `pij_${batchJobId}:*`)
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
      name: "Product id",
      mapTo: "todo.product.id",
      required: true,
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
    { name: "Product Mid Code", mapTo: "product.mid_code" },
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
      transform: (value) => `${value}`.split(",").map((v) => ({ value: v })),
    },
    //
    { name: "Product Discountable", mapTo: "product.discountable" },
    { name: "Product External ID", mapTo: "product.external_id" },
    // PRODUCT-SHIPPING_PROFILE
    { name: "Product Profile Name", mapTo: "product.profile.name" },
    { name: "Product Profile Type", mapTo: "product.profile.type" },
    // Variants
    {
      name: "Variant id",
      mapTo: "todo.variant.id",
      required: true,
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
    { name: "Variant Mid Code", mapTo: "variant.mid_code" },
    { name: "Variant Material", mapTo: "variant.material" },

    // ==== DYNAMIC FIELDS ====

    // PRODUCT_OPTIONS
    {
      name: "Option Name",
      match: /Option \d+ Name/,
      reducer: (builtLine: any, key, value, context) => {
        builtLine["product.options"] = builtLine["product.options"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        builtLine["product.options"].push({ title: value })

        return builtLine
      },
    },
    {
      name: "Option Value",
      match: /Option \d+ Value/,
      reducer: (builtLine: any, key, value, context) => {
        builtLine["variant.options"] = builtLine["variant.options"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        builtLine["variant.options"].push({
          value,
          _title: context.line[key.slice(0, -6) + " Name"],
        })

        return builtLine
      },
    },
    // Prices
    {
      name: "Price Region",
      match: /Price .* \[([A-Z]{2,4})\]/,
      mapTo: "todo.ma.currency",
    },
    {
      name: "Price Currency",
      match: /Price [A-Z]{2,4}/,
      mapTo: "todo.ma.region",
    },
    // Images
    {
      name: "Image Url",
      match: /Image \d+ Url/,
      mapTo: "product.images.url",
    },
  ],
}
