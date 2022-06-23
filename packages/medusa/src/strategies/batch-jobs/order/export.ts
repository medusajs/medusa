import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  OrderDescriptor,
  OrderExportBatchJob,
  OrderExportBatchJobContext,
  orderExportPropertiesDescriptors,
} from "."
import { AdminPostBatchesReq } from "../../../api/routes/admin/batch/create-batch-job"
import { IFileService } from "../../../interfaces"
import { AbstractBatchJobStrategy } from "../../../interfaces/batch-job-strategy"
import { BatchJob, Order } from "../../../models"
import { OrderService } from "../../../services"
import BatchJobService from "../../../services/batch-job"
import { BatchJobStatus } from "../../../types/batch-job"
import { prepareListQuery } from "../../../utils/get-query-config"

type InjectedDependencies = {
  fileService: IFileService<any>
  orderService: OrderService
  batchJobService: BatchJobService
  manager: EntityManager
}

class OrderExportStrategy extends AbstractBatchJobStrategy<OrderExportStrategy> {
  public static identifier = "order-export-strategy"
  public static batchType = "order-export"

  public defaultMaxRetry = 3

  protected readonly BATCH_SIZE = 100
  protected readonly NEWLINE = "\r\n"
  protected readonly DELIMITER = ";"

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly fileService_: IFileService<any>
  protected readonly batchJobService_: BatchJobService
  protected readonly orderService_: OrderService

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
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.orderService_ = orderService
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

  async processJob(batchJobId: string): Promise<void> {
    let offset = 0
    let limit = this.BATCH_SIZE
    let advancementCount = 0
    let orderCount = 0

    return await this.atomicPhase_(
      async (transactionManager) => {
        let batchJob = (await this.batchJobService_
          .withTransaction(transactionManager)
          .retrieve(batchJobId)) as OrderExportBatchJob

        const { writeStream, fileKey, promise } =
          await this.fileService_.getUploadStreamDescriptor({
            name: "exports/order-export",
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

        const lineDescriptor = this.getLineDescriptor(
          list_config.select as string[],
          list_config.relations as string[]
        )

        const header = this.buildHeader(lineDescriptor)
        writeStream.write(header)

        orderCount = count

        const context = batchJob.context
        const result = batchJob.result
        let orders = []

        while (offset < orderCount) {
          orders = await this.orderService_
            .withTransaction(transactionManager)
            .list(filterable_fields, {
              ...list_config,
              skip: offset,
              take: this.BATCH_SIZE,
            })

          orders.forEach(async (order) => {
            writeStream.write(await this.buildCSVLine(order, lineDescriptor))
          })

          // context = { ...context, count, offset, progress: offset / count }
          batchJob = (await this.batchJobService_
            .withTransaction(transactionManager)
            .update(batchJobId, {
              context: {
                ...context,
                list_config: {
                  ...list_config,
                  skip: offset,
                },
              },
              result: {
                ...result,
                file_key: fileKey,
                count: orderCount,
                advancement_count: advancementCount,
                progress: advancementCount / orderCount,
              },
            })) as OrderExportBatchJob

          advancementCount += orders.length
          offset += orders.length

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

        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            result: {
              ...result,
              count,
              advancement_count: count,
              progress: 1,
            },
          })
      },
      "REPEATABLE READ",
      async (err: Error) => {
        this.handleProcessingError(batchJobId, err, {
          offset,
          count: orderCount,
          progress: offset / orderCount,
        })
      }
    )
  }

  public async buildTemplate(): Promise<string> {
    return this.buildHeader(
      this.getLineDescriptor(this.defaultFields_, this.defaultRelations_)
    )
  }

  private buildHeader(
    lineDescriptor: OrderDescriptor[] = orderExportPropertiesDescriptors
  ): string {
    return [...lineDescriptor.map(({ title }) => title), this.NEWLINE].join(
      this.DELIMITER
    )
  }

  private async buildCSVLine(
    order: Order,
    lineDescriptor: OrderDescriptor[]
  ): Promise<string> {
    return [
      ...lineDescriptor.map(({ accessor }) => accessor(order)),
      this.NEWLINE,
    ].join(this.DELIMITER)
  }

  private getLineDescriptor(
    fields: string[],
    relations: string[]
  ): OrderDescriptor[] {
    return orderExportPropertiesDescriptors.filter(
      ({ fieldName }) =>
        fields.indexOf(fieldName) !== -1 || relations.indexOf(fieldName) !== -1
    )
  }
}

export default OrderExportStrategy
