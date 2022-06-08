import { EntityManager } from "typeorm"
import { AbstractBatchJobStrategy, IFileService } from "../interfaces"
import {
  BatchJob,
  Image,
  MoneyAmount,
  Product,
  ProductOption,
  ProductVariant,
} from "../models"
import { BatchJobService, ProductService } from "../services"
import { BatchJobStatus } from "../types/batch-job"
import { defaultAdminProductRelations } from "../api/routes/admin/products"
import { ProductRepository } from "../repositories/product"
import { FindConfig } from "../types/common"
import { MedusaError } from "medusa-core-utils/dist"
import { ProductVariantOption } from "../types/product-variant"

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

type ColumnSchemaEntity =
  | "product"
  | "variant"
  | "option"
  | "variantOption"
  | "image"
  | "moneyAmount"

type ColumnSchema =
  | (
      | {
          accessor: (product: Product) => string
          entityName: Extract<ColumnSchemaEntity, "product">
        }
      | {
          accessor: (variant: ProductVariant) => string
          entityName: Extract<ColumnSchemaEntity, "variant">
        }
      | {
          accessor: (option: ProductOption) => string
          entityName: Extract<ColumnSchemaEntity, "option">
        }
      | {
          accessor: (option: ProductVariantOption) => string
          entityName: Extract<ColumnSchemaEntity, "variantOption">
        }
      | {
          accessor: (image: Image) => string
          entityName: Extract<ColumnSchemaEntity, "image">
        }
      | {
          accessor: (moneyAmount: MoneyAmount) => string
          entityName: Extract<ColumnSchemaEntity, "moneyAmount">
        }
    ) & { index?: number }

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
  protected readonly columnDescriptors = new Map<string, ColumnSchema>([
    /*
     *
     * The dynamic columns corresponding to the lowest level of relations are built later on.
     * You can have a look at the buildHeader method that take care of appending the other
     * column descriptors to this map.
     *
     */
    [
      "Product Handle",
      {
        accessor: (product: Product): string => product?.handle,
        entityName: "product",
      },
    ],
    [
      "Product Title",
      {
        accessor: (product: Product): string => product?.title,
        entityName: "product",
      },
    ],
    [
      "Product Subtitle",
      {
        accessor: (product: Product): string => product?.subtitle,
        entityName: "product",
      },
    ],
    [
      "Product Description",
      {
        accessor: (product: Product): string => product?.description,
        entityName: "product",
      },
    ],
    [
      "Product Status",
      {
        accessor: (product: Product): string => product?.status,
        entityName: "product",
      },
    ],
    [
      "Product Thumbnail",
      {
        accessor: (product: Product): string => product?.thumbnail,
        entityName: "product",
      },
    ],
    [
      "Product Weight",
      {
        accessor: (product: Product): string => product?.weight?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product Length",
      {
        accessor: (product: Product): string => product?.length?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product Width",
      {
        accessor: (product: Product): string => product?.width?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product Height",
      {
        accessor: (product: Product): string => product?.height?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product HS Code",
      {
        accessor: (product: Product): string => product?.hs_code?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product Origin Country",
      {
        accessor: (product: Product): string =>
          product?.origin_country?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product Mid Code",
      {
        accessor: (product: Product): string => product?.mid_code?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product Material",
      {
        accessor: (product: Product): string => product?.material?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product Collection Title",
      {
        accessor: (product: Product): string => product?.collection?.title,
        entityName: "product",
      },
    ],
    [
      "Product Collection Handle",
      {
        accessor: (product: Product): string => product?.collection?.handle,
        entityName: "product",
      },
    ],
    [
      "Product Type",
      {
        accessor: (product: Product): string => product?.type?.value,
        entityName: "product",
      },
    ],
    [
      "Product Tags",
      {
        accessor: (product: Product): string =>
          (product.tags.map((t) => t.value) ?? []).join(","),
        entityName: "product",
      },
    ],
    [
      "Product Discountable",
      {
        accessor: (product: Product): string =>
          product?.discountable?.toString(),
        entityName: "product",
      },
    ],
    [
      "Product External ID",
      {
        accessor: (product: Product): string => product?.external_id,
        entityName: "product",
      },
    ],
    [
      "Product Profile Name",
      {
        accessor: (product: Product): string => product?.profile?.name,
        entityName: "product",
      },
    ],
    [
      "Product Profile Type",
      {
        accessor: (product: Product): string => product?.profile?.type,
        entityName: "product",
      },
    ],
    [
      "Variant Title",
      {
        accessor: (variant: ProductVariant): string => variant?.title ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant SKU",
      {
        accessor: (variant: ProductVariant): string => variant?.sku ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Barcode",
      {
        accessor: (variant: ProductVariant): string => variant?.barcode ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Inventory Quantity",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.inventory_quantity?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Allow backorder",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.allow_backorder?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Manage inventory",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.manage_inventory?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Weight",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.weight?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Length",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.length?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Width",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.width?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Height",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.height?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant HS Code",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.hs_code?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Origin Country",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.origin_country?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Mid Code",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.mid_code?.toString() ?? "",
        entityName: "variant",
      },
    ],
    [
      "Variant Material",
      {
        accessor: (variant: ProductVariant): string =>
          variant?.material?.toString() ?? "",
        entityName: "variant",
      },
    ],
  ])

  private readonly NEWLINE = "\r\n"
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
    let offset = 0
    let advancementCount = 0
    let productCount = 0

    return await this.atomicPhase_(
      async (transactionManager) => {
        let batchJob = await this.batchJobService_
          .withTransaction(transactionManager)
          .retrieve(batchJobId)

        offset = batchJob.context.offset ?? offset
        advancementCount = batchJob.context.count ?? advancementCount

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

        const productsAndCount = await this.productService_
          .withTransaction(transactionManager)
          .listAndCount(filterableFields, {
            relations: this.relations_,
            ...(listConfig ?? {}),
          })
        productCount = productsAndCount[1]

        let products = productsAndCount[0]

        while (advancementCount < productCount) {
          if (advancementCount === 0) {
            products = await this.productService_
              .withTransaction(transactionManager)
              .list(filterableFields, {
                relations: this.relations_,
                ...((listConfig as Record<string, unknown>) ?? {}),
                skip: offset,
                take: this.BATCH_SIZE,
                order: { created_at: "DESC" },
              })
          }

          products.forEach((product) => {
            const productLinesData = this.buildProductLines(product)
            productLinesData.forEach((line) => writeStream.write(line))
          })

          advancementCount += products.length
          offset += products.length
          batchJob = await this.batchJobService_.update(batchJobId, {
            context: {
              ...batchJob.context,
              fileKey: key,
              offset,
              count: productCount,
              progress: advancementCount / productCount,
            },
            result: {
              err: undefined,
            },
          })

          if (batchJob.status === BatchJobStatus.CANCELED) {
            writeStream.end()

            await this.fileService_.delete({ key: key })

            return batchJob
          }
        }

        writeStream.end()

        await promise
        return await this.batchJobService_.complete(batchJob)
      },
      "REPEATABLE READ",
      async (err) =>
        this.handleProcessingErrors(batchJobId, err, {
          offset,
          count: productCount,
          progress: advancementCount / productCount,
        })
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

    return [...this.columnDescriptors.keys(), this.NEWLINE].join(
      this.DELIMITER_
    )
  }

  private appendImagesDescriptors(maxImagesCount: number): void {
    for (let i = 0; i < maxImagesCount; ++i) {
      this.columnDescriptors.set(`Product Image ${i + 1}`, {
        accessor: (image: Image) => image?.url ?? "",
        entityName: "image",
        index: i,
      })
    }
  }

  private appendOptionsDescriptors(maxOptionsCount: number): void {
    for (let i = 0; i < maxOptionsCount; ++i) {
      this.columnDescriptors
        .set(`Option ${i + 1} Name`, {
          accessor: (productOption: ProductOption) =>
            productOption?.title ?? "",
          entityName: "option",
          index: i,
        })
        .set(`Option ${i + 1} Value`, {
          accessor: (variantOption: ProductVariantOption) =>
            variantOption?.value,
          entityName: "variantOption",
          index: i,
        })
    }
  }

  private appendMoneyAmountDescriptors(maxMoneyAmountCount: number): void {
    for (let i = 0; i < maxMoneyAmountCount; ++i) {
      this.columnDescriptors
        .set(`Price ${i + 1} Currency code`, {
          accessor: (moneyAmount: MoneyAmount) =>
            moneyAmount?.currency_code?.toLowerCase() ?? "",
          entityName: "moneyAmount",
          index: i,
        })
        .set(`Price ${i + 1} Region name`, {
          accessor: (moneyAmount: MoneyAmount) =>
            moneyAmount?.region?.name?.toLowerCase() ?? "",
          entityName: "moneyAmount",
          index: i,
        })
        .set(`Price ${i + 1} Amount`, {
          accessor: (moneyAmount: MoneyAmount) =>
            moneyAmount?.amount?.toString() ?? "",
          entityName: "moneyAmount",
          index: i,
        })
    }
  }

  private buildProductLines(product: Product): string[] {
    const outputLineData: string[] = []

    const productLine = this.buildProductLineData(product)
    outputLineData.push(productLine)

    const variantLines = this.buildProductVariantsLineData(
      product,
      product.variants
    )
    outputLineData.push(...variantLines)

    return outputLineData
  }

  private buildProductLineData(product: Product): string {
    const productLineData: string[] = []
    for (const [, columnSchema] of this.columnDescriptors.entries()) {
      if (columnSchema.entityName === "product") {
        productLineData.push(columnSchema.accessor(product))
        continue
      }
      if (
        columnSchema.entityName === "option" &&
        columnSchema.index !== undefined
      ) {
        const option = product?.options[columnSchema.index] ?? {}
        productLineData.push(columnSchema.accessor(option))
        continue
      }
      if (
        columnSchema.entityName === "image" &&
        columnSchema.index !== undefined
      ) {
        const image = product?.images[columnSchema.index] ?? {}
        productLineData.push(columnSchema.accessor(image))
        continue
      }
      productLineData.push("")
    }
    return productLineData.join(this.DELIMITER_)
  }

  private buildProductVariantsLineData(
    product: Product,
    variants: ProductVariant[] = []
  ): string[] {
    const outputLineData: string[] = []

    for (const variant of variants) {
      const variantLineData: string[] = []

      for (const [
        columnTitle,
        columnSchema,
      ] of this.columnDescriptors.entries()) {
        if (
          columnTitle === "Product Handle" &&
          columnSchema.entityName === "product"
        ) {
          variantLineData.push(columnSchema.accessor(product))
          continue
        }

        if (columnSchema.entityName === "variant") {
          variantLineData.push(columnSchema.accessor(variant))
          continue
        }
        if (
          columnSchema.entityName === "variantOption" &&
          columnSchema.index !== undefined
        ) {
          const option = variant?.options[columnSchema.index] ?? {}
          variantLineData.push(columnSchema.accessor(option))
          continue
        }
        if (
          columnSchema.entityName === "moneyAmount" &&
          columnSchema.index !== undefined
        ) {
          const moneyAmount = variant?.prices[columnSchema.index] ?? {}
          variantLineData.push(columnSchema.accessor(moneyAmount))
          continue
        }
        variantLineData.push("")
      }

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
      progress,
    }: { offset: number; count: number; progress: number }
  ): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)

      const retryCount = batchJob.context.retry_count ?? 0
      const maxRetry = batchJob.context.max_retry ?? 0

      if (err instanceof MedusaError) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .updateStatus(batchJob, BatchJobStatus.FAILED)
      } else if (retryCount < maxRetry) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            context: {
              ...batchJob.context,
              offset,
              count,
              progress,
              retry_count: retryCount + 1,
            },
            result: {
              ...batchJob.result,
              err,
            },
          })
      } else {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .updateStatus(batchJob, BatchJobStatus.FAILED)
      }
    })
  }
}
