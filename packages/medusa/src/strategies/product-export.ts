import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { AbstractBatchJobStrategy, IFileService } from "../interfaces"
import {
  BatchJob,
  Product,
  ProductVariant,
} from "../models"
import { BatchJobService, ProductService } from "../services"
import { BatchJobStatus } from "../types/batch-job"
import { defaultAdminProductRelations } from "../api/routes/admin/products"
import { ProductRepository } from "../repositories/product"
import { FindConfig } from "../types/common"
import { MedusaError } from "medusa-core-utils/dist"
import { transformQuery } from "../api/middlewares"
import { AdminPostBatchesReq } from "../api/routes/admin/batch/create-batch-job"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"

type Context = {
  listConfig: FindConfig<Product>
  filterableFields: Record<string, unknown>
  offset: number
}

type InjectedDependencies = {
  manager: EntityManager
  batchJobService: BatchJobService
  productService: ProductService
  fileService: IFileService<any>
  productRepository: typeof ProductRepository
}

type ColumnSchemaEntity = "product" | "variant"

type ColumnSchemaDescriptor =
  | {
      accessor: (product: Product) => string
      entityName: Extract<ColumnSchemaEntity, "product">
    }
  | {
      accessor: (variant: ProductVariant) => string
      entityName: Extract<ColumnSchemaEntity, "variant">
    }

export default class ProductExportStrategy extends AbstractBatchJobStrategy<ProductExportStrategy> {
  public static identifier = "product-export-strategy"
  public static batchType = "product-export"

  public defaultMaxRetry = 3

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly batchJobService_: BatchJobService
  protected readonly productService_: ProductService
  protected readonly fileService_: IFileService<any>
  protected readonly productRepository_: typeof ProductRepository

  protected readonly relations_ = [...defaultAdminProductRelations]
  protected readonly columnDescriptors = new Map<
    string,
    ColumnSchemaDescriptor
  >([
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
        accessor: (product: Product): string => product?.handle ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Title",
      {
        accessor: (product: Product): string => product?.title ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Subtitle",
      {
        accessor: (product: Product): string => product?.subtitle ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Description",
      {
        accessor: (product: Product): string => product?.description ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Status",
      {
        accessor: (product: Product): string => product?.status ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Thumbnail",
      {
        accessor: (product: Product): string => product?.thumbnail ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Weight",
      {
        accessor: (product: Product): string => product?.weight?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Length",
      {
        accessor: (product: Product): string => product?.length?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Width",
      {
        accessor: (product: Product): string => product?.width?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Height",
      {
        accessor: (product: Product): string => product?.height?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product HS Code",
      {
        accessor: (product: Product): string => product?.hs_code?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Origin Country",
      {
        accessor: (product: Product): string =>
          product?.origin_country?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Mid Code",
      {
        accessor: (product: Product): string => product?.mid_code?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Material",
      {
        accessor: (product: Product): string => product?.material?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Collection Title",
      {
        accessor: (product: Product): string => product?.collection?.title ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Collection Handle",
      {
        accessor: (product: Product): string => product?.collection?.handle ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Type",
      {
        accessor: (product: Product): string => product?.type?.value ?? "",
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
          product?.discountable?.toString() ?? "",
        entityName: "product",
      },
    ],
    [
      "Product External ID",
      {
        accessor: (product: Product): string => product?.external_id ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Profile Name",
      {
        accessor: (product: Product): string => product?.profile?.name ?? "",
        entityName: "product",
      },
    ],
    [
      "Product Profile Type",
      {
        accessor: (product: Product): string => product?.profile?.type ?? "",
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

  async prepareBatchJobForProcessing(
    batchJob: AdminPostBatchesReq,
    req: Request
  ): Promise<AdminPostBatchesReq> {
    const { limit, offset, order, fields, expand } = batchJob.context

    class ToValidate extends AdminPostBatchesReq {
      @IsNumber()
      @IsOptional()
      @Type(() => Number)
      offset?: number = 0

      @IsNumber()
      @IsOptional()
      @Type(() => Number)
      limit?: number = 50

      @IsString()
      @IsOptional()
      expand?: string

      @IsString()
      @IsOptional()
      fields?: string

      @IsString()
      @IsOptional()
      order?: string

      constructor() {
        super()
        this.limit = limit as number
        this.offset = offset  as number
        this.order = order as string
        this.fields = fields as string
        this.expand = expand as string
      }
    }

    await transformQuery(
      ToValidate,
      {
        defaultRelations: this.relations_,
        isList: true
      }
    )(req, {} as any, (err: unknown) => { throw err })
    const { listConfig, filterableFields } = req

    batchJob.context = {
      ...(batchJob.context ?? {}),
      listConfig,
      filterableFields
    }
    return batchJob
  }

  async processJob(batchJobId: string): Promise<void> {
    let offset = 0
    let advancementCount = 0
    let productCount = 0

    return await this.atomicPhase_(
      async (transactionManager) => {
        let batchJob = await this.batchJobService_
          .withTransaction(transactionManager)
          .retrieve(batchJobId)

        offset = batchJob.context.offset ?? offset
        advancementCount = batchJob.result.advancementCount ?? advancementCount

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

        const [productList, count] = await this.productService_
          .withTransaction(transactionManager)
          .listAndCount(filterableFields, {
            relations: this.relations_,
            ...(listConfig ?? {}),
            order: listConfig.order ?? { created_at: "DESC" },
            skip: offset ?? listConfig.skip,
          })

        productCount = count
        let products = productList

        while (advancementCount < productCount) {
          if (!products?.length) {
            products = await this.productService_
              .withTransaction(transactionManager)
              .list(filterableFields, {
                relations: this.relations_,
                order: { created_at: "DESC" },
                ...((listConfig as Record<string, unknown>) ?? {}),
                skip: offset,
                take: this.BATCH_SIZE,
              })
          }

          products.forEach((product: Product) => {
            const productLinesData = this.buildProductLines(product)
            productLinesData.forEach((line) => writeStream.write(line))
          })

          advancementCount += products.length
          offset += products.length
          products.length = 0

          batchJob = await this.batchJobService_.update(batchJobId, {
            context: {
              ...batchJob.context,
              fileKey: key,
              offset,
            },
            result: {
              count: productCount,
              advancementCount,
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

    return [...this.columnDescriptors.keys(), this.NEWLINE].join(
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
          accessor: (variant: ProductVariant) => variant?.options[i]?.value ?? "",
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
      productLineData.push("")
    }

    productLineData.push(this.NEWLINE)
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
        variantLineData.push("")
      }

      variantLineData.push(this.NEWLINE)
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
          .updateStatus(batchJob, BatchJobStatus.FAILED)
      } else if (retryCount < maxRetry) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            context: {
              ...batchJob.context,
              retry_count: retryCount + 1,
              offset,
            },
            result: {
              ...batchJob.result,
              count,
              advancementCount,
              progress,
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
