import axios from "axios"
import { MedusaError } from "medusa-core-utils"

class ShopifySubscriber {
  constructor(
    {
      eventBusService,
      returnService,
      fulfillmentService,
      shopifyFulfillmentService,
      productService,
      productVariantService,
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

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.orderService_ = orderService

    this.client_ = shopifyClientService

    eventBusService.subscribe("order.items_returned", this.registerReturn)

    eventBusService.subscribe(
      "order.fulfillment_created",
      this.registerFulfillmentCreate
    )

    eventBusService.subscribe(
      "order.fulfillment_canceled",
      this.registerFulfillmentCancel
    )

    eventBusService.subscribe("product.updated", this.registerProductUpdate)
  }

  /**
   * TODO
   */
  registerRefund = async ({}) => {}

  registerReturn = async ({ id, return_id }) => {
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

  registerShipmentCreate = async ({ fulfillment_id }) => {
    const fulfillment = await this.fulfillmentService_.retrieve(
      fulfillment_id,
      {
        relations: ["tracking_links"],
      }
    )

    const updateTracking = async (trackingObject) => {
      await axios.post(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/fulfillments/${fulfillment.metadata.sh_id}/update_tracking.json`,
        trackingObject,
        {
          headers: {
            "X-Shopify-Access-Token": this.options.password,
            "Content-Type": "application/json",
          },
        }
      )
    }

    for (const link of fulfillment.trackinkg_links) {
      let trackingObject = {
        fulfillment: {
          tracking_info: {
            number: link.number,
            url: link.url,
            company: "Other",
          },
        },
      }

      try {
        await updateTracking(trackingObject)
      } catch (err) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An error occured while attempting to update tracking information for fulfillment: ${err.message}`
        )
      }
    }
  }

  registerFulfillmentCreate = async ({ id, fulfillment_id }) => {
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

  registerFulfillmentCancel = async ({ fulfillment_id }) => {
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

  registerProductUpdate = async ({ id, fields }) => {
    const product = await this.productService_.retrieve(id, {
      relations: ["tags", "type"],
    })

    //Event was not emitted by update
    if (!fields) {
      return
    }

    const update = {
      product: {
        id: product.external_id,
      },
    }

    console.log(fields)

    if (fields.includes("title")) {
      update.product.title = product.title
    }

    if (fields.includes("tags")) {
      const values = product.tags.map((t) => t.value)
      update.product.tags = values.join(",")
    }

    if (fields.includes("description")) {
      update.product.body_html = product.description
    }

    if (fields.includes("handle")) {
      update.product.handle = product.handle
    }

    if (fields.includes("type")) {
      update.product.type = product.type?.value
    }

    await axios
      .put(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/products/${product.external_id}.json`,
        update,
        {
          headers: {
            "X-Shopify-Access-Token": this.options.password,
          },
        }
      )
      .catch((err) => {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An error occured while attempting to issue a product update to Shopify: ${err.message}`
        )
      })
  }

  registerVariantUpdate = async ({ id, fields }) => {
    const product = await this.productVariantService_.retrieve(id)

    if (fields.includes("weight")) {
      update.product.grams = product.weight
    }
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
