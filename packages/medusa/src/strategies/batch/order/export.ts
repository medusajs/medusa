import { Dictionary, omit, pickBy } from "lodash"
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

  private readonly relations = ["customer", "shipping_address"]
  private readonly selectConfig = [
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
    "items.refundable",
    "swaps.additional_items.refundable",
    "claims.additional_items.refundable",
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

  constructor({
    fileService,
    batchJobService,
    orderService,
    totalsService,
    manager,
  }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

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

    const {
      writeStream,
      url: key,
      promise,
    } = await this.fileService_.getUploadStreamDescriptor({
      name: "order-export",
      ext: "csv",
    })

    const header = this.buildHeader()
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
        writeStream.write(await this.buildCSVLine(order))
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
    return this.buildHeader()
  }

  private buildHeader(): string {
    return (
      [
        "Order_ID",
        "Display_ID",
        "Date",
        "Customer First name",
        "Customer Last name",
        "Customer Email",
        "Customer ID",
        "Shipping Address 1",
        "Shipping Address 2",
        "Shipping Country Code",
        "Shipping City",
        "Shipping Postal Code",
        "Shipping Region ID",
        "Fulfillment Status",
        "Payment Status",
        "Subtotal",
        "Shipping Total",
        "Discount Total",
        "Gift Card Total",
        "Total",
        "Currency Code",
      ].join(this.DELIMITER) + this.NEWLINE
    )
  }

  private async buildCSVLine(line: Order): Promise<string> {
    return (
      [
        line.id,
        line.display_id,
        line.created_at,
        line.customer.first_name,
        line.customer.last_name,
        line.customer.email,
        line.customer.id,
        line.shipping_address.address_1,
        line.shipping_address.address_2,
        line.shipping_address.country_code,
        line.shipping_address.city,
        line.shipping_address.postal_code,
        line.region_id,
        line.fulfillment_status,
        line.payment_status,
        line.subtotal,
        line.shipping_total,
        line.discount_total,
        line.gift_card_total,
        line.total,
        line.currency_code,
      ].join(this.DELIMITER) + this.NEWLINE
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
      select: includeFields.length ? includeFields : this.selectConfig,
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
