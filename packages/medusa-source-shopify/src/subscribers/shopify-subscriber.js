import axios from "axios"
import { createClient } from "../utils/create-client"

class ShopifySubscriber {
  constructor({ eventBusService, returnService, orderService }, options) {
    this.client_ = createClient(options)

    this.eventBusService_ = eventBusService

    this.returnService_ = returnService

    this.orderService_ = orderService

    eventBusService.subscribe(
      "order.items_returned",
      this.registerShopifyReturn
    )
  }

  getStoreLocation() {
    return `65350402255`
  }

  registerShopifyReturn = async ({ id, return_id }) => {
    const ret = await this.returnService_.retrieve(return_id)
    const order = await this.orderService_.retrieve(id, {
      relations: ["payments"],
    })

    const shopifyPayment = order.payments[0]

    const refundItems = ret.items.map((ri) => ({
      line_item_id: ri.item_id,
      quantity: ri.quantity,
      restock_type: "return",
      location_id: this.getStoreLocation(),
    }))

    const transactions = [
      {
        amount: ret.refund_amount,
        kind: "refund",
        // Include transaction_id and gateway when creating orders in the source plugin
        parent_id: shopifyPayment.data.transaction_id,
        gateway: shopifyPayment.data.gateway,
      },
    ]

    const refundObject = {
      currency: ret.order.currency_code.toUpperCase(),
      note: "Medusa Commerce",
      refund_line_items: refundItems,
      transactions,
    }

    return await this.client_.post({
      path: `/orders/${order.id}/transactions`,
      data: refundObject,
    })
  }
}

export default ShopifySubscriber
