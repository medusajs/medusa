import { EntityManager } from "typeorm"
import {
  OrderDescriptor,
  OrderExportBatchJob,
  OrderExportBatchJobContext,
  orderExportPropertiesDescriptors,
} from "."
import { AdminPostBatchesReq } from "../../../api"
import { IFileService } from "../../../interfaces"
import { AbstractBatchJobStrategy } from "../../../interfaces"
import { Order } from "../../../models"
import { OrderService } from "../../../services"
import BatchJobService from "../../../services/batch-job"
import { BatchJobStatus } from "../../../types/batch-job"
import { prepareListQuery } from "../../../utils/get-query-config"
import { FlagRouter } from "../../../utils/flag-router"
import SalesChannelFeatureFlag from "../../../loaders/feature-flags/sales-channels"

type InjectedDependencies = {
  fileService: IFileService<never>
  orderService: OrderService
  batchJobService: BatchJobService
  manager: EntityManager
  featureFlagRouter: FlagRouter
}

class OrderExportStrategy extends AbstractBatchJobStrategy<OrderExportStrategy> {
  public static identifier = "order-export-strategy"
  public static batchType = "order-export"

  public defaultMaxRetry = 3

  protected readonly DEFAULT_LIMIT = 100
  protected readonly NEWLINE = "\r\n"
  protected readonly DELIMITER = ";"

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly fileService_: IFileService<any>
  protected readonly batchJobService_: BatchJobService
  protected readonly orderService_: OrderService
  protected readonly featureFlagRouter_: FlagRouter

  protected readonly orderExportPropertiesDescriptors = [
    ...orderExportPropertiesDescriptors,
  ]

  protected readonly defaultRelations_ = ["customer", "shipping_address"]
  protected readonly defaultFields_ = [
    "id",
    "display_id",
    "status",
    "created_at",
    "fulfillment_status",
    "payment_status",
    "subtotal",
    "shipping_total",
    "discount_total",
    "gift_card_total",
    "refunded_total",
    "tax_total",
    "total",
    "currency_code",
    "region_id",
  ]

  constructor({
    fileService,
    batchJobService,
    orderService,
    manager,
    featureFlagRouter,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.orderService_ = orderService
    this.featureFlagRouter_ = featureFlagRouter

    if (featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
      this.defaultRelations_.push("sales_channel")
      this.addSalesChannelColumns()
    }
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
    } = batchJob.context as OrderExportBatchJobContext

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
        defaultFields: this.defaultFields_,
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
        .retrieve(batchJobId)) as OrderExportBatchJob

      const offset = batchJob.context?.list_config?.skip ?? 0
      const limit = batchJob.context?.list_config?.take ?? this.DEFAULT_LIMIT

      const { list_config = {}, filterable_fields = {} } = batchJob.context

      let count = batchJob.context?.batch_size

      if (!count) {
        const [, orderCount] = await this.orderService_
          .withTransaction(transactionManager)
          .listAndCount(filterable_fields, {
            ...(list_config ?? {}),
            skip: offset as number,
            order: { created_at: "DESC" },
            take: Math.min(batchJob.context.batch_size ?? Infinity, limit),
          })
        count = orderCount
      }

      await this.batchJobService_
        .withTransaction(transactionManager)
        .update(batchJob, {
          result: {
            stat_descriptors: [
              {
                key: "order-export-count",
                name: "Order count to export",
                message: `There will be ${count} orders exported by this action`,
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
    let orderCount = 0
    let approximateFileSize = 0

    return await this.atomicPhase_(
      async (transactionManager) => {
        let batchJob = (await this.batchJobService_
          .withTransaction(transactionManager)
          .retrieve(batchJobId)) as OrderExportBatchJob

        const { writeStream, fileKey, promise } = await this.fileService_
          .withTransaction(transactionManager)
          .getUploadStreamDescriptor({
            name: `exports/orders/order-export-${Date.now()}`,
            ext: "csv",
          })

        advancementCount =
          batchJob.result?.advancement_count ?? advancementCount
        offset = (batchJob.context?.list_config?.skip ?? 0) + advancementCount
        limit = batchJob.context?.list_config?.take ?? limit

        const { list_config = {}, filterable_fields = {} } = batchJob.context
        const [, count] = await this.orderService_.listAndCount(
          filterable_fields,
          {
            ...list_config,
            order: { created_at: "DESC" },
            skip: offset,
            take: Math.min(batchJob.context.batch_size ?? Infinity, limit),
          }
        )

        orderCount = batchJob.context?.batch_size ?? count
        let orders = []

        const lineDescriptor = this.getLineDescriptor(
          list_config.select as string[],
          list_config.relations as string[]
        )

        const header = this.buildHeader(lineDescriptor)
        writeStream.write(header)
        approximateFileSize += Buffer.from(header).byteLength

        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            result: {
              file_key: fileKey,
              file_size: approximateFileSize,
            },
          })

        while (offset < orderCount) {
          orders = await this.orderService_
            .withTransaction(transactionManager)
            .list(filterable_fields, {
              ...list_config,
              skip: offset,
              take: Math.min(orderCount - offset, limit),
            })

          orders.forEach((order) => {
            const line = this.buildCSVLine(order, lineDescriptor)
            approximateFileSize += Buffer.from(line).byteLength
            writeStream.write(line)
          })

          advancementCount += orders.length
          offset += orders.length

          batchJob = (await this.batchJobService_
            .withTransaction(transactionManager)
            .update(batchJobId, {
              result: {
                file_size: approximateFileSize,
                count: orderCount,
                advancement_count: advancementCount,
                progress: advancementCount / orderCount,
              },
            })) as OrderExportBatchJob

          if (batchJob.status === BatchJobStatus.CANCELED) {
            writeStream.end()

            await this.fileService_
              .withTransaction(transactionManager)
              .delete({ key: fileKey })

            return
          }
        }

        writeStream.end()

        await promise
      },
      "REPEATABLE READ",
      async (err: Error) =>
        this.handleProcessingError(batchJobId, err, {
          offset,
          count: orderCount,
          progress: offset / orderCount,
        })
    )
  }

  public async buildTemplate(): Promise<string> {
    return this.buildHeader(
      this.getLineDescriptor(this.defaultFields_, this.defaultRelations_)
    )
  }

  private buildHeader(
    lineDescriptor: OrderDescriptor[] = this.orderExportPropertiesDescriptors
  ): string {
    return (
      [...lineDescriptor.map(({ title }) => title)].join(this.DELIMITER) +
      this.NEWLINE
    )
  }

  private buildCSVLine(
    order: Order,
    lineDescriptor: OrderDescriptor[]
  ): string {
    return (
      [...lineDescriptor.map(({ accessor }) => accessor(order))].join(
        this.DELIMITER
      ) + this.NEWLINE
    )
  }

  private getLineDescriptor(
    fields: string[],
    relations: string[]
  ): OrderDescriptor[] {
    return this.orderExportPropertiesDescriptors.filter(
      ({ fieldName }) =>
        fields.indexOf(fieldName) !== -1 || relations.indexOf(fieldName) !== -1
    )
  }

  private addSalesChannelColumns(): void {
    this.orderExportPropertiesDescriptors.push({
      fieldName: "sales_channel",
      title: ["Sales channel name", "Sales channel description"].join(";"),
      accessor: (order: Order): string =>
        [order.sales_channel.name, order.sales_channel.description].join(";"),
    })
  }
}

export default OrderExportStrategy
