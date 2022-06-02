import { Dictionary, indexOf, omit, pickBy } from "lodash"
import { EntityManager } from "typeorm"
import { AdminGetOrdersParams } from "../../../api"
import { IFileService } from "../../../interfaces"
import { AbstractBatchJobStrategy } from "../../../interfaces/batch-job-strategy"
import logger from "../../../loaders/logger"
import { BatchJob, Order } from "../../../models"
import { OrderService, TotalsService } from "../../../services"
import BatchJobService from "../../../services/batch-job"
import { BatchJobStatus } from "../../../types/batch-job"
import { DateComparisonOperator } from "../../../types/common"
import { Logger } from "../../../types/global"
import { validator } from "../../../utils/validator"

class OrderExportStrategy extends AbstractBatchJobStrategy<OrderExportStrategy> {
  public static identifier = "order-export-strategy"
  public static batchType = "order-export"

  private BATCH_SIZE = 100
  private NEWLINE = "\r\n"
  private DELIMITER = ";"

  protected readonly propertiesDescriptorArray = new Map([
    ["id", { title: "Order_ID", accessor: (order: Order): string => order.id }],
    [
      "display_id",
      {
        title: "Display_ID",
        accessor: (order: Order): string => order.display_id.toString(),
      },
    ],
    [
      "created_at",
      {
        title: "Date",
        accessor: (order: Order): string => order.created_at.toUTCString(),
      },
    ],
    [
      "customer",
      {
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
    ],
    [
      "shipping_address",
      {
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
    ],
    [
      "fulfillment_status",
      {
        title: "Fulfillment Status",
        accessor: (order: Order): string => order.fulfillment_status,
      },
    ],
    [
      "payment_status",
      {
        title: "Payment Status",
        accessor: (order: Order): string => order.payment_status,
      },
    ],
    [
      "subtotal",
      {
        title: "Subtotal",
        accessor: (order: Order): string => order.subtotal.toString(),
      },
    ],
    [
      "shipping_total",
      {
        title: "Shipping Total",
        accessor: (order: Order): string => order.shipping_total.toString(),
      },
    ],
    [
      "discount_total",
      {
        title: "Discount Total",
        accessor: (order: Order): string => order.discount_total.toString(),
      },
    ],
    [
      "gift_card_total",
      {
        title: "Gift Card Total",
        accessor: (order: Order): string => order.gift_card_total.toString(),
      },
    ],
    [
      "total",
      {
        title: "Total",
        accessor: (order: Order): string => order.total.toString(),
      },
    ],
    [
      "currency_code",
      {
        title: "Currency Code",
        accessor: (order: Order): string => order.currency_code,
      },
    ],
  ])

  private readonly relations = ["customer", "shipping_address"]
  private readonly select = [
    "id",
    "status",
    "fulfillment_status",
    "payment_status",
    "display_id",
    "cart_id",
    "draft_order_id",
    "customer_id",
    "email",
    "region_id",
    "currency_code",
    "tax_rate",
    "canceled_at",
    "created_at",
    "updated_at",
    "metadata",
    "shipping_total",
    "discount_total",
    "tax_total",
    "refunded_total",
    "gift_card_total",
    "subtotal",
    "total",
    "paid_total",
    "refundable_amount",
    "no_notification",
  ]

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly fileService_: IFileService<any>
  protected readonly batchJobService_: BatchJobService
  protected readonly orderService_: OrderService
  protected readonly totalsService_: TotalsService
  protected readonly logger_: Logger

  constructor({
    fileService,
    batchJobService,
    orderService,
    totalsService,
    manager,
    logger,
  }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.logger_ = logger
    this.manager_ = manager
    this.fileService_ = fileService
    this.batchJobService_ = batchJobService
    this.orderService_ = orderService
    this.totalsService_ = totalsService
  }

  async validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await validator(AdminGetOrdersParams, context.params)
    return context
  }

  async prepareBatchJobForProcessing(
    batchJobId: string,
    req: any
  ): Promise<BatchJob> {
    return await this.batchJobService_.ready(batchJobId)
  }

  async processJob(batchJobId: string): Promise<BatchJob> {
    const batchJob = await this.batchJobService_.retrieve(batchJobId)

    const params = await validator(
      AdminGetOrdersParams,
      batchJob.context.params
    )

    const [filter, listConfig] = this.getListParameters(params)

    const lineDescriptor = this.getLineDescriptor(
      listConfig.select,
      listConfig.relations
    )

    const {
      writeStream,
      url: key,
      promise,
    } = await this.fileService_.getUploadStreamDescriptor({
      name: "order-export",
      ext: "csv",
    })

    const header = this.buildHeader(lineDescriptor)
    writeStream.write(header)

    let offset = 0

    const [, count] = await this.orderService_.listAndCount(filter, {
      ...listConfig,
      skip: offset,
      take: this.BATCH_SIZE,
    })

    let context = batchJob.context
    let orders = []

    while (offset < count) {
      orders = await this.orderService_.list(filter, {
        ...listConfig,
        skip: offset,
        take: this.BATCH_SIZE,
      })

      orders.forEach(async (order) => {
        writeStream.write(await this.buildCSVLine(order, lineDescriptor))
      })

      offset += this.BATCH_SIZE

      context = { ...context, offset, count, progress: offset / count }
      const batch = await this.batchJobService_.update(batchJobId, { context })

      if (batch.status === BatchJobStatus.CANCELED) {
        writeStream.end()

        await this.fileService_.delete({ key: key })

        return batch
      }
    }

    writeStream.end()

    await promise

    context.fileKey = key

    const updatedBatchJob = await this.batchJobService_.update(batchJobId, {
      context,
    })

    return await this.batchJobService_.complete(updatedBatchJob)
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

  private buildHeader(lineDescriptor): string {
    return (
      lineDescriptor.map(([key, { title }]) => title).join(this.DELIMITER) +
      this.NEWLINE
    )
    // return (
    //   [
    //     "Order_ID",
    //     "Display_ID",
    //     "Date",
    //     "Customer First name",
    //     "Customer Last name",
    //     "Customer Email",
    //     "Customer ID",
    //     "Shipping Address 1",
    //     "Shipping Address 2",
    //     "Shipping Country Code",
    //     "Shipping City",
    //     "Shipping Postal Code",
    //     "Shipping Region ID",
    //     "Fulfillment Status",
    //     "Payment Status",
    //     "Subtotal",
    //     "Shipping Total",
    //     "Discount Total",
    //     "Gift Card Total",
    //     "Total",
    //     "Currency Code",
    //   ].join(this.DELIMITER) + this.NEWLINE
    // )
  }

  private async buildCSVLine(order: Order, lineDescriptor): Promise<string> {
    return (
      lineDescriptor
        .map(([, { accessor }]) => accessor(order))
        .join(this.DELIMITER) + this.NEWLINE
    )
    // return (
    //   [
    //     order.id,
    //     order.display_id,
    //     order.created_at.toUTCString(),
    //     order.customer.first_name,
    //     order.customer.last_name,
    //     order.customer.email,
    //     order.customer.id,
    //     order.shipping_address.address_1,
    //     order.shipping_address.address_2,
    //     order.shipping_address.country_code,
    //     order.shipping_address.city,
    //     order.shipping_address.postal_code,
    //     order.region_id,
    //     order.fulfillment_status,
    //     order.payment_status,
    //     order.subtotal,
    //     order.shipping_total,
    //     order.discount_total,
    //     order.gift_card_total,
    //     order.total,
    //     order.currency_code,
    //   ].join(this.DELIMITER) + this.NEWLINE
    // )
  }

  private getLineDescriptor(
    fields: string[],
    relations: string[]
  ): [string, { title: string; accessor: (order: Order) => string }][] {
    return [...this.propertiesDescriptorArray].filter(
      ([key, _]) => fields.indexOf(key) !== -1 || relations.indexOf(key) !== -1
    )
  }

  private getListParameters(
    context: AdminGetOrdersParams
  ): [Dictionary<string | number | string[] | DateComparisonOperator>, any] {
    let includeFields: string[] = []

    if (context.fields) {
      includeFields = context.fields.split(",")
      // Ensure created_at is included, since we are sorting on this
      includeFields.push("created_at")
    }

    let expandFields: string[] = []
    if (context.expand) {
      expandFields = context.expand.split(",")
    }

    const listConfig = {
      select: includeFields.length ? includeFields : this.select,
      relations: expandFields.length ? expandFields : this.relations,
      order: { created_at: "DESC" },
    }

    const filterableFields = omit(context, [
      "limit",
      "offset",
      "expand",
      "fields",
      "order",
    ])

    return [
      pickBy(filterableFields, (val) => typeof val !== "undefined"),
      listConfig,
    ]
  }
}

export default OrderExportStrategy
