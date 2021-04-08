import { humanizeAmount } from "medusa-core-utils"

class OrderSubscriber {
  constructor({
    segmentService,
    eventBusService,
    swapService,
    lineItemService,
    fulfillmentService,
  }) {
    this.fulfillmentService_ = fulfillmentService

    this.lineItemService_ = lineItemService

    this.swapService_ = swapService

    this.segmentService_ = segmentService

    eventBusService.subscribe(
      "swap.shipment_created",
      async ({ id, fulfillment_id }) => {
        const [swap, swapReport] = await this.gatherSwapReport(id)
        const fulfillment = await this.fulfillmentService_.retrieve(
          fulfillment_id
        )

        const currency = swapReport.currency
        const total = humanizeAmount(swap.difference_due, currency)
        const reporting_total = await this.segmentService_.getReportingValue(
          currency,
          total
        )

        return await segmentService.track({
          event: "Swap Shipped",
          userId: swap.order.customer_id,
          timestamp: fulfillment.shipped_at,
          properties: {
            reporting_total,
            total,
            ...swapReport,
          },
        })
      }
    )

    eventBusService.subscribe("swap.payment_completed", async ({ id }) => {
      const [swap, swapReport] = await this.gatherSwapReport(id)

      const currency = swapReport.currency
      const total = humanizeAmount(swap.difference_due, currency)
      const reporting_total = await this.segmentService_.getReportingValue(
        currency,
        total
      )

      return await segmentService.track({
        event: "Swap Confirmed",
        userId: swap.order.customer_id,
        timestamp: swap.confirmed_at,
        properties: {
          reporting_total,
          total,
          ...swapReport,
        },
      })
    })

    eventBusService.subscribe("swap.created", async ({ id }) => {
      const [swap, swapReport] = await this.gatherSwapReport(id)

      return await segmentService.track({
        event: "Swap Created",
        userId: swap.order.customer_id,
        timestamp: swap.created_at,
        properties: swapReport,
      })
    })
  }

  async gatherSwapReport(id) {
    const swap = await this.swapService_.retrieve(id, {
      relations: [
        "order",
        "additional_items",
        "additional_items.variant",
        "return_order",
        "return_order.items",
        "return_order.shipping_method",
      ],
    })

    const currency = swap.order.currency_code

    const newItems = await Promise.all(
      swap.additional_items.map(async (i) => {
        const price = humanizeAmount(i.unit_price, currency)
        const reporting_price = await this.segmentService_.getReportingValue(
          currency,
          price
        )

        return {
          name: i.title,
          product_id: i.variant.product_id,
          variant: i.variant.sku,
          quantity: i.quantity,
          price,
          reporting_price,
        }
      })
    )

    const returnItems = await Promise.all(
      swap.return_order.items.map(async (ri) => {
        const i = await this.lineItemService_.retrieve(ri.item_id, {
          relations: ["variant"],
        })
        const price = humanizeAmount(i.unit_price, currency)
        const reporting_price = await this.segmentService_.getReportingValue(
          currency,
          price
        )

        return {
          name: i.title,
          product_id: i.variant.product_id,
          variant: i.variant.sku,
          quantity: ri.quantity,
          price,
          reporting_price,
        }
      })
    )

    return [
      swap,
      {
        swap_id: swap.id,
        order_id: swap.order_id,
        new_items: newItems,
        return_items: returnItems,
        currency,
      },
    ]
  }
}

export default OrderSubscriber
