import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { parsePrice } from "../utils/parse-price"
import { MedusaError } from "medusa-core-utils"

class ShopifyOrderService extends BaseService {
  constructor(
    {
      manager,
      orderService,
      orderRepository,
      shopifyProviderService,
      regionService,
      shopifyCustomerService,
      shopifyLineItemService,
      shopifyRedisService,
      shopifyClientService,
    },
    options
  ) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {ShopifyLineItemService} */
    this.lineItemService_ = shopifyLineItemService
    /** @private @const {ShopifyProviderService} */
    this.paymentProvider = shopifyProviderService
    /** @private @const {ShopifyCustomerService} */
    this.customerService_ = shopifyCustomerService
    /** @private @const {RegionService} */
    this.regionService_ = regionService
    /** @private @const {OrderService} */
    this.orderService_ = orderService
    /** @private @const {OrderRepository} */
    this.orderRepository_ = orderRepository
    /** @private @const {ShopifyClientService} */
    this.redis_ = shopifyRedisService
    /** @private @const {ShopifyClientService} */
    this.client_ = shopifyClientService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyOrderService({
      manager: transactionManager,
      options: this.options,
      shopifyProvider: this.paymentRepository_,
      orderService: this.orderService_,
      shopifyCustomerService: this.customerService_,
      shopifyClientService: this.client_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Creates an order based on an event from Shopify.
   * @param {Object} data
   */
  async create(data) {
    return this.atomicPhase_(async (manager) => {
      const { id: customerId } = await this.customerService_
        .withTransaction(manager)
        .create(data)

      const normalized = await this.normalizeOrder_(data, customerId)

      if (!normalized) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An error occurred while normalizing the order`
        )
      }

      const order = await this.orderService_
        .withTransaction(manager)
        .create(normalized)

      for (const shippingLine of data.shipping_lines) {
        await this.addShippingMethod_(shippingLine, order.id)
      }

      const transactionResponse = await this.client_.get({
        path: `orders/${data.id}/transactions`,
      })

      const transactions = transactionResponse.body.transactions

      for (const transaction of transactions) {
        await this.paymentProvider.withTransaction(manager).createPayment({
          order_id: order.id,
          currency_code: transaction.currency.toLowerCase(),
          total: parsePrice(transaction.amount),
          data: {
            transaction_id: transaction.id,
            gateway: transaction.gateway,
          },
          status: transaction.status,
          processed_at: transaction.processed_at,
        })
      }

      return order
    })
  }

  /**
   * Updates an order based on an event from Shopify
   * @param {Object} data
   */
  async update(data) {
    return this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(data.id, {
        relations: ["items", "shipping_address", "payments"],
      }).catch((_) => undefined)

      if (!order) {
        // Update was issued before create from Shopify
        return
      }

      const { refunds, shipping_address } = data
      const shippingAddress = this.normalizeBilling_(shipping_address)

      const update = {
        metadata: { ...order.metadata },
      }

      /**
       * Every time an item's quantity is adjusted down, it creates a refund object,
       * this is also the case for monetary changes to the order. To prevent handling
       * the refunds multiple times we keep track of which has been handled.
       */
      const sh_refunds =
        order.metadata && order.metadata.sh_refunds
          ? order.metadata.sh_refunds
          : []

      /**
       * When an item is removed from an order it is still persisted in the line items.
       * Therefore, we need to keep track of removed items to prevent re-adding a item
       * on subsequent updates.
       */
      let sh_deleted_items =
        order.metadata && order.metadata.sh_deleted_items
          ? order.metadata.sh_deleted_items
          : []

      await this.orderService_
        .withTransaction(manager)
        .updateShippingAddress_(order, shippingAddress)

      for (const item of order.items) {
        const match = data.line_items.find((i) => i.id === item.metadata.sh_id)
        if (
          match.quantity > match.fulfillable_quantity &&
          match.fulfillable_quantity > 0
        ) {
          try {
            await this.lineItemService_.withTransaction(manager).update({
              item_id: item.id,
              quantity: match.fulfillable_quantity,
            })
          } catch (err) {
            console.log("tried updating:", err.message)
          }
        } else if (match.fulfillable_quantity === 0) {
          try {
            await this.lineItemService_.withTransaction(manager).delete(item.id)
            sh_deleted_items.push(match.id)
          } catch (err) {
            console.log("tried deleting", err.message)
          }
        } else if (match && match.quantity !== item.quantity) {
          try {
            await this.lineItemService_
              .withTransaction(manager)
              .update({ item_id: item.id, quantity: match.quantity })
          } catch (err) {
            console.log("tried updating", err.message)
          }
        }
      }

      for (const item of data.line_items) {
        const match = order.items.find((i) => i.metadata.sh_id === item.id)
        if (!match && !sh_deleted_items.includes(item.id)) {
          try {
            await this.lineItemService_
              .withTransaction(manager)
              .create(order.id, item)
          } catch (err) {
            console.log(err.message)
          }
        }
      }

      const unhandledRefunds = refunds.filter((r) => !sh_refunds.includes(r.id))

      for (const refund of unhandledRefunds) {
        const { refundId, itemIds } = await this.refund(order, refund)
        sh_refunds.push(refundId)
        sh_deleted_items = [...sh_deleted_items, ...itemIds]
      }

      if (data.email !== order.email) {
        update.email = data.email
      }

      if (!_.isEmpty(sh_refunds)) {
        update.metadata = { ...update.metadata, sh_refunds }
      }

      if (!_.isEmpty(sh_deleted_items)) {
        update.metadata = { ...update.metadata, sh_deleted_items }
      }

      if (!_.isEmpty(update)) {
        await this.orderService_
          .withTransaction(manager)
          .update(order.id, update)
      }

      await this.redis_.addIgnore(data.id, "shopify")
    })
  }

  async refund(order, refund) {
    return this.atomicPhase_(async (manager) => {
      const itemIds = []

      if ("refund_line_items" in refund) {
        for (const refundLine of refund.refund_line_items) {
          const match = order.items.find(
            (i) => i.metadata.sh_id === refundLine.line_item_id
          )

          const newQuantity = match.quantity - refundLine.quantity
          if (newQuantity > 0) {
            try {
              await this.lineItemService_
                .withTransaction(manager)
                .update({ item_id: match.id, quantity: newQuantity })
            } catch (err) {
              console.log("updating refund line", err.message)
            }
          } else {
            try {
              await this.lineItemService_
                .withTransaction(manager)
                .delete(match.id)
              itemIds.push(refundLine.line_item_id)
            } catch (err) {
              console.log("deleting refund line", err.message)
            }
          }
        }
      }

      if ("transactions" in refund) {
        let amount = 0
        for (const transaction of refund.transactions) {
          amount += parsePrice(transaction.amount)
        }

        if (amount > 0) {
          await this.orderService_
            .withTransaction(manager)
            .createRefund(order.id, amount, "other", refund.note)

          await this.redis_.addIgnore(order.id, "order.refund_created")
        }
      }

      return { refundId: refund.id, itemIds }
    })
  }

  /**
   * Deletes an order based on an event from Shopify.
   * @param {string} id
   */
  async delete(id) {
    return this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(id)
      await this.orderService_.withTransaction(manager).delete(order.id)
    })
  }

  /**
   * Archives an order based on an event from Shopify
   * @param {string} id
   * @return {Promise}
   */
  async archive(id) {
    return this.atomicPhase_(async (manager) => {
      const ignore = await this.redis_.shouldIgnore(id, "archive")
      if (ignore) {
        return
      }

      const order = await this.retrieve(id)
      return await this.orderService_.withTransaction(manager).archive(order.id)
    })
  }

  /**
   * Retrieves an order by Shopify Id
   * @param {string} shopifyId
   * @param {object} config
   */
  async retrieve(shopifyId, config = {}) {
    return await this.orderService_.retrieveByExternalId(shopifyId, config)
  }

  async cancel(id) {
    return this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(id)
      return await this.orderService_.withTransaction(manager).cancel(order.id)
    })
  }

  async addShippingMethod_(shippingLine, orderId) {
    return this.atomicPhase_(async (manager) => {
      await this.orderService_.withTransaction(manager).addShippingMethod(
        orderId,
        "shopify",
        {},
        {
          price: parsePrice(
            shippingLine.price / (1 + shippingLine.tax_lines[0].rate)
          ),
        }
      )

      return Promise.resolve()
    })
  }

  async getRegion_(countryCode) {
    try {
      return await this.regionService_.retrieveByCountryCode(
        countryCode.toLowerCase()
      )
    } catch (_err) {
      return null
    }
  }

  getTaxRate_(taxLines) {
    return taxLines[0].rate || 0
  }

  async normalizeOrder_(shopifyOrder, customerId) {
    return this.atomicPhase_(async (manager) => {
      const paymentStatus = this.normalizeOrderPaymentStatus_(
        shopifyOrder.financial_status
      )
      const fulfillmentStatus = this.normalizeOrderFulfilmentStatus_(
        shopifyOrder.fulfillment_status
      )

      const region = await this.getRegion_(
        shopifyOrder.shipping_address.country_code
      )

      const items = []

      for (const lineItem of shopifyOrder.line_items) {
        const normalized = await this.lineItemService_
          .withTransaction(manager)
          .normalizeLineItem(lineItem)
        items.push(normalized)
      }

      return {
        status: this.normalizeOrderStatus_(fulfillmentStatus, paymentStatus),
        region_id: region.id,
        email: shopifyOrder.email,
        customer_id: customerId,
        currency_code: shopifyOrder.currency.toLowerCase(),
        tax_rate: region.tax_rate,
        tax_total: parsePrice(shopifyOrder.total_tax),
        subtotal: shopifyOrder.subtotal_price,
        shipping_address: this.normalizeBilling_(shopifyOrder.shipping_address),
        billing_address: this.normalizeBilling_(shopifyOrder.billing_address),
        discount_total: shopifyOrder.total_discounts,
        fulfilment_status: fulfillmentStatus,
        payment_status: paymentStatus,
        items: items,
        external_id: shopifyOrder.id,
      }
    })
  }

  normalizeOrderStatus_(fulfillmentStatus, paymentStatus) {
    if (fulfillmentStatus === "fulfilled" && paymentStatus === "captured") {
      return "completed"
    } else {
      return "pending"
    }
  }

  normalizeOrderFulfilmentStatus_(fulfilmentStatus) {
    switch (fulfilmentStatus) {
      case null:
        return "not_fulfilled"
      case "fulfilled":
        return "fulfilled"
      case "partial":
        return "partially_fulfilled"
      case "restocked":
        return "returned"
      case "pending":
        return "not_fulfilled"
      default:
        return null
    }
  }

  normalizeOrderPaymentStatus_(financial_status) {
    switch (financial_status) {
      case "refunded":
        return "refunded"
      case "voided":
        return "canceled"
      case "partially_refunded":
        return "partially_refunded"
      case "partially_paid":
        return "not_paid"
      case "pending":
        return "not_paid"
      case "authorized":
        return "awaiting"
      case "paid":
        return "captured"
      default:
        return null
    }
  }

  normalizeBilling_(shopifyAddress) {
    return {
      first_name: shopifyAddress.first_name,
      last_name: shopifyAddress.last_name,
      phone: shopifyAddress.phone,
      company: shopifyAddress.company,
      address_1: shopifyAddress.address1,
      address_2: shopifyAddress.address2,
      city: shopifyAddress.city,
      postal_code: shopifyAddress.zip,
      country_code: shopifyAddress.country_code.toLowerCase(),
      province: shopifyAddress.province_code,
    }
  }
}

export default ShopifyOrderService
