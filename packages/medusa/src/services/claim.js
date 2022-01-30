import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class ClaimService extends BaseService {
  static Events = {
    CREATED: "claim.created",
    UPDATED: "claim.updated",
    CANCELED: "claim.canceled",
    FULFILLMENT_CREATED: "claim.fulfillment_created",
    SHIPMENT_CREATED: "claim.shipment_created",
    REFUND_PROCESSED: "claim.refund_processed",
  }

  constructor({
    manager,
    addressRepository,
    claimItemService,
    claimRepository,
    eventBusService,
    fulfillmentProviderService,
    fulfillmentService,
    inventoryService,
    lineItemService,
    paymentProviderService,
    regionService,
    returnService,
    shippingOptionService,
    taxProviderService,
    totalsService,
  }) {
    super()

    /** @private @constant {EntityManager} */
    this.manager_ = manager

    this.addressRepo_ = addressRepository
    this.claimItemService_ = claimItemService
    this.claimRepository_ = claimRepository
    this.eventBus_ = eventBusService
    this.fulfillmentProviderService_ = fulfillmentProviderService
    this.fulfillmentService_ = fulfillmentService
    this.inventoryService_ = inventoryService
    this.lineItemService_ = lineItemService
    this.paymentProviderService_ = paymentProviderService
    this.regionService_ = regionService
    this.returnService_ = returnService
    this.shippingOptionService_ = shippingOptionService
    this.taxProviderService_ = taxProviderService
    this.totalsService_ = totalsService
  }

  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new ClaimService({
      manager,
      addressRepository: this.addressRepo_,
      claimItemService: this.claimItemService_,
      claimRepository: this.claimRepository_,
      eventBusService: this.eventBus_,
      fulfillmentProviderService: this.fulfillmentProviderService_,
      fulfillmentService: this.fulfillmentService_,
      inventoryService: this.inventoryService_,
      lineItemService: this.lineItemService_,
      paymentProviderService: this.paymentProviderService_,
      regionService: this.regionService_,
      returnService: this.returnService_,
      shippingOptionService: this.shippingOptionService_,
      totalsService: this.totalsService_,
      taxProviderService: this.taxProviderService_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  update(id, data) {
    return this.atomicPhase_(async (manager) => {
      const claimRepo = manager.getCustomRepository(this.claimRepository_)
      const claim = await this.retrieve(id, { relations: ["shipping_methods"] })

      if (claim.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled claim cannot be updated"
        )
      }

      const { claim_items, shipping_methods, metadata, no_notification } = data

      if (metadata) {
        claim.metadata = this.setMetadata_(claim, metadata)
        await claimRepo.save(claim)
      }

      if (shipping_methods) {
        for (const m of claim.shipping_methods) {
          await this.shippingOptionService_
            .withTransaction(manager)
            .updateShippingMethod(m.id, {
              claim_order_id: null,
            })
        }

        for (const method of shipping_methods) {
          if (method.id) {
            await this.shippingOptionService_
              .withTransaction(manager)
              .updateShippingMethod(method.id, {
                claim_order_id: claim.id,
              })
          } else {
            await this.shippingOptionService_
              .withTransaction(manager)
              .createShippingMethod(method.option_id, method.data, {
                claim_order_id: claim.id,
                price: method.price,
              })
          }
        }
      }

      if (no_notification !== undefined) {
        claim.no_notification = no_notification
        await claimRepo.save(claim)
      }

      if (claim_items) {
        for (const i of claim_items) {
          if (i.id) {
            await this.claimItemService_
              .withTransaction(manager)
              .update(i.id, i)
          }
        }
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimService.Events.UPDATED, {
          id: claim.id,
          no_notification: claim.no_notification,
        })

      return claim
    })
  }

  /**
   * Creates a Claim on an Order. Claims consists of items that are claimed and
   * optionally items to be sent as replacement for the claimed items. The
   * shipping address that the new items will be shipped to
   * @param {Object} data - the object containing all data required to create a claim
   * @return {Object} created claim
   */
  create(data) {
    return this.atomicPhase_(async (manager) => {
      const claimRepo = manager.getCustomRepository(this.claimRepository_)

      const {
        type,
        claim_items,
        order,
        return_shipping,
        additional_items,
        shipping_methods,
        refund_amount,
        shipping_address,
        shipping_address_id,
        no_notification,
        ...rest
      } = data

      for (const item of claim_items) {
        const line = await this.lineItemService_.retrieve(item.item_id, {
          relations: ["order", "swap", "claim_order", "tax_lines"],
        })

        if (
          line.order?.canceled_at ||
          line.swap?.canceled_at ||
          line.claim_order?.canceled_at
        ) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Cannot create a claim on a canceled item.`
          )
        }
      }

      let addressId = shipping_address_id || order.shipping_address_id
      if (shipping_address) {
        const addressRepo = manager.getCustomRepository(this.addressRepo_)
        const created = addressRepo.create(shipping_address)
        const saved = await addressRepo.save(created)
        addressId = saved.id
      }

      if (type !== "refund" && type !== "replace") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Claim type must be one of "refund" or "replace".`
        )
      }

      if (type === "replace" && !additional_items?.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Claims with type "replace" must have at least one additional item.`
        )
      }

      if (!claim_items?.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Claims must have at least one claim item.`
        )
      }

      if (refund_amount && type !== "refund") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Claim has type "${type}" but must be type "refund" to have a refund_amount.`
        )
      }

      let toRefund = refund_amount
      if (type === "refund" && typeof refund_amount === "undefined") {
        const lines = claim_items.map((ci) => {
          const orderItem = order.items.find((oi) => oi.id === ci.item_id)
          return {
            ...orderItem,
            quantity: ci.quantity,
          }
        })
        toRefund = await this.totalsService_.getRefundTotal(order, lines)
      }

      let newItems = []
      if (typeof additional_items !== "undefined") {
        for (const item of additional_items) {
          await this.inventoryService_
            .withTransaction(manager)
            .confirmInventory(item.variant_id, item.quantity)
        }

        newItems = await Promise.all(
          additional_items.map((i) =>
            this.lineItemService_
              .withTransaction(manager)
              .generate(i.variant_id, order.region_id, i.quantity)
          )
        )

        for (const newItem of newItems) {
          await this.inventoryService_
            .withTransaction(manager)
            .adjustInventory(newItem.variant_id, -newItem.quantity)
        }
      }

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      const created = claimRepo.create({
        shipping_address_id: addressId,
        payment_status: type === "refund" ? "not_refunded" : "na",
        ...rest,
        refund_amount: toRefund,
        type,
        additional_items: newItems,
        order_id: order.id,
        no_notification: evaluatedNoNotification,
      })

      const result = await claimRepo.save(created)

      if (result.additional_items && result.additional_items.length) {
        const calcContext = this.totalsService_.getCalculationContext(order)
        const lineItems = await this.lineItemService_
          .withTransaction(manager)
          .list({
            id: result.additional_items.map((i) => i.id),
          })
        await this.taxProviderService_
          .withTransaction(manager)
          .createTaxLines(lineItems, calcContext)
      }

      if (shipping_methods) {
        for (const method of shipping_methods) {
          if (method.id) {
            await this.shippingOptionService_
              .withTransaction(manager)
              .updateShippingMethod(method.id, {
                claim_order_id: result.id,
              })
          } else {
            await this.shippingOptionService_
              .withTransaction(manager)
              .createShippingMethod(method.option_id, method.data, {
                claim_order_id: result.id,
                price: method.price,
              })
          }
        }
      }

      for (const ci of claim_items) {
        await this.claimItemService_.withTransaction(manager).create({
          ...ci,
          claim_order_id: result.id,
        })
      }

      if (return_shipping) {
        await this.returnService_.withTransaction(manager).create({
          order_id: order.id,
          claim_order_id: result.id,
          items: claim_items.map((ci) => ({
            item_id: ci.item_id,
            quantity: ci.quantity,
            metadata: ci.metadata,
          })),
          shipping_method: return_shipping,
          no_notification: evaluatedNoNotification,
        })
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimService.Events.CREATED, {
          id: result.id,
          no_notification: result.no_notification,
        })

      return result
    })
  }
  /**
   * @param {string} id - the object containing all data required to create a claim
   * @param {Object} config - config object
   * @param {Object | undefined}  config.metadata - config metadata
   * @param {boolean|undefined}  config.no_notification - config no notification
   * @return {Claim} created claim
   */
  createFulfillment(
    id,
    config = {
      metadata: {},
      no_notification: undefined,
    }
  ) {
    const { metadata, no_notification } = config

    return this.atomicPhase_(async (manager) => {
      const claim = await this.retrieve(id, {
        relations: [
          "additional_items",
          "additional_items.tax_lines",
          "shipping_methods",
          "shipping_methods.tax_lines",
          "shipping_address",
          "order",
          "order.billing_address",
          "order.discounts",
          "order.discounts.rule",
          "order.payments",
        ],
      })

      if (claim.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled claim cannot be fulfilled"
        )
      }

      const order = claim.order

      if (
        claim.fulfillment_status !== "not_fulfilled" &&
        claim.fulfillment_status !== "canceled"
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "The claim has already been fulfilled."
        )
      }

      if (claim.type !== "replace") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Claims with the type "${claim.type}" can not be fulfilled.`
        )
      }

      if (!claim.shipping_methods?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot fulfill a claim without a shipping method."
        )
      }

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : claim.no_notification

      const fulfillments = await this.fulfillmentService_
        .withTransaction(manager)
        .createFulfillment(
          {
            ...claim,
            email: order.email,
            payments: order.payments,
            discounts: order.discounts,
            currency_code: order.currency_code,
            tax_rate: order.tax_rate,
            region_id: order.region_id,
            display_id: order.display_id,
            billing_address: order.billing_address,
            items: claim.additional_items,
            shipping_methods: claim.shipping_methods,
            is_claim: true,
            no_notification: evaluatedNoNotification,
          },
          claim.additional_items.map((i) => ({
            item_id: i.id,
            quantity: i.quantity,
          })),
          { claim_order_id: id, metadata }
        )

      let successfullyFulfilled = []
      for (const f of fulfillments) {
        successfullyFulfilled = successfullyFulfilled.concat(f.items)
      }

      claim.fulfillment_status = "fulfilled"

      for (const item of claim.additional_items) {
        const fulfillmentItem = successfullyFulfilled.find(
          (f) => item.id === f.item_id
        )

        if (fulfillmentItem) {
          const fulfilledQuantity =
            (item.fulfilled_quantity || 0) + fulfillmentItem.quantity

          // Update the fulfilled quantity
          await this.lineItemService_.withTransaction(manager).update(item.id, {
            fulfilled_quantity: fulfilledQuantity,
          })

          if (item.quantity !== fulfilledQuantity) {
            claim.fulfillment_status = "requires_action"
          }
        } else {
          if (item.quantity !== item.fulfilled_quantity) {
            claim.fulfillment_status = "requires_action"
          }
        }
      }

      const claimRepo = manager.getCustomRepository(this.claimRepository_)
      const result = await claimRepo.save(claim)

      for (const fulfillment of fulfillments) {
        await this.eventBus_
          .withTransaction(manager)
          .emit(ClaimService.Events.FULFILLMENT_CREATED, {
            id: id,
            fulfillment_id: fulfillment.id,
            no_notification: claim.no_notification,
          })
      }

      return result
    })
  }

  async cancelFulfillment(fulfillmentId) {
    return this.atomicPhase_(async (manager) => {
      const canceled = await this.fulfillmentService_
        .withTransaction(manager)
        .cancelFulfillment(fulfillmentId)

      if (!canceled.claim_order_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Fufillment not related to a claim`
        )
      }

      const claim = await this.retrieve(canceled.claim_order_id)

      claim.fulfillment_status = "canceled"

      const claimRepo = manager.getCustomRepository(this.claimRepository_)
      const updated = await claimRepo.save(claim)
      return updated
    })
  }

  async processRefund(id) {
    return this.atomicPhase_(async (manager) => {
      const claim = await this.retrieve(id, {
        relations: ["order", "order.payments"],
      })

      if (claim.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled claim cannot be processed"
        )
      }

      if (claim.type !== "refund") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Claim must have type "refund" to create a refund.`
        )
      }

      if (claim.refund_amount) {
        await this.paymentProviderService_
          .withTransaction(manager)
          .refundPayment(claim.order.payments, claim.refund_amount, "claim")
      }

      claim.payment_status = "refunded"

      const claimRepo = manager.getCustomRepository(this.claimRepository_)
      const result = await claimRepo.save(claim)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimService.Events.REFUND_PROCESSED, {
          id,
          no_notification: result.no_notification,
        })

      return result
    })
  }

  async createShipment(
    id,
    fulfillmentId,
    trackingLinks,
    config = {
      metadata: {},
      no_notification: undefined,
    }
  ) {
    const { metadata, no_notification } = config

    return this.atomicPhase_(async (manager) => {
      const claim = await this.retrieve(id, {
        relations: ["additional_items"],
      })

      if (claim.canceled_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Canceled claim cannot be fulfilled as shipped"
        )
      }
      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : claim.no_notification

      const shipment = await this.fulfillmentService_
        .withTransaction(manager)
        .createShipment(fulfillmentId, trackingLinks, {
          metadata,
          no_notification: evaluatedNoNotification,
        })

      claim.fulfillment_status = "shipped"

      for (const i of claim.additional_items) {
        const shipped = shipment.items.find((si) => si.item_id === i.id)
        if (shipped) {
          const shippedQty = (i.shipped_quantity || 0) + shipped.quantity
          await this.lineItemService_.withTransaction(manager).update(i.id, {
            shipped_quantity: shippedQty,
          })

          if (shippedQty !== i.quantity) {
            claim.fulfillment_status = "partially_shipped"
          }
        } else {
          if (i.shipped_quantity !== i.quantity) {
            claim.fulfillment_status = "partially_shipped"
          }
        }
      }

      const claimRepo = manager.getCustomRepository(this.claimRepository_)
      const result = await claimRepo.save(claim)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimService.Events.SHIPMENT_CREATED, {
          id,
          fulfillment_id: shipment.id,
          no_notification: evaluatedNoNotification,
        })

      return result
    })
  }

  async cancel(id) {
    return this.atomicPhase_(async (manager) => {
      const claim = await this.retrieve(id, {
        relations: ["return_order", "fulfillments", "order", "order.refunds"],
      })
      if (claim.refund_amount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Claim with a refund cannot be canceled"
        )
      }

      if (claim.fulfillments) {
        for (const f of claim.fulfillments) {
          if (!f.canceled_at) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "All fulfillments must be canceled before the claim can be canceled"
            )
          }
        }
      }

      if (claim.return_order && claim.return_order.status !== "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Return must be canceled before the claim can be canceled"
        )
      }

      claim.fulfillment_status = "canceled"
      claim.canceled_at = new Date()

      const claimRepo = manager.getCustomRepository(this.claimRepository_)
      const result = await claimRepo.save(claim)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimService.Events.CANCELED, {
          id: result.id,
          no_notification: result.no_notification,
        })

      return result
    })
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config object containing query settings
   * @return {Promise} the result of the find operation
   */
  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const claimRepo = this.manager_.getCustomRepository(this.claimRepository_)
    const query = this.buildQuery_(selector, config)
    return claimRepo.find(query)
  }

  /**
   * Gets an order by id.
   * @param {string} claimId - id of order to retrieve
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Order>} the order document
   */
  async retrieve(claimId, config = {}) {
    const claimRepo = this.manager_.getCustomRepository(this.claimRepository_)
    const validatedId = this.validateId_(claimId)

    const query = this.buildQuery_({ id: validatedId }, config)
    const claim = await claimRepo.findOne(query)

    if (!claim) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Claim with ${claimId} was not found`
      )
    }

    return claim
  }

  /**
   * Dedicated method to delete metadata for an order.
   * @param {string} orderId - the order to delete metadata from.
   * @param {string} key - key for metadata field
   * @return {Promise} resolves to the updated result.
   */
  async deleteMetadata(orderId, key) {
    const validatedId = this.validateId_(orderId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.orderModel_
      .updateOne({ _id: validatedId }, { $unset: { [keyPath]: "" } })
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default ClaimService
