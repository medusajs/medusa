import { EntityManager } from "typeorm"
import { AbstractBatchJobStrategy, IFileService } from "../interfaces"
import { BatchJob, Product } from "../models"
import { BatchJobService, ProductService } from "../services"
import { BatchJobStatus } from "../types/batch-job"
import { defaultAdminProductRelations } from "../api/routes/admin/products"
import { ProductRepository } from "../repositories/product"
import { FindConfig } from "../types/common"
import { MedusaError } from "medusa-core-utils/dist"

type Context = {
  listConfig: FindConfig<Product>
  filterableFields: Record<string, unknown>
  offset: number
  count: number
  progress: number
}

type InjectedDependencies = {
  manager: EntityManager
  batchJobService: BatchJobService
  productService: ProductService
  fileService: IFileService<any>
  productRepository: typeof ProductRepository
}

type DataGetter = (line: Product) => string

export default class ProductExportStrategy extends AbstractBatchJobStrategy<ProductExportStrategy> {
  public static identifier = "product-export-strategy"
  public static batchType = "product-export"

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly batchJobService_: BatchJobService
  protected readonly productService_: ProductService
  protected readonly fileService_: IFileService<any>
  protected readonly productRepository_: typeof ProductRepository

  protected readonly relations_ = [...defaultAdminProductRelations]
  protected readonly columnDescriptors = new Map<string, DataGetter>([
    ["Product Handle", (line: Product): string => line.handle],
    ["Product Title", (line: Product): string => line.title],
    ["Product Subtitle", (line: Product): string => line.subtitle],
    ["Product Description", (line: Product): string => line.description],
    ["Product Status", (line: Product): string => line.status],
    ["Product Thumbnail", (line: Product): string => line.thumbnail],
    ["Product Weight", (line: Product): string => line.weight?.toString()],
    ["Product Length", (line: Product): string => line.length?.toString()],
    ["Product Width", (line: Product): string => line.width?.toString()],
    ["Product Height", (line: Product): string => line.height?.toString()],
    ["Product HS Code", (line: Product): string => line.hs_code?.toString()],
    [
      "Product Origin Country",
      (line: Product): string => line.origin_country?.toString(),
    ],
    ["Product Mid Code", (line: Product): string => line.mid_code?.toString()],
    ["Product Material", (line: Product): string => line.material?.toString()],
    [
      "Product Collection Title",
      (line: Product): string => line.collection.title,
    ],
    [
      "Product Collection Handle",
      (line: Product): string => line.collection.handle,
    ],
    ["Product Type", (line: Product): string => line.type.value],
    [
      "Product Tags",
      (line: Product): string =>
        (line.tags.map((t) => t.value) ?? []).join(","),
    ],
    [
      "Product Discountable",
      (line: Product): string => line.discountable?.toString(),
    ],
    ["Product External ID", (line: Product): string => line.external_id],
    ["Product Profile Name", (line: Product): string => line?.profile?.name],
    ["Product Profile Type", (line: Product): string => line?.profile?.type],
    /*
     *
     * The other columns are dynamically computed via the `buildHeader` method.
     * This will ensure that all the expected columns based on the
     * real data and therefore the highest number of value for the different
     * relation that we are expecting to appear
     *
     */
  ])

  private readonly NEWLINE = "\r\n"
  private readonly DELIMITED_ = ";"
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

  async completeJob(batchJobId: string): Promise<BatchJob> {
    return await this.atomicPhase_(async (transactionManager) => {
      const batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      if (batchJob.status === BatchJobStatus.COMPLETED) {
        return batchJob
      }

      return await this.batchJobService_.complete(batchJob)
    })
  }

  async prepareBatchJobForProcessing(
    batchJobId: string,
    req: Express.Request
  ): Promise<BatchJob> {
    return await this.atomicPhase_(async (transactionManager) => {
      return await this.batchJobService_
        .withTransaction(transactionManager)
        .ready(batchJobId /* batchJob after the above todo */)
    })
  }

  async processJob(batchJobId: string): Promise<BatchJob> {
    return await this.atomicPhase_(
      async (transactionManager) => {
        const batchJob = await this.batchJobService_
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

        const { listConfig, filterableFields } = batchJob.context as Context

        const productCount: number = await this.productService_
          .withTransaction(transactionManager)
          .count(filterableFields)

        let advancementCount = 0
        let offset = 0

        while (advancementCount < productCount) {
          const [products, count] = await this.productService_
            .withTransaction(transactionManager)
            .listAndCount(filterableFields, {
              relations: this.relations_,
              ...((listConfig as Record<string, unknown>) ?? {}),
              skip: offset,
              take: this.BATCH_SIZE,
              order: { created_at: "DESC" },
            })

          advancementCount += count
          offset += count

          products.forEach((product) => {
            writeStream.write(this.buildLine(product))
          })

          batchJob.context = {
            ...batchJob.context,
            offset,
            count: productCount,
            progress: advancementCount / productCount,
          }
          const batch = await this.batchJobService_.update(batchJobId, {
            context: batchJob.context,
          })

          if (batch.status === BatchJobStatus.CANCELED) {
            writeStream.end()

            await this.fileService_.delete({ key: key })

            return batchJob
          }
        }

        writeStream.end()

        await promise

        batchJob.context.fileKey = key

        const updatedBatchJob = await this.batchJobService_.update(batchJobId, {
          context: batchJob.context,
        })

        return await this.batchJobService_.complete(updatedBatchJob)
      },
      "READ UNCOMMITTED",
      async (err) => this.handleProcessingErrors(batchJobId, err)
    )
  }

  async validateContext(context: Context): Promise<Record<string, unknown>> {
    // TODO: waiting for #1593
    /*
      const batchJob = this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      const { listConfig, filterableFields } = transformQuery({ defaultRelations: relations_ ,isList: true})(req, {} as any, (err) => throw err)
      const context = {
        ...(batchJob.context ?? {}),
        listConfig,
        filterableFields
      }
    */
    return context
  }

  validateFile(fileLocation: string): Promise<boolean> {
    throw new Error("Method not implemented")
  }

  private async buildHeader(): Promise<string> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const productRepo = transactionManager.getCustomRepository(
      this.productRepository_
    )

    const [
      {
        maxOptionsCount,
        maxImagesCount,
        maxVariantsCount,
        maxMoneyAmountCount,
      },
    ] = await productRepo.query(`
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
        ), variantsShape AS (
            SELECT count(*) as maxVariantsCount
            from product_variant
            group by product_id
            order by maxVariantsCount DESC
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
           maxVariantsCount,
           maxMoneyAmountCount
        FROM 
           optionsShape,
           imagesShape,
           variantsShape,
           moneyAmountShape;
      `)

    this.appendProductOptionsDescriptors(maxOptionsCount)
    this.appendImagesDescriptors(maxImagesCount)
    this.appendVariantDescriptors(maxVariantsCount, maxMoneyAmountCount)

    return [...this.columnDescriptors.keys(), this.NEWLINE].join(
      this.DELIMITED_
    )
  }

  private appendVariantDescriptors(
    maxVariantsCount: number,
    maxMoneyAmountCount: number
  ): void {
    for (let i = 0; i < maxVariantsCount; ++i) {
      this.columnDescriptors
        .set(
          `Variant Title [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.title ?? ""
        )
        .set(
          `Variant SKU [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.sku ?? ""
        )
        .set(
          `Variant Barcode [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.barcode ?? ""
        )
        .set(
          `Variant Inventory Quantity [${i + 1}-${maxVariantsCount}]`,
          (line: Product) =>
            line.variants[i]?.inventory_quantity?.toString() ?? ""
        )
        .set(
          `Variant Allow backorder [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.allow_backorder?.toString()
        )
        .set(
          `Variant Manage inventory [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.manage_inventory?.toString()
        )
        .set(
          `Variant Option Value [${i + 1}-${maxVariantsCount}]`,
          (line: Product) =>
            line.variants[i]?.options?.map((o) => o.value)?.toString()
        )
        .set(`Variant Weight [${i + 1}-${maxVariantsCount}]`, (line: Product) =>
          line.variants[i]?.weight?.toString()
        )
        .set(`Variant Length [${i + 1}-${maxVariantsCount}]`, (line: Product) =>
          line.variants[i]?.length?.toString()
        )
        .set(`Variant Width [${i + 1}-${maxVariantsCount}]`, (line: Product) =>
          line.variants[i]?.width?.toString()
        )
        .set(`Variant Height [${i + 1}-${maxVariantsCount}]`, (line: Product) =>
          line.variants[i]?.height?.toString()
        )
        .set(
          `Variant HS Code [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.hs_code?.toString()
        )
        .set(
          `Variant Origin Country [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.origin_country?.toString()
        )
        .set(
          `Variant Mid Code [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.mid_code?.toString()
        )
        .set(
          `Variant Material [${i + 1}-${maxVariantsCount}]`,
          (line: Product) => line.variants[i]?.material?.toString()
        )

      for (let y = 0; y < maxMoneyAmountCount; ++y) {
        this.columnDescriptors
          .set(
            `Variant Price Currency Code [${y + 1}-${maxMoneyAmountCount}] [${
              i + 1
            }-${maxVariantsCount}]`,
            (line: Product) => {
              return line.variants[i]?.prices[y]?.currency_code?.toUpperCase()
            }
          )
          .set(
            `Variant Price Region Name [${y + 1}-${maxMoneyAmountCount}] [${
              i + 1
            }-${maxVariantsCount}]`,
            (line: Product) => {
              return line.variants[i]?.prices[y]?.region?.name
            }
          )
          .set(
            `Variant Price [${y + 1}-${maxMoneyAmountCount}] [${
              i + 1
            }-${maxVariantsCount}]`,
            (line: Product) => {
              return line.variants[i]?.prices[y]?.amount?.toString()
            }
          )
      }
    }
  }

  private appendImagesDescriptors(maxImagesCount: number): void {
    for (let i = 0; i < maxImagesCount; ++i) {
      this.columnDescriptors.set(
        `Product Image [${i + 1}-${maxImagesCount}]`,
        (line: Product) => line.images[i]?.url ?? ""
      )
    }
  }

  private appendProductOptionsDescriptors(maxOptionsCount: number): void {
    for (let i = 0; i < maxOptionsCount; ++i) {
      this.columnDescriptors
        .set(
          `Product Option Name [${i + 1}-${maxOptionsCount}]`,
          (line: Product) => line.options[i]?.title ?? ""
        )
        .set(
          `Product Option values [${i + 1}-${maxOptionsCount}]`,
          (line: Product) => line.options[i]?.values?.toString()
        )
    }
  }

  private buildLine(line: Product): string {
    const outputLineData: string[] = []
    for (const [, getter] of this.columnDescriptors.entries()) {
      outputLineData.push(getter(line))
    }
    outputLineData.push(this.NEWLINE)
    return outputLineData.join(this.DELIMITED_)
  }

  private async handleProcessingErrors(
    batchJobId: string,
    err: MedusaError | unknown
  ): Promise<void> {
    // Before validating that we should settle on defining if the job can be re process or not.
    /* return await this.atomicPhase_(async (transactionManager) => {
      const batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      if (err instanceof MedusaError) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .updateStatus(batchJob, BatchJobStatus.FAILED)
      } else {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            context: {
              ...batchJob.context,
              retry_count: (Number(batchJob.context.retry_count) ?? 0) + 1,
            },
            result: {
              ...batchJob.result,
              err,
            },
          })
      }
    })*/
  }
}
