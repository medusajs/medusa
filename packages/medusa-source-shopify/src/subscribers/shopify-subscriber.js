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
      shopifyRedisService,
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

    this.redis_ = shopifyRedisService

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
        await this.redis_.addIgnore(
          fulfillment.metadata.sh_id,
          "order.fulfillment_updated"
        )
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

    await this.redis_.addIgnore(shId, "order.fulfillment_created")
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

    await this.redis_.addIgnore(id, "order.fulfillment_cancelled")
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

    await this.redis_.addIgnore(product.external_id, "product.updated")
  }

  registerVariantUpdate = async ({ id, fields }) => {
    const variant = await this.productVariantService_.retrieve(id, {
      relations: ["prices", "product"],
    })

    //Event was not emitted by update
    if (!fields) {
      return
    }

    const update = {
      variant: {
        id: variant.metadata.sh_id,
      },
    }

    if (fields.includes("title")) {
      update.variant.title = variant.title
    }

    if (fields.includes("allow_backorder")) {
      update.variant.inventory_police = variant.allow_backorder
        ? "continue"
        : "deny"
    }

    if (fields.includes("prices")) {
      update.variant.price = variant.prices[0].amount / 100
    }

    if (fields.includes("weight")) {
      update.variant.grams = variant.weight
    }

    await axios
      .put(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/variants/${variant.metadata.sh_id}.json`,
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

    await this.redis_.addIgnore(
      variant.metadata.sh_id,
      "product-variant.updated"
    )
  }

  registerVariantDelete = async ({ product_id, metadata }) => {
    const product = await this.productService_.retrieve(product_id)

    await axios
      .delete(
        `https://${this.options.domain}.myshopify.com/admin/api/2021-10/products/${product.external_id}/variants/${metadata.sh_id}.json`,
        {
          headers: {
            "X-Shopify-Access-Token": this.options.password,
          },
        }
      )
      .catch((err) => {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An error occured while attempting to issue a product variant delete to Shopify: ${err.message}`
        )
      })

    await this.redis_.addIgnore(metadata.sh_id, "product-variant.deleted")
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
