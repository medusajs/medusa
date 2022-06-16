import { Dictionary, indexOf, omit, pickBy } from "lodash"
import { EntityManager } from "typeorm"
import { AdminGetOrdersParams } from "../../../api"
import { AdminPostBatchesReq } from "../../../api/routes/admin/batch/create-batch-job"
import { IFileService } from "../../../interfaces"
import { AbstractBatchJobStrategy } from "../../../interfaces/batch-job-strategy"
import logger from "../../../loaders/logger"
import { BatchJob, Order } from "../../../models"
import { OrderService, TotalsService } from "../../../services"
import BatchJobService from "../../../services/batch-job"
import { BatchJobStatus } from "../../../types/batch-job"
import { DateComparisonOperator } from "../../../types/common"
import { Logger } from "../../../types/global"
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

  private BATCH_SIZE = 100
  private NEWLINE = "\r\n"
  private DELIMITER = ";"

  protected readonly propertiesDescriptors: PropertiesDescriptor<Order>[] = [
    {
      fieldName: "id",
      title: "Order_ID",
      accessor: (order: Order): string => order.id,
    },
    {
      fieldName: "display_id",
      title: "Display_ID",
      accessor: (order: Order): string => order.display_id.toString(),
    },
    {
      fieldName: "status",
      title: "Order status",
      accessor: (order: Order): string => order.status.toString(),
    },

    {
      fieldName: "created_at",
      title: "Date",
      accessor: (order: Order): string => order.created_at.toUTCString(),
    },

    {
      fieldName: "customer",
      title: [
        "Customer First name",
        "Customer Last name",
        "Customer Email",
        "Customer ID",
      ].join(";"),
      accessor: (order: Order): string =>
        [
          order.customer.first_name,
          order.customer.last_name,
          order.customer.email,
          order.customer.id,
        ].join(";"),
    },

    {
      fieldName: "shipping_address",
      title: [
        "Shipping Address 1",
        "Shipping Address 2",
        "Shipping Country Code",
        "Shipping City",
        "Shipping Postal Code",
        "Shipping Region ID",
      ].join(";"),
      accessor: (order: Order): string =>
        [
          order.shipping_address.address_1,
          order.shipping_address.address_2,
          order.shipping_address.country_code,
          order.shipping_address.city,
          order.shipping_address.postal_code,
          order.region_id,
        ].join(";"),
    },

    {
      fieldName: "fulfillment_status",
      title: "Fulfillment Status",
      accessor: (order: Order): string => order.fulfillment_status,
    },

    {
      fieldName: "payment_status",
      title: "Payment Status",
      accessor: (order: Order): string => order.payment_status,
    },

    {
      fieldName: "subtotal",
      title: "Subtotal",
      accessor: (order: Order): string => order.subtotal.toString(),
    },

    {
      fieldName: "shipping_total",
      title: "Shipping Total",
      accessor: (order: Order): string => order.shipping_total.toString(),
    },

    {
      fieldName: "discount_total",
      title: "Discount Total",
      accessor: (order: Order): string => order.discount_total.toString(),
    },

    {
      fieldName: "gift_card_total",
      title: "Gift Card Total",
      accessor: (order: Order): string => order.gift_card_total.toString(),
    },

    {
      fieldName: "refunded_total",
      title: "Refunded Total",
      accessor: (order: Order): string => order.refunded_total.toString(),
    },
    {
      fieldName: "tax_total",
      title: "Tax Total",
      accessor: (order: Order): string => order.tax_total.toString(),
    },
    {
      fieldName: "total",
      title: "Total",
      accessor: (order: Order): string => order.total.toString(),
    },

    {
      fieldName: "currency_code",
      title: "Currency Code",
      accessor: (order: Order): string => order.currency_code,
    },
  ]

  private readonly relations = ["customer", "shipping_address"]
  private readonly select = [
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

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly fileService_: IFileService<any>
  protected readonly batchJobService_: BatchJobService
  protected readonly orderService_: OrderService

  constructor({ fileService, batchJobService, orderService, manager }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.orderService_ = orderService
  }

  async validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await validator(AdminGetOrdersParams, context.params)
    return context
  }

  async prepareBatchJobForProcessing(
    batchJob: AdminPostBatchesReq,
    req: Express.Request
  ): Promise<AdminPostBatchesReq> {
    const { limit, offset, order, fields, expand, ...context } =
      batchJob.context

    const {
      select: filterableFields,
      skip,
      take,
      ...listConfig
    } = prepareListQuery(
      {
        context: batchJob.context,
        type: batchJob.type,
        dry_run: batchJob.dry_run,
        limit: limit as number,
        offset: offset as number,
        order: order as string,
        fields: fields as string,
        expand: expand as string,
      },
      {
        isList: true,
        defaultRelations: this.relations,
      }
    )

    batchJob.context = {
      ...(context ?? {}),
      listConfig,
      filterableFields: filterableFields || this.select,
      offset: skip,
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

        const [, count] = await this.orderService_.listAndCount(filter, {
          ...listConfig,
          skip: offset,
          take: this.BATCH_SIZE,
        })

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

  public async validateFile(fileLocation: string): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  public async buildTemplate(): Promise<string> {
    return this.buildHeader(this.getLineDescriptor(this.select, this.relations))
  }

  private buildHeader(lineDescriptor: PropertiesDescriptor<Order>[]): string {
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
    return this.propertiesDescriptors.filter(
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
      select: includeFields.length ? includeFields : this.select,
      relations: expandFields.length ? expandFields : this.relations,
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
    // Before validating that we should settle on defining if the job can be re process or not.
    /* return await this.atomicPhase_(async (transactionManager) => {
      const batchJob = await this.batchJobService_
        .withTransaction(transactionManager)
        .retrieve(batchJobId)
      if (err instanceof MedusaError) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .updateStatus(batchJob, BatchJobStatus.FAILED)
      } else if (batchJob.context.retry_count < batchJob.context.max_retry) {
        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            context: {
              ...batchJob.context,
              offset,
              count,
              progress,
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

export default OrderExportStrategy
