import { EntityManager } from "typeorm"
import { AbstractBatchJobStrategy, IFileService } from "../../../interfaces"
import { Product, ProductVariant } from "../../../models"
import { BatchJobService, ProductService } from "../../../services"
import { BatchJobStatus, CreateBatchJobInput } from "../../../types/batch-job"
import { defaultAdminProductRelations } from "../../../api"
import { prepareListQuery } from "../../../utils/get-query-config"
import {
  DynamicProductExportDescriptor,
  ProductExportBatchJob,
  ProductExportBatchJobContext,
  ProductExportInjectedDependencies,
  ProductExportPriceData,
} from "./types"
import { FindProductConfig } from "../../../types/product"
import { FlagRouter } from "../../../utils/flag-router"
import SalesChannelFeatureFlag from "../../../loaders/feature-flags/sales-channels"
import { csvCellContentFormatter } from "../../../utils"
import {
  productColumnsDefinition,
  productSalesChannelColumnsDefinition,
} from "./types/columns-definition"

export default class ProductExportStrategy extends AbstractBatchJobStrategy {
  public static identifier = "product-export-strategy"
  public static batchType = "product-export"

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly batchJobService_: BatchJobService
  protected readonly productService_: ProductService
  protected readonly fileService_: IFileService
  protected readonly featureFlagRouter_: FlagRouter

  protected readonly defaultRelations_ = [
    ...defaultAdminProductRelations,
    "variants.prices.region",
  ]
  /*
   *
   * The dynamic columns corresponding to the lowest level of relations are built later on.
   * You can have a look at the buildHeader method that take care of appending the other
   * column descriptors to this map.
   *
   */
  protected readonly columnsDefinition = { ...productColumnsDefinition }
  protected readonly salesChannelsColumnsDefinition = {
    ...productSalesChannelColumnsDefinition,
  }

  private readonly NEWLINE_ = "\r\n"
  private readonly DELIMITER_ = ";"
  private readonly DEFAULT_LIMIT = 50

  constructor({
    manager,
    batchJobService,
    productService,
    fileService,
    featureFlagRouter,
  }: ProductExportInjectedDependencies) {
    super({
      manager,
      batchJobService,
      productService,
      fileService,
      featureFlagRouter,
    })

    this.manager_ = manager
    this.batchJobService_ = batchJobService
    this.productService_ = productService
    this.fileService_ = fileService
    this.featureFlagRouter_ = featureFlagRouter

    if (featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
      this.defaultRelations_.push("sales_channels")
    }
  }

  async buildTemplate(): Promise<string> {
    return ""
  }

  async prepareBatchJobForProcessing(
    batchJob: CreateBatchJobInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    req: Express.Request
  ): Promise<CreateBatchJobInput> {
    const {
      limit,
      offset,
      order,
      fields,
      expand,
      filterable_fields,
      ...context
    } = (batchJob?.context ?? {}) as ProductExportBatchJobContext

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

  async preProcessBatchJob(batchJobId: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const batchJob = (await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)) as ProductExportBatchJob

      let offset = batchJob.context?.list_config?.skip ?? 0
      const limit = batchJob.context?.list_config?.take ?? this.DEFAULT_LIMIT

      const { list_config = {}, filterable_fields = {} } = batchJob.context
      const [productList, count] = await this.productService_
        .withTransaction(transactionManager)
        .listAndCount(filterable_fields, {
          ...(list_config ?? {}),
          take: Math.min(batchJob.context.batch_size ?? Infinity, limit),
        } as FindProductConfig)

      const productCount = batchJob.context?.batch_size ?? count
      let products: Product[] = productList

      let dynamicOptionColumnCount = 0
      let dynamicImageColumnCount = 0
      let dynamicSalesChannelsColumnCount = 0
      let pricesData = new Set<string>()

      while (offset < productCount) {
        if (!products?.length) {
          products = await this.productService_
            .withTransaction(transactionManager)
            .list(filterable_fields, {
              ...list_config,
              skip: offset,
              take: Math.min(productCount - offset, limit),
            } as FindProductConfig)
        }

        const shapeData = this.getProductRelationsDynamicColumnsShape(products)
        dynamicImageColumnCount = Math.max(
          shapeData.imageColumnCount,
          dynamicImageColumnCount
        )
        dynamicOptionColumnCount = Math.max(
          shapeData.optionColumnCount,
          dynamicOptionColumnCount
        )
        dynamicSalesChannelsColumnCount = Math.max(
          shapeData.salesChannelsColumnCount,
          dynamicSalesChannelsColumnCount
        )
        pricesData = new Set([...pricesData, ...shapeData.pricesData])

        offset += products.length
        products = []
      }

      await this.batchJobService_
        .withTransaction(transactionManager)
        .update(batchJob, {
          context: {
            shape: {
              dynamicImageColumnCount,
              dynamicOptionColumnCount,
              dynamicSalesChannelsColumnCount,
              prices: [...pricesData].map((stringifyData) =>
                JSON.parse(stringifyData)
              ),
            },
          },
          result: {
            stat_descriptors: [
              {
                key: "product-export-count",
                name: "Product count to export",
                message: `There will be ${productCount} products exported by this action`,
              },
            ],
          },
        })
    })
  }

  async processJob(batchJobId: string): Promise<void> {
    let offset = 0
    let limit = this.DEFAULT_LIMIT
    let advancementCount = 0
    let productCount = 0
    let approximateFileSize = 0

    return await this.atomicPhase_(
      async (transactionManager) => {
        const productServiceTx =
          this.productService_.withTransaction(transactionManager)
        const batchJobServiceTx =
          this.batchJobService_.withTransaction(transactionManager)
        const fileServiceTx =
          this.fileService_.withTransaction(transactionManager)

        let batchJob = (await batchJobServiceTx.retrieve(
          batchJobId
        )) as ProductExportBatchJob

        const { writeStream, fileKey, promise } =
          await fileServiceTx.getUploadStreamDescriptor({
            name: `exports/products/product-export-${Date.now()}`,
            ext: "csv",
          })

        const header = await this.buildHeader(batchJob)
        writeStream.write(header)
        approximateFileSize += Buffer.from(header).byteLength

        await batchJobServiceTx.update(batchJobId, {
          result: {
            file_key: fileKey,
            file_size: approximateFileSize,
          },
        })

        advancementCount =
          batchJob.result?.advancement_count ?? advancementCount
        offset = (batchJob.context?.list_config?.skip ?? 0) + advancementCount
        limit = batchJob.context?.list_config?.take ?? limit

        const { list_config = {}, filterable_fields = {} } = batchJob.context
        const [productList, count] = await productServiceTx.listAndCount(
          filterable_fields,
          {
            ...list_config,
            skip: offset,
            take: Math.min(batchJob.context.batch_size ?? Infinity, limit),
          } as FindProductConfig
        )

        productCount = batchJob.context?.batch_size ?? count
        let products: Product[] = productList

        while (offset < productCount) {
          if (!products?.length) {
            products = await productServiceTx.list(filterable_fields, {
              ...list_config,
              skip: offset,
              take: Math.min(productCount - offset, limit),
            } as FindProductConfig)
          }

          products.forEach((product: Product) => {
            const lines = this.buildProductVariantLines(product)
            lines.forEach((line) => {
              approximateFileSize += Buffer.from(line).byteLength
              writeStream.write(line)
            })
          })

          advancementCount += products.length
          offset += products.length
          products = []

          batchJob = (await batchJobServiceTx.update(batchJobId, {
            result: {
              file_size: approximateFileSize,
              count: productCount,
              advancement_count: advancementCount,
              progress: advancementCount / productCount,
            },
          })) as ProductExportBatchJob

          if (batchJob.status === BatchJobStatus.CANCELED) {
            writeStream.end()
            await this.onProcessCanceled(batchJobId, fileKey)
            return
          }
        }

        writeStream.end()

        return await promise
      },
      "REPEATABLE READ",
      async (err) =>
        this.handleProcessingError(batchJobId, err, {
          count: productCount,
          advancement_count: advancementCount,
          progress: advancementCount / productCount,
        })
    )
  }

  public async buildHeader(batchJob: ProductExportBatchJob): Promise<string> {
    const {
      prices = [],
      dynamicImageColumnCount,
      dynamicOptionColumnCount,
      dynamicSalesChannelsColumnCount,
    } = batchJob?.context?.shape ?? {}

    this.appendMoneyAmountDescriptors(prices)
    this.appendOptionsDescriptors(dynamicOptionColumnCount)
    this.appendImagesDescriptors(dynamicImageColumnCount)
    this.appendSalesChannelsDescriptors(dynamicSalesChannelsColumnCount)

    const exportedColumns = Object.values(this.columnsDefinition)
      .map(
        (descriptor) =>
          descriptor.exportDescriptor &&
          !("isDynamic" in descriptor.exportDescriptor) &&
          descriptor.name
      )
      .filter((name): name is string => !!name)

    return exportedColumns.join(this.DELIMITER_) + this.NEWLINE_
  }

  private appendImagesDescriptors(maxImagesCount: number): void {
    const columnNameBuilder = (this.columnsDefinition["Image Url"]!
      .exportDescriptor as DynamicProductExportDescriptor)!
      .buildDynamicColumnName

    for (let i = 0; i < maxImagesCount; ++i) {
      const columnName = columnNameBuilder(i)

      this.columnsDefinition[columnName] = {
        name: columnName,
        exportDescriptor: {
          accessor: (product: Product) => product?.images[i]?.url ?? "",
          entityName: "product",
        },
      }
    }
  }

  private appendSalesChannelsDescriptors(maxScCount: number): void {
    const columnNameIdBuilder = (this.salesChannelsColumnsDefinition[
      "Sales Channel Id"
    ]!.exportDescriptor as DynamicProductExportDescriptor)!
      .buildDynamicColumnName

    const columnNameNameBuilder = (this.salesChannelsColumnsDefinition[
      "Sales Channel Name"
    ]!.exportDescriptor as DynamicProductExportDescriptor)!
      .buildDynamicColumnName

    const columnNameDescriptionBuilder = (this.salesChannelsColumnsDefinition[
      "Sales Channel Description"
    ]!.exportDescriptor as DynamicProductExportDescriptor)!
      .buildDynamicColumnName

    for (let i = 0; i < maxScCount; ++i) {
      const columnNameId = columnNameIdBuilder(i)

      this.columnsDefinition[columnNameId] = {
        name: columnNameId,
        exportDescriptor: {
          accessor: (product: Product) =>
            product?.sales_channels[i]?.name ?? "",
          entityName: "product",
        },
      }

      const columnNameName = columnNameNameBuilder(i)

      this.columnsDefinition[columnNameName] = {
        name: columnNameName,
        exportDescriptor: {
          accessor: (product: Product) =>
            product?.sales_channels[i]?.name ?? "",
          entityName: "product",
        },
      }

      const columnNameDescription = columnNameDescriptionBuilder(i)

      this.columnsDefinition[columnNameDescription] = {
        name: columnNameDescription,
        exportDescriptor: {
          accessor: (product: Product) =>
            product?.sales_channels[i]?.description ?? "",
          entityName: "product",
        },
      }
    }
  }

  private appendOptionsDescriptors(maxOptionsCount: number): void {
    for (let i = 0; i < maxOptionsCount; ++i) {
      const columnNameNameBuilder = (this.columnsDefinition["Option Name"]!
        .exportDescriptor as DynamicProductExportDescriptor)!
        .buildDynamicColumnName

      const columnNameName = columnNameNameBuilder(i)

      this.columnsDefinition[columnNameName] = {
        name: columnNameName,
        exportDescriptor: {
          accessor: (productOption: Product) =>
            productOption?.options[i]?.title ?? "",
          entityName: "product",
        },
      }

      const columnNameValueBuilder = (this.columnsDefinition["Option Value"]!
        .exportDescriptor as DynamicProductExportDescriptor)!
        .buildDynamicColumnName

      const columnNameNameValue = columnNameValueBuilder(i)

      this.columnsDefinition[columnNameNameValue] = {
        name: columnNameNameValue,
        exportDescriptor: {
          accessor: (variant: ProductVariant) =>
            variant?.options[i]?.value ?? "",
          entityName: "variant",
        },
      }
    }
  }

  private appendMoneyAmountDescriptors(
    pricesData: ProductExportPriceData[]
  ): void {
    const columnNameBuilder = (this.columnsDefinition["Price Currency"]!
      .exportDescriptor as DynamicProductExportDescriptor)!
      .buildDynamicColumnName

    for (const priceData of pricesData) {
      if (priceData.currency_code) {
        const columnName = columnNameBuilder(priceData)

        this.columnsDefinition[columnName] = {
          name: columnName,
          exportDescriptor: {
            accessor: (variant: ProductVariant) => {
              const price = variant.prices.find((variantPrice) => {
                return (
                  variantPrice.currency_code &&
                  priceData.currency_code &&
                  variantPrice.currency_code.toLowerCase() ===
                    priceData.currency_code.toLowerCase()
                )
              })
              return price?.amount?.toString() ?? ""
            },
            entityName: "variant",
          },
        }
      }

      if (priceData.region) {
        const columnNameBuilder = (this.columnsDefinition["Price Region"]!
          .exportDescriptor as DynamicProductExportDescriptor)!
          .buildDynamicColumnName
        const columnName = columnNameBuilder(priceData)

        this.columnsDefinition[columnName] = {
          name: columnName,
          exportDescriptor: {
            accessor: (variant: ProductVariant) => {
              const price = variant.prices.find((variantPrice) => {
                return (
                  variantPrice.region &&
                  priceData.region &&
                  variantPrice.region?.name?.toLowerCase() ===
                    priceData.region?.name?.toLowerCase() &&
                  variantPrice.region?.id?.toLowerCase() ===
                    priceData.region?.id?.toLowerCase()
                )
              })
              return price?.amount?.toString() ?? ""
            },
            entityName: "variant",
          },
        }
      }
    }
  }

  private buildProductVariantLines(product: Product): string[] {
    const outputLineData: string[] = []

    for (const variant of product.variants) {
      const variantLineData: string[] = []
      for (const [, { exportDescriptor: columnSchema }] of Object.entries(
        this.columnsDefinition
      )) {
        if (!columnSchema || "isDynamic" in columnSchema) {
          continue
        }

        if (columnSchema.entityName === "product") {
          const formattedContent = csvCellContentFormatter(
            columnSchema.accessor(product)
          )
          variantLineData.push(formattedContent)
        }
        if (columnSchema.entityName === "variant") {
          const formattedContent = csvCellContentFormatter(
            columnSchema.accessor(variant)
          )
          variantLineData.push(formattedContent)
        }
      }
      outputLineData.push(variantLineData.join(this.DELIMITER_) + this.NEWLINE_)
    }

    return outputLineData
  }

  private async onProcessCanceled(
    batchJobId: string,
    fileKey: string
  ): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    await this.fileService_
      .withTransaction(transactionManager)
      .delete({ fileKey })
    await this.batchJobService_
      .withTransaction(transactionManager)
      .update(batchJobId, {
        result: {
          file_key: undefined,
          file_size: undefined,
        },
      })
  }

  /**
   * Return the maximun number of each relation that must appears in the export.
   * The number of item of a relation can vary between 0-Infinity and therefore the number of columns
   * that will be added to the export correspond to that number
   * @param products - The main entity to get the relation shape from
   * @return ({
   *   optionColumnCount: number
   *   imageColumnCount: number
   *   salesChannelsColumnCount: number
   *   pricesData: Set<string>
   * })
   * @private
   */
  private getProductRelationsDynamicColumnsShape(products: Product[]): {
    optionColumnCount: number
    imageColumnCount: number
    salesChannelsColumnCount: number
    pricesData: Set<string>
  } {
    let optionColumnCount = 0
    let imageColumnCount = 0
    let salesChannelsColumnCount = 0
    const pricesData = new Set<string>()

    // Retrieve the highest count of each object to build the dynamic columns later
    for (const product of products) {
      const optionsCount = product?.options?.length ?? 0
      optionColumnCount = Math.max(optionColumnCount, optionsCount)

      const imageCount = product?.images?.length ?? 0
      imageColumnCount = Math.max(imageColumnCount, imageCount)

      if (
        this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
      ) {
        const salesChannelCount = product?.sales_channels?.length ?? 0
        salesChannelsColumnCount = Math.max(
          salesChannelsColumnCount,
          salesChannelCount
        )
      }

      for (const variant of product?.variants ?? []) {
        if (variant.prices?.length) {
          variant.prices.forEach((price) => {
            pricesData.add(
              JSON.stringify({
                currency_code: price.currency_code,
                region: price.region
                  ? {
                      currency_code: price.region.currency_code,
                      name: price.region.name,
                      id: price.region.id,
                    }
                  : null,
              })
            )
          })
        }
      }
    }

    return {
      optionColumnCount,
      imageColumnCount,
      salesChannelsColumnCount,
      pricesData,
    }
  }
}
