import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
import { INCLUDE_PRESENTMENT_PRICES } from "../utils/const"
import axios from "axios"

class ShopifyFulfillmentService extends BaseService {
  constructor(
    {
      manager,
      orderService,
      shopifyOrderService,
      shopifyClientService,
      fulfillmentRepository,
      fulfillmentService,
      shopifyRedisService,
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

    this.redis_ = shopifyRedisService
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
      shopifyRedisService: this.redis_,
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

      const ignore = await this.redis_.shouldIgnore(
        id,
        "order.fulfillment_created"
      )
      if (ignore) {
        return
      }

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

      const ignore = await this.redis_.shouldIgnore(
        id,
        "order.fulfillment_updated"
      )
      if (ignore) {
        return
      }

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
        const ignore = await this.redis_.shouldIgnore(
          id,
          "order.fulfillment_cancelled"
        )
        if (ignore) {
          return
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

  async shopifyFulfillmentCreate(orderId, fulfillmentId) {
    const fulfillment = await this.fulfillmentService_.retrieve(fulfillmentId)
    const order = await this.orderService_.retrieve(orderId, {
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
    await this.addShopifyId(fulfillmentId, shId)
  }

  async shopifyFulfillmentCancel(id) {
    const fulfillment = await this.fulfillmentService_.retrieve(id)

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

    await this.redis_.addIgnore(
      fulfillment.metadata.sh_id,
      "order.fulfillment_cancelled"
    )
  }

  async shopifyShipmentCreate(id) {
    const fulfillment = await this.fulfillmentService_.retrieve(id, {
      relations: ["tracking_links"],
    })

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

      await this.redis_.addIgnore(
        fulfillment.metadata.sh_id,
        "order.fulfillment_updated"
      )
    }
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
