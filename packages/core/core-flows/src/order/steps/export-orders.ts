import {
  FilterableOrderProps,
  IFileModuleService,
  OrderDTO,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  deduplicate,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { json2csv } from "json-2-csv"

import {
  getLastFulfillmentStatus,
  getLastPaymentStatus,
} from "../utils/aggregate-status"

export type ExportOrdersStepInput = {
  batch_size?: number | string
  select: string[]
  filter?: FilterableOrderProps
}

export type ExportOrdersStepOutput = {
  id: string
  filename: string
}

export const exportOrdersStepId = "export-orders"

const normalizeOrderForExport = (order: OrderDTO): object => {
  const order_ = order as any
  const customer = order_.customer || {}
  const shippingAddress = order_.shipping_address || {}

  return JSON.parse(
    JSON.stringify({
      Order_ID: order.id,
      Display_ID: order.display_id,
      "Order status": order.status,
      Date: order.created_at,
      "Customer First name": customer.first_name || "",
      "Customer Last name": customer.last_name || "",
      "Customer Email": customer.email || "",
      "Customer ID": customer.id || "",
      "Shipping Address 1": shippingAddress.address_1 || "",
      "Shipping Address 2": shippingAddress.address_2 || "",
      "Shipping Country Code": shippingAddress.country_code || "",
      "Shipping City": shippingAddress.city || "",
      "Shipping Postal Code": shippingAddress.postal_code || "",
      "Shipping Region ID": order.region_id,
      "Fulfillment Status": order_.fulfillment_status,
      "Payment Status": order_.payment_status,
      Subtotal: order.subtotal,
      "Shipping Total": order.shipping_total,
      "Discount Total": order.discount_total,
      "Gift Card Total": order.gift_card_total,
      "Refunded Total": order_.refunded_total,
      "Tax Total": order.tax_total,
      Total: order.total,
      "Currency Code": order.currency_code,
    })
  )
}

export const exportOrdersStep = createStep(
  exportOrdersStepId,
  async (input: ExportOrdersStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fileModule = container.resolve(Modules.FILE)

    const filename = `${Date.now()}-order-exports.csv`
    const { writeStream, promise, fileKey } = await fileModule.getUploadStream({
      filename,
      mimeType: "text/csv",
    })

    const pageSize = !isNaN(parseInt(input?.batch_size as string))
      ? parseInt(input?.batch_size as string, 10)
      : 50

    let page = 0
    let hasHeader = false

    const fields = deduplicate([
      ...input.select,
      "id",
      "status",
      "items.*",
      "customer.*",
      "shipping_address.*",
      "payment_collections.status",
      "payment_collections.amount",
      "payment_collections.captured_amount",
      "payment_collections.refunded_amount",
      "fulfillments.packed_at",
      "fulfillments.shipped_at",
      "fulfillments.delivered_at",
      "fulfillments.canceled_at",
    ])

    while (true) {
      const { data: orders } = await query.graph({
        entity: "order",
        filters: {
          ...input.filter,
          status: {
            $ne: "draft",
          },
        },
        pagination: {
          skip: page * pageSize,
          take: pageSize,
        },
        fields,
      })

      if (orders.length === 0) {
        break
      }

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i]
        const order_ = order as any

        order_.payment_status = getLastPaymentStatus(order_)
        order_.fulfillment_status = getLastFulfillmentStatus(order_)

        delete order_.version
        delete order.payment_collections
        delete order.fulfillments

        orders[i] = normalizeOrderForExport(order)
      }

      const batchCsv = json2csv(orders, {
        prependHeader: !hasHeader,
        arrayIndexesAsKeys: true,
        expandNestedObjects: true,
        expandArrayObjects: true,
        unwindArrays: false,
        preventCsvInjection: true,
        emptyFieldValue: "",
      })

      const ok = writeStream.write((hasHeader ? "\n" : "") + batchCsv)
      if (!ok) {
        await new Promise((resolve) => writeStream.once("drain", resolve))
      }

      hasHeader = true

      if (orders.length < pageSize) {
        break
      }

      page += 1
    }

    writeStream.end()

    await promise

    return new StepResponse(
      { id: fileKey, filename } as ExportOrdersStepOutput,
      fileKey
    )
  },
  async (fileId, { container }) => {
    if (!fileId) {
      return
    }

    const fileModule: IFileModuleService = container.resolve(Modules.FILE)
    await fileModule.deleteFiles(fileId)
  }
)
