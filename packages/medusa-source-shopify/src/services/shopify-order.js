import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { parsePrice } from "../utils/parse-price"

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
   * @param {object} order
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
   * @param {object} order
   */
  async update(data) {
    return this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(data.id, {
        relations: ["items", "shipping_address"],
      })

      const { refunds, shipping_address } = data
      const shippingAddress = this.normalizeBilling_(shipping_address)

      let update = {
        metadata: { ...order.metadata },
      }

      /**
       * Every time an item's quantity is adjusted down, it creates a refund object,
       * this is also the case for monetary changes to the order. To prevent handling
       * the refunds multiple times we keep track of which has been handled.
       */
      let sh_refunds =
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
          await this.lineItemService_
            .withTransaction(manager)
            .update({ item_id: item.id, quantity: match.fulfillable_quantity })
        } else if (match.fulfillable_quantity === 0) {
          await this.lineItemService_.withTransaction(manager).delete(item.id)
          sh_deleted_items.push(match.id)
        } else if (match && match.quantity !== item.quantity) {
          await this.lineItemService_
            .withTransaction(manager)
            .update({ item_id: item.id, quantity: match.quantity })
        }
      }

      for (const item of data.line_items) {
        const match = order.items.find((i) => i.metadata.sh_id === item.id)
        if (!match && !sh_deleted_items.includes(item.id)) {
          await this.lineItemService_
            .withTransaction(manager)
            .create(order.id, item)
        }
      }

      for (const refund of refunds) {
        if (!sh_refunds.includes(refund.id)) {
          for (const refundLine of refund.refund_line_items) {
            const match = order.items.find(
              (i) => i.metadata.sh_id === refundLine.line_item_id
            )

            const newQuantity = match.quantity - refundLine.quantity
            if (newQuantity > 0) {
              await this.lineItemService_
                .withTransaction(manager)
                .update({ item_id: match.id, quantity: newQuantity })
            } else {
              await this.lineItemService_
                .withTransaction(manager)
                .delete(match.id)

              sh_deleted_items.push(match.metadata.sh_id)
            }
          }
          sh_refunds.push(refund.id)
        }
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
    })
  }

  /**
   * Deletes an order based on an event from Shopify.
   * @param {object} order
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
   * @returns
   */
  async archive(id) {
    return this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(id)
      return await this.orderService_.withTransaction(manager).archive(order.id)
    })
  }

  /**
   * Handles a refund issued through Shopify. Refunds cover both
   * actual refunds and line item removals or quantity adjustments.
   * @param {object} refund
   */
  async refund(refund) {
    if ("refund_line_items" in refund) {
    }

    if ("order_adjustments" in refund) {
    }

    return Promise.resolve()
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
    const order = await this.retrieve(id)
    return await this.orderService_.withTransaction(manager).cancel(order.id)
  }

  async addShippingMethod_(shippingLine, orderId) {
    const soId = "so_01FHDK9JQ1PKBAK16AW01H8JBS" //temp

    return this.atomicPhase_(async (manager) => {
      await this.orderService_.withTransaction(manager).addShippingMethod(
        orderId,
        soId,
        {},
        {
          price: parsePrice(shippingLine.price),
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

      let items = []

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
