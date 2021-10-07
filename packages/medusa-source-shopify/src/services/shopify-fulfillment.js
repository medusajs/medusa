import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
import { INCLUDE_PRESENTMENT_PRICES } from "../utils/const"
import { MedusaErrorTypes } from "medusa-core-utils/dist/errors"

class ShopifyFulfillmentService extends BaseService {
  constructor(
    {
      manager,
      orderService,
      shopifyOrderService,
      shopifyClientService,
      fulfillmentRepository,
      fulfillmentService,
    },
    options
  ) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {FulfillmentRepository} */
    this.fulfillmentRepository_ = fulfillmentRepository
    /** @private @const {FulfillmentService} */
    this.fulfillmentService_ = fulfillmentService
    /** @private @const {ShopifyOrderService} */
    this.shopifyOrderService_ = shopifyOrderService
    /** @private @const {ShopifyOrderService} */
    this.orderService_ = orderService
    /** @private @const {ShopifyRestClient} */
    this.client_ = shopifyClientService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyFulfillmentService({
      manager: transactionManager,
      options: this.options,
      orderService: this.orderService_,
      shopifyClientService: this.client_,
      shopifyOrderService: this.shopifyOrderService_,
      fulfillmentRepository: this.fulfillmentRepository_,
      fulfillmentService: this.fulfillmentService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Creates a fulfillment based on an event from Shopify.
   * @param {object} data
   * @returns {Fulfillment}
   */
  async create(data) {
    return this.atomicPhase_(async (manager) => {
      const {
        id,
        order_id,
        line_items,
        tracking_number,
        tracking_numbers,
        tracking_url,
        tracking_urls,
      } = data
      let order = await this.shopifyOrderService_
        .retrieve(order_id, {
          relations: ["items", "fulfillments"],
        })
        .catch((_) => undefined)

      // if order occured before we began listening for orders to the shop
      if (!order) {
        const shopifyOrder = this.client_.get({
          path: `orders/${order_id}`,
          extraHeaders: INCLUDE_PRESENTMENT_PRICES,
        })
        order = await this.shopifyOrderService_
          .withTransaction(manager)
          .create(shopifyOrder)
      }

      const fulfillmentExists = order.fulfillments.find(
        (f) => f.metadata.sh_id === id
      )

      if (fulfillmentExists) {
        //if this is the case then the fulfillment was created in Medusa
        //and we simply skip it.
        return Promise.resolve()
      }

      const itemsToFulfill = line_items.map((l) => {
        const match = order.items.find((i) => i.variant.sku === l.sku)

        if (!match) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Error on line item ${l.id}. Missing SKU. Product variants are required to have a SKU code.`
          )
        }

        return { item_id: match.id, quantity: l.quantity }
      })

      return await this.orderService_
        .withTransaction(manager)
        .createFulfillment(order.id, itemsToFulfill, {
          metadata: {
            sh_id: id,
            tracking_number,
            tracking_numbers,
            tracking_url,
            tracking_urls,
          },
        })
    })
  }

  /**
   * Updates a fulfillment based on an event from Shopify
   * @returns {Fulfillment}
   */
  async update(data) {
    return this.atomicPhase_(async (manager) => {
      const {
        id,
        order_id,
        status,
        tracking_number,
        tracking_numbers,
        tracking_url,
        tracking_urls,
      } = data

      let order = await this.shopifyOrderService_
        .retrieve(order_id, {
          relations: ["fulfillments", "items"],
        })
        .catch((_) => undefined)

      if (!order) {
        const shopifyOrder = this.client_.get({
          path: `orders/${order_id}`,
          extraHeaders: INCLUDE_PRESENTMENT_PRICES,
        })
        order = await this.shopifyOrderService_.create(shopifyOrder)
      }

      const fulfillment = order.fulfillments.find(
        (f) => f.metadata.sh_id === id
      )

      if (!fulfillment) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Could not retrieve any fulfillments with sh_id: ${id}`
        )
      }

      if (status === "cancelled") {
        if (fulfillment.cancelled_at) {
          return Promise.resolve()
        }

        return await this.cancel_(fulfillment.id)
      }

      const trackingInfo = {
        tracking_number,
        tracking_numbers,
        tracking_url,
        tracking_urls,
      }

      const fulfillmentRepository = manager.getCustomRepository(
        this.fulfillmentRepository_
      )

      fulfillment.metadata = { ...fulfillment.metadata, ...trackingInfo }

      const result = await fulfillmentRepository.save(fulfillment)
      return result
    })
  }

  /**
   * Cancels a fulfillment
   * @param {string} fulfillmentId
   * @returns {Promise}
   */
  async cancel_(fulfillmentId) {
    return this.atomicPhase_(async (manager) => {
      await this.orderService_
        .withTransaction(manager)
        .cancelFulfillment(fulfillmentId)

      return Promise.resolve()
    })
  }

  async addShopifyId(fulfillmentId, shopifyId) {
    return this.atomicPhase_(async (manager) => {
      const fulfillmentRepository = manager.getCustomRepository(
        this.fulfillmentRepository_
      )

      const fulfillment = await this.fulfillmentService_.retrieve(fulfillmentId)

      fulfillment.metadata = { ...fulfillment.metadata, sh_id: shopifyId }

      const result = await fulfillmentRepository.save(fulfillment)
      return result
    })
  }
}

export default ShopifyFulfillmentService
