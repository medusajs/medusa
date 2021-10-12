import axios from "axios"
import { MedusaError } from "medusa-core-utils"

class ShopifySubscriber {
  constructor(
    {
      eventBusService,
      shopifyFulfillmentService,
      shopifyProductService,
      shopifyProviderService,
      orderService,
      returnService,
    },
    options
  ) {
    this.options_ = options
    this.eventBusService_ = eventBusService
    this.fulfillmentService_ = shopifyFulfillmentService
    this.productService_ = shopifyProductService
    this.provider_ = shopifyProviderService
    this.orderService_ = orderService
    this.returnService_ = returnService

    eventBusService.subscribe("order.items_returned", this.registerReturn)

    eventBusService.subscribe("order.refund_created", this.registerRefund)

    eventBusService.subscribe(
      "order.fulfillment_created",
      this.registerFulfillmentCreate
    )

    eventBusService.subscribe(
      "order.fulfillment_canceled",
      this.registerFulfillmentCancel
    )

    eventBusService.subscribe(
      "order.shipment_created",
      this.registerShipmentCreate
    )

    eventBusService.subscribe("product.updated", this.registerProductUpdate)

    eventBusService.subscribe(
      "product-variant.updated",
      this.registerVariantUpdate
    )

    eventBusService.subscribe(
      "product-variant.deleted",
      this.registerVariantDelete
    )
  }

  registerRefund = async ({ id, refund_id }) => {
    const order = await this.orderService_.retrieve(id, {
      relations: ["refunds", "payments"],
    })
    const refund = order.refunds.find((refund) => refund.id === refund_id)
    const shopifyPayment = order.payments[0]

    const transactions = [
      {
        amount: refund.amount / 100,
        kind: "refund",
        parent_id: shopifyPayment.data.transaction_id,
        gateway: shopifyPayment.data.gateway,
      },
    ]

    const refundObject = {
      refund: {
        currency: order.currency_code.toUpperCase(),
        note: refund.note || "Medusa Commerce",
        transactions,
        notify: true,
      },
    }

    try {
      await axios.post(
        `https://${this.options_.domain}.myshopify.com/admin/api/2021-10/orders/${order.external_id}/refunds.json`,
        refundObject,
        {
          headers: {
            "X-Shopify-Access-Token": this.options_.password,
            "Content-Type": "application/json",
          },
        }
      )
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `An error occurend while issuing a refund to Shopify: ${err.message}`
      )
    }
  }

  registerReturn = async ({ id, return_id }) => {
    const ret = await this.returnService_.retrieve(return_id)
    const order = await this.orderService_.retrieve(id, {
      relations: ["payments"],
    })
    const fulfillmentOrders = await this.shopify_
      .get({
        path: `orders/${order.external_id}/fulfillment_orders`,
      })
      .then((res) => {
        return res.body.fulfillment_orders
      })
    const shopifyPayment = order.payments[0]
    const refundItems = ret.items.map((ri) => ({
      line_item_id: ri.metadata.sh_id,
      quantity: ri.quantity,
      restock_type: "return",
      location_id: this.getLocationId_(ri, fulfillmentOrders),
    }))
    const transactions = [
      {
        amount: ret.refund_amount / 100,
        kind: "refund",
        parent_id: shopifyPayment.data.transaction_id,
        gateway: shopifyPayment.data.gateway,
      },
    ]
    const refundObject = {
      refund: {
        currency: order.currency_code.toUpperCase(),
        note: "Medusa Commerce",
        refund_line_items: refundItems,
        transactions,
        notify: true,
      },
    }
    try {
      await axios.post(
        `https://${this.options_.domain}.myshopify.com/admin/api/2021-10/orders/${order.external_id}/refunds.json`,
        refundObject,
        {
          headers: {
            "X-Shopify-Access-Token": this.options_.password,
            "Content-Type": "application/json",
          },
        }
      )
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `An error occurend while issuing a refund to Shopify: ${err.message}`
      )
    }
  }

  registerShipmentCreate = async ({ fulfillment_id }) => {
    await this.fulfillmentService_.shopifyShipmentCreate(fulfillment_id)
  }

  registerFulfillmentCreate = async ({ id, fulfillment_id }) => {
    await this.fulfillmentService_.shopifyFulfillmentCreate(id, fulfillment_id)
  }

  registerFulfillmentCancel = async ({ fulfillment_id }) => {
    await this.fulfillmentService_.shopifyFulfillmentCancel(fulfillment_id)
  }

  registerProductUpdate = async ({ id, fields }) => {
    await this.productService_.shopifyProductUpdate(id, fields)
  }

  registerVariantUpdate = async ({ id, fields }) => {
    await this.productService_.shopifyVariantUpdate(id, fields)
  }

  registerVariantDelete = async ({ product_id, metadata }) => {
    await this.productService_.shopifyVariantDelete(product_id, metadata)
  }
}

export default ShopifySubscriber
