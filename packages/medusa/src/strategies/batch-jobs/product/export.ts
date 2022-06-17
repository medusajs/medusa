import { EntityManager } from "typeorm"
import { AbstractBatchJobStrategy, IFileService } from "../../../interfaces"
import { Product, ProductVariant } from "../../../models"
import { BatchJobService, ProductService } from "../../../services"
import { BatchJobStatus } from "../../../types/batch-job"
import { defaultAdminProductRelations } from "../../../api/routes/admin/products"
import { ProductRepository } from "../../../repositories/product"
import { MedusaError } from "medusa-core-utils/dist"
import { AdminPostBatchesReq } from "../../../api/routes/admin/batch/create-batch-job"
import { prepareListQuery } from "../../../utils/get-query-config"
import {
  ProductExportColumnSchemaDescriptor,
  productExportSchemaDescriptors,
} from "./index"

type InjectedDependencies = {
  manager: EntityManager
  batchJobService: BatchJobService
  productService: ProductService
  fileService: IFileService<never>
  productRepository: typeof ProductRepository
}

export default class ProductExportStrategy extends AbstractBatchJobStrategy<ProductExportStrategy> {
  public static identifier = "product-export-strategy"
  public static batchType = "product-export"

  public defaultMaxRetry = 3

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly batchJobService_: BatchJobService
  protected readonly productService_: ProductService
  protected readonly fileService_: IFileService<never>
  protected readonly productRepository_: typeof ProductRepository

  protected readonly defaultRelations_ = [...defaultAdminProductRelations]
  /*
   *
   * The dynamic columns corresponding to the lowest level of relations are built later on.
   * You can have a look at the buildHeader method that take care of appending the other
   * column descriptors to this map.
   *
   */
  protected readonly columnDescriptors: Map<
    string,
    ProductExportColumnSchemaDescriptor
  > = productExportSchemaDescriptors

  private readonly NEWLINE_ = "\r\n"
  private readonly DELIMITER_ = ";"
  private readonly BATCH_SIZE = 50

  constructor({
    manager,
    batchJobService,
    productService,
    fileService,
    productRepository,
  }: InjectedDependencies) {
    super({
      manager,
      batchJobService,
      productService,
      fileService,
      productRepository,
    })

    this.manager_ = manager
    this.batchJobService_ = batchJobService
    this.productService_ = productService
    this.fileService_ = fileService
    this.productRepository_ = productRepository
  }

  async buildTemplate(): Promise<string> {
    return this.buildHeader()
  }

  async prepareBatchJobForProcessing(
    batchJob: AdminPostBatchesReq,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    req: Express.Request
  ): Promise<AdminPostBatchesReq> {
    const {
      limit,
      offset,
      order,
      fields,
      expand,
      filterable_fields,
      ...context
    } = batchJob.context

    const listConfig = prepareListQuery(
      {
        limit,
        offset,
        order,
        fields,
        expand,
      },
      {
        isList: true,
        defaultRelations: this.defaultRelations_,
      }
    )

    batchJob.context = {
      ...(context ?? {}),
      list_config: listConfig,
      filterable_fields,
    }

    return batchJob
  }

  async processJob(batchJobId: string): Promise<void> {
    let offset = 0
    let limit = this.BATCH_SIZE
    let advancementCount = 0
    let productCount = 0

    return await this.atomicPhase_(
      async (transactionManager) => {
        let batchJob = await this.batchJobService_
          .withTransaction(transactionManager)
          .retrieve(batchJobId)

        const {
          writeStream,
          url: key,
          promise,
        } = await this.fileService_.getUploadStreamDescriptor({
          name: "product-export",
          ext: "csv",
        })

        const header = await this.buildHeader()
        writeStream.write(header)

        offset = batchJob.context.list_config?.skip ?? offset
        limit = batchJob.context.list_config?.take ?? this.BATCH_SIZE
        advancementCount = batchJob.result.advancement_count ?? advancementCount

        const { list_config = {}, filterable_fields = {} } = batchJob.context
        const [productList, count] = await this.productService_
          .withTransaction(transactionManager)
          .listAndCount(filterable_fields, {
            ...list_config,
            skip: offset,
            take: limit,
          })

        productCount = count
        let products: Product[] = productList

        while (offset < productCount) {
          if (!products?.length) {
            products = await this.productService_
              .withTransaction(transactionManager)
              .list(filterable_fields, {
                ...list_config,
                skip: offset,
                take: limit,
              })
          }

          products.forEach((product: Product) => {
            const lines = this.buildProductVariantLines(product)
            lines.forEach((line) => writeStream.write(line))
          })

          advancementCount += products.length
          offset += products.length
          products.length = 0

          batchJob = await this.batchJobService_.update(batchJobId, {
            context: {
              ...batchJob.context,
              file_key: key,
              list_config: {
                ...list_config,
                skip: offset,
              },
            },
            result: {
              count: productCount,
              advancement_count: advancementCount,
              progress: advancementCount / productCount,
              err: undefined,
            },
          })

          if (batchJob.status === BatchJobStatus.CANCELED) {
            writeStream.end()

            await this.fileService_.delete({ key: key })
            return
          }
        }

        writeStream.end()

        return await promise
      },
      "REPEATABLE READ",
      async (err) =>
        this.handleProcessingErrors(batchJobId, err, {
          offset,
          count: productCount,
          advancementCount,
          progress: advancementCount / productCount,
        })
    )
  }

  private async buildHeader(): Promise<string> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const productRepo = transactionManager.getCustomRepository(
      this.productRepository_
    )

    const [{ maxOptionsCount, maxImagesCount, maxMoneyAmountCount }] =
      await productRepo.query(`
        WITH optionsShape AS (
            SELECT count(*) as maxOptionsCount
            from product_option
            group by product_id
            order by maxOptionsCount DESC
            LIMIT 1
        ), imagesShape AS (
            SELECT count(*) as maxImagesCount
            from product_images
            group by product_id
            order by maxImagesCount DESC
            LIMIT 1
        ), moneyAmountShape AS (
            SELECT count(*) as maxMoneyAmountCount
            from money_amount
            group by variant_id
            order by maxMoneyAmountCount DESC
            LIMIT 1
        )
        SELECT 
           maxOptionsCount,
           maxImagesCount,
           maxMoneyAmountCount
        FROM 
           optionsShape,
           imagesShape,
           moneyAmountShape;
      `)

    this.appendOptionsDescriptors(maxOptionsCount)
    this.appendMoneyAmountDescriptors(maxMoneyAmountCount)
    this.appendImagesDescriptors(maxImagesCount)

    return [...this.columnDescriptors.keys(), this.NEWLINE_].join(
      this.DELIMITER_
    )
  }

  private appendImagesDescriptors(maxImagesCount: number): void {
    for (let i = 0; i < maxImagesCount; ++i) {
      this.columnDescriptors.set(`Image ${i + 1} Url`, {
        accessor: (product: Product) => product?.images[i]?.url ?? "",
        entityName: "product",
      })
    }
  }

  private appendOptionsDescriptors(maxOptionsCount: number): void {
    for (let i = 0; i < maxOptionsCount; ++i) {
      this.columnDescriptors
        .set(`Option ${i + 1} Name`, {
          accessor: (productOption: Product) =>
            productOption?.options[i]?.title ?? "",
          entityName: "product",
        })
        .set(`Option ${i + 1} Value`, {
          accessor: (variant: ProductVariant) =>
            variant?.options[i]?.value ?? "",
          entityName: "variant",
        })
    }
  }

  private appendMoneyAmountDescriptors(maxMoneyAmountCount: number): void {
    for (let i = 0; i < maxMoneyAmountCount; ++i) {
      this.columnDescriptors
        .set(`Price ${i + 1} Currency code`, {
          accessor: (variant: ProductVariant) =>
            variant?.prices[i]?.currency_code?.toLowerCase() ?? "",
          entityName: "variant",
        })
        .set(`Price ${i + 1} Region name`, {
          accessor: (variant: ProductVariant) =>
            variant?.prices[i]?.region?.name?.toLowerCase() ?? "",
          entityName: "variant",
        })
        .set(`Price ${i + 1} Amount`, {
          accessor: (variant: ProductVariant) =>
            variant?.prices[i]?.amount?.toString() ?? "",
          entityName: "variant",
        })
    }
  }

  private buildProductVariantLines(product: Product): string[] {
    const outputLineData: string[] = []

    for (const variant of product.variants) {
      const variantLineData: string[] = []
      for (const [, columnSchema] of this.columnDescriptors.entries()) {
        if (columnSchema.entityName === "product") {
          variantLineData.push(columnSchema.accessor(product))
        }
        if (columnSchema.entityName === "variant") {
          variantLineData.push(columnSchema.accessor(variant))
        }
      }
      variantLineData.push(this.NEWLINE_)
      outputLineData.push(variantLineData.join(this.DELIMITER_))
    }

    return outputLineData
  }

  private async handleProcessingErrors(
    batchJobId: string,
    err: unknown,
    {
      offset,
      count,
      advancementCount,
      progress,
    }: {
      offset: number
      count: number
      advancementCount: number
      progress: number
    }
  ): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      const retryCount = batchJob.context.retry_count ?? 0
      const maxRetry = batchJob.context.max_retry ?? this.defaultMaxRetry

      if (err instanceof MedusaError) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .setFailed(batchJob)
      } else if (retryCount < maxRetry) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            context: {
              ...batchJob.context,
              retry_count: retryCount + 1,
              list_config: {
                ...batchJob.context.list_config,
                skip: offset,
              },
            },
            result: {
              ...batchJob.result,
              count,
              advancement_count: advancementCount,
              progress,
              err,
            },
          })
      } else {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .setFailed(batchJob)
      }
    })
  }
}
