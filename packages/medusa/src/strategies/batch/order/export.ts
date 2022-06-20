import { Dictionary, omit, pickBy } from "lodash"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { orderExportPropertiesDescriptors } from "."
import { AdminGetOrdersParams } from "../../../api"
import { AdminPostBatchesReq } from "../../../api/routes/admin/batch/create-batch-job"
import { IFileService } from "../../../interfaces"
import { AbstractBatchJobStrategy } from "../../../interfaces/batch-job-strategy"
import { BatchJob, Order } from "../../../models"
import { OrderService } from "../../../services"
import BatchJobService from "../../../services/batch-job"
import { BatchJobStatus } from "../../../types/batch-job"
import { DateComparisonOperator } from "../../../types/common"
import { prepareListQuery } from "../../../utils/get-query-config"
import { validator } from "../../../utils/validator"

type PropertiesDescriptor<T> = {
  fieldName: string
  title: string
  accessor: (entity: T) => string
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

  constructor({ fileService, batchJobService, orderService, manager }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.orderService_ = orderService
  }

  async prepareBatchJobForProcessing(
    batchJob: AdminPostBatchesReq,
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
        limit: limit as number,
        offset: offset as number,
        order: order as string,
        fields: fields as string,
        expand: expand as string,
      },
      {
        isList: true,
        defaultRelations: this.defaultRelations_,
      }
    )

    // const {
    //   select: filterableFields,
    //   skip,
    //   take,
    //   ...listConfig
    // } = prepareListQuery(
    //   {
    //     context: batchJob.context,
    //     type: batchJob.type,
    //     dry_run: batchJob.dry_run,
    //     limit: limit as number,
    //     offset: offset as number,
    //     order: order as string,
    //     fields: fields as string,
    //     expand: expand as string,
    //   },
    //   {
    //     isList: true,
    //     defaultRelations: this.defaultRelations_,
    //   }
    // )

    batchJob.context = {
      ...(context ?? {}),
      list_config: listConfig,
      filterable_fields,
    }

    return batchJob
  }

  async processJob(batchJobId: string): Promise<void> {
    let offset = 0
    let orderCount = 0

    return await this.atomicPhase_(
      async (transactionManager) => {
        const batchJob = await this.batchJobService_
          .withTransaction(transactionManager)
          .retrieve(batchJobId)

        offset = (batchJob.context.offset as number | undefined) ?? offset

        const [filter, listConfig, lineDescriptor] =
          await this.getExportConfiguration(batchJob)

        const { writeStream, fileKey, promise } =
          await this.fileService_.getUploadStreamDescriptor({
            name: "exports/order-export",
            ext: "csv",
          })

        const header = this.buildHeader(lineDescriptor)
        writeStream.write(header)

        const { list_config = {}, filterable_fields = {} } = batchJob.context
        const [, count] = await this.orderService_.listAndCount(
          filterable_fields,
          {
            ...list_config,
            order: { created_at: "DESC" },
            skip: offset,
            take: this.BATCH_SIZE,
          }
        )

        orderCount = count

        let context = batchJob.context
        let orders = []

        while (offset < count) {
          orders = await this.orderService_
            .withTransaction(transactionManager)
            .list(filter, {
              ...listConfig,
              skip: offset,
              take: this.BATCH_SIZE,
            })

          orders.forEach(async (order) => {
            writeStream.write(await this.buildCSVLine(order, lineDescriptor))
          })

          context = { ...context, count, offset, progress: offset / count }
          const batch = await this.batchJobService_
            .withTransaction(transactionManager)
            .update(batchJobId, {
              context,
            })

          offset += this.BATCH_SIZE

          if (batch.status === BatchJobStatus.CANCELED) {
            writeStream.end()

            await this.fileService_
              .withTransaction(transactionManager)
              .delete({ key: fileKey })

            return
          }
        }

        writeStream.end()

        await promise

        context.fileKey = fileKey
        context.progress = 1

        const updatedBatchJob = await this.batchJobService_.update(batchJobId, {
          context,
        })

        await this.batchJobService_.complete(updatedBatchJob)
      },
      "REPEATABLE READ",
      async (err) =>
        this.handleProcessingErrors(batchJobId, err, {
          offset,
          count: orderCount,
          progress: offset / orderCount,
        })
    )
  }

  public async completeJob(batchJobId: string): Promise<BatchJob> {
    const batchJob = await this.batchJobService_.retrieve(batchJobId)

    if (batchJob.status !== BatchJobStatus.COMPLETED) {
      return await this.batchJobService_.complete(batchJob)
    } else {
      return batchJob
    }
  }

  public async buildTemplate(): Promise<string> {
    return this.buildHeader(
      this.getLineDescriptor(this.defaultFields_, this.defaultRelations_)
    )
  }

  private buildHeader(
    lineDescriptor: PropertiesDescriptor<Order>[] = orderExportPropertiesDescriptors
  ): string {
    return (
      lineDescriptor.map(({ title }) => title).join(this.DELIMITER) +
      this.NEWLINE
    )
  }

  private async buildCSVLine(
    order: Order,
    lineDescriptor: PropertiesDescriptor<Order>[]
  ): Promise<string> {
    return (
      lineDescriptor
        .map(({ accessor }) => accessor(order))
        .join(this.DELIMITER) + this.NEWLINE
    )
  }

  private getLineDescriptor(
    fields: string[],
    relations: string[]
  ): PropertiesDescriptor<Order>[] {
    return orderExportPropertiesDescriptors.filter(
      ({ fieldName }) =>
        fields.indexOf(fieldName) !== -1 || relations.indexOf(fieldName) !== -1
    )
  }

  private async getExportConfiguration(
    batchJob: BatchJob
  ): Promise<
    [
      Dictionary<string | number | string[] | DateComparisonOperator>,
      any,
      PropertiesDescriptor<Order>[]
    ]
  > {
    const params = await validator(
      AdminGetOrdersParams,
      batchJob.context.params
    )

    let includeFields: string[] = []

    if (params.fields) {
      includeFields = params.fields.split(",")
      // Ensure created_at is included, since we are sorting on this
      includeFields.push("created_at")
    }

    let expandFields: string[] = []
    if (params.expand) {
      expandFields = params.expand.split(",")
      if (expandFields.indexOf("shipping_address") === -1 && params.fields) {
        includeFields.push("region_id")
      }
    }

    const listConfig = {
      select: includeFields.length ? includeFields : this.defaultFields_,
      relations: expandFields.length ? expandFields : this.defaultRelations_,
      order: { created_at: "DESC" },
    }

    const filterableFields = omit(params, [
      "limit",
      "offset",
      "expand",
      "fields",
      "order",
    ])

    const lineDescriptor = this.getLineDescriptor(
      listConfig.select,
      listConfig.relations
    )

    return [
      pickBy(filterableFields, (val) => typeof val !== "undefined"),
      listConfig,
      lineDescriptor,
    ]
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
              offset,
            },
            result: {
              ...batchJob.result,
              count,
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

export default OrderExportStrategy
