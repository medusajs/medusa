import axios from "axios"
import { MedusaError } from "medusa-core-utils"

class ShopifySubscriber {
  constructor(
    {
      eventBusService,
      returnService,
      fulfillmentService,
      shopifyFulfillmentService,
      orderService,
      shopifyClientService,
    },
    options
  ) {
    this.options = options

    this.eventBusService_ = eventBusService

    this.returnService_ = returnService

    this.fulfillmentService_ = fulfillmentService

    this.shopifyFulfillmentService_ = shopifyFulfillmentService

    this.orderService_ = orderService

    this.client_ = shopifyClientService

    eventBusService.subscribe(
      "order.items_returned",
      this.registerShopifyReturn
    )

    eventBusService.subscribe(
      "order.fulfillment_created",
      this.registerShopifyFulfillment
    )

    eventBusService.subscribe(
      "order.fulfillment_canceled",
      this.registerShopifyFulfillmentCancel
    )
  }

  registerShopifyReturn = async ({ id, return_id }) => {
    const ret = await this.returnService_.retrieve(return_id)
    const order = await this.orderService_.retrieve(id, {
      relations: ["payments"],
    })

    const fulfillmentOrders = await this.client_
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
        shipping: { full_refund: true },
        notify: true,
      },
    }

    //ShopifyRestClient can't handle this post for some unknown reason.. So we use axios
    try {
      await axios.post(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/orders/${order.external_id}/refunds.json`,
        refundObject,
        {
          headers: {
            "X-Shopify-Access-Token": this.options.password,
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

  registerShopifyFulfillment = async ({ id, fulfillment_id }) => {
    const fulfillment = await this.fulfillmentService_.retrieve(fulfillment_id)
    const order = await this.orderService_.retrieve(id, {
      relations: ["items"],
    })

    const fulfillmentOrders = await this.client_
      .get({
        path: `orders/${order.external_id}/fulfillment_orders`,
      })
      .then((res) => {
        return res.body.fulfillment_orders
      })

    const items = fulfillment.items.map((i) => {
      const shopifyId = order.items.find((li) => li.id === i.item_id).metadata
        .sh_id
      return { id: shopifyId, quantity: i.quantity }
    })

    const fulfillmentObject = {
      fulfillment: {
        location_id: fulfillmentOrders[0].assigned_location_id,
        line_items: items,
      },
    }

    const shId = await axios
      .post(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/orders/${order.external_id}/fulfillments.json`,
        fulfillmentObject,
        {
          headers: {
            "X-Shopify-Access-Token": this.options.password,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        return res.data.fulfillment.id
      })
      .catch((err) => {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An error occured while attempting to issue a fulfillment create to Shopify: ${err.message}`
        )
      })

    await this.shopifyFulfillmentService_.addShopifyId(fulfillment_id, shId)
  }

  registerShopifyFulfillmentCancel = async ({ fulfillment_id }) => {
    const fulfillment = await this.fulfillmentService_.retrieve(fulfillment_id)

    await axios
      .post(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/fulfillments/${fulfillment.metadata.sh_id}/cancel.json`,
        {},
        {
          headers: {
            "X-Shopify-Access-Token": this.options.password,
          },
        }
      )
      .catch((err) => {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An error occured while attempting to issue a fulfillment cancel to Shopify: ${err.message}`
        )
      })
  }

  getLocationId_(returnItem, fulfillmentOrders = []) {
    for (const f of fulfillmentOrders) {
      const check = f.line_items.find(
        (i) => i.line_item_id === returnItem.metadata.sh_id
      )
      if (check) {
        return f.assigned_location_id
      }
    }
  }
}

export default ShopifySubscriber
