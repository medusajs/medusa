import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

/**
 * Handles swaps
 * @implements BaseService
 */
class DraftOrderService extends BaseService {
  static Events = {
    CREATED: "draft_order.created",
  }

  constructor({
    manager,
    draftOrderRepository,
    eventBusService,
    addressRepository,
    cartService,
    totalsService,
    lineItemService,
    productVariantService,
    shippingOptionService,
    regionService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {SwapModel} */
    this.draftOrderRepository_ = draftOrderRepository

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {AddressRepository} */
    this.addressRepository_ = addressRepository

    /** @private @const {LineItemService} */
    this.lineItemService_ = lineItemService

    /** @private @const {ReturnService} */
    this.returnService_ = returnService

    /** @private @const {CartService} */
    this.cartService_ = cartService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {ShippingOptionService} */
    this.shippingOptionService_ = shippingOptionService

    /** @private @const {EventBusService} */
    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new DraftOrderService({
      manager: transactionManager,
      draftOrderRepository: this.draftOrderRepository_,
      eventBusService: this.eventBus_,
      cartService: this.cartService_,
      totalsService: this.totalsService_,
      productVariantService: this.productVariantService_,
      lineItemService: this.lineItemService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Retrieves a draft order with the given id.
   * @param {string} id - id of the draft order to retrieve
   * @return {Promise<DraftOrder>} the draft order
   */
  async retrieve(id, config = {}) {
    const draftOrderRepo = this.manager_.getCustomRepository(
      this.draftOrderRepository_
    )

    const validatedId = this.validateId_(id)

    const query = this.buildQuery_({ id: validatedId }, config)

    const draftOrder = await draftOrderRepo.findOne(query)

    if (!draftOrder) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Draft order with id: ${id} was not found`
      )
    }

    return draftOrder
  }

  /**
   * Retrieves a draft order based on its associated cart id
   * @param {string} cartId - cart id that the draft orders's cart has
   * @return {Promise<DraftOrder>} the draft order
   */
  async retrieveByCartId(cartId, relations = []) {
    const draftOrderRepo = this.manager_.getCustomRepository(
      this.draftOrderRepository_
    )

    const draftOrder = await draftOrderRepo.findOne({
      where: {
        cart_id: cartId,
      },
      relations,
    })

    if (!draftOrder) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Draft order was not found`
      )
    }

    return draftOrder
  }

  /**
   * Lists draft orders
   * @param {Object} selector - query object for find
   * @param {Object} config - configurable attributes for find
   * @return {Promise<Array<DraftOrder>>} list of draft orders
   */
  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const draftOrderRepo = this.manager_.getCustomRepository(
      this.draftOrderRepository_
    )

    const query = this.buildQuery_(selector, config)

    return draftOrderRepo.find(query)
  }

  async setAddress_(region, address) {
    const addressRepo = this.manager_.getCustomRepository(
      this.addressRepository_
    )

    const regCountries = region.countries.map(({ iso_2 }) => iso_2)

    if (!address.country_code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Address is missing country code`
      )
    }

    if (!regCountries.includes(address.country_code)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Country ${address.country_code} is not in region ${region.name}`
      )
    }

    const created = addressRepo.create(adress)
    return created
  }

  /**
   * Confirms if the contents of a line item is covered by the inventory.
   * To be covered a variant must either not have its inventory managed or it
   * must allow backorders or it must have enough inventory to cover the request.
   * If the content is made up of multiple variants it will return true if all
   * variants can be covered. If the content consists of a single variant it will
   * return true if the variant is covered.
   * @param {(LineItemContent | LineItemContentArray)} - the content of the line
   *     item
   * @param {number} - the quantity of the line item
   * @return {boolean} true if the inventory covers the line item.
   */
  async confirmInventory_(variantId, quantity) {
    // If the line item is not stock tracked we don't have double check it
    if (!variantId) {
      return true
    }

    return this.productVariantService_.canCoverQuantity(variantId, quantity)
  }

  async addLineItem(doId, lineItem) {
    return this.atomicPhase_(async manager => {
      const draftOrder = await this.retrieve(doId, {
        relations: [
          "shipping_methods",
          "items",
          "payment_sessions",
          "items.variant",
          "items.variant.product",
        ],
      })

      if (draftOrder.status !== "open") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You are not allowed to add items to a draft order with status awaiting or completed"
        )
      }

      let currentItem
      if (lineItem.should_merge) {
        currentItem = draftOrder.items.find(line => {
          if (line.should_merge && line.variant_id === lineItem.variant_id) {
            return _.isEqual(line.metadata, lineItem.metadata)
          }
        })
      }

      // If content matches one of the line items currently in the cart we can
      // simply update the quantity of the existing line item
      if (currentItem) {
        const newQuantity = currentItem.quantity + lineItem.quantity

        // Confirm inventory
        const hasInventory = await this.confirmInventory_(
          lineItem.variant_id,
          newQuantity
        )

        if (!hasInventory) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Inventory doesn't cover the desired quantity"
          )
        }

        await this.lineItemService_
          .withTransaction(manager)
          .update(currentItem.id, {
            quantity: newQuantity,
          })
      } else {
        // Confirm inventory
        const hasInventory = await this.confirmInventory_(
          lineItem.variant_id,
          lineItem.quantity
        )

        if (!hasInventory) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Inventory doesn't cover the desired quantity"
          )
        }

        await this.lineItemService_.withTransaction(manager).create({
          ...lineItem,
          has_shipping: false,
          cart_id: cartId,
        })
      }
    })
  }

  /**
   * Creates a draft order.
   * @param {Object} data - data to create draft order from
   * @return {Promise<DraftOrder>} the created draft order
   */
  async create(data) {
    return this.atomicPhase_(async manager => {
      const draftOrderRepo = manager.getCustomRepository(
        this.draftOrderRepository_
      )

      if (!data.region_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `region_id is required to create a draft order`
        )
      }

      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(data.region_id, {
          relations: ["countries"],
        })

      if (!data.shipping_address && !data.shipping_address_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Shipping addresss is required to create a draft order`
        )
      }

      if (data.shipping_address && !data.shipping_address_id) {
        data.shipping_address = await this.setAddress_(
          region,
          data.shipping_address
        )
      }

      if (data.billing_address && !data.billing_address_id) {
        data.billing_address = await this.setAddress_(
          region,
          data.billing_address
        )
      }

      const { items, shipping_methods, ...rest } = data

      const draftOrder = draftOrderRepo.create(rest)
      const result = await draftOrderRepo.save(draftOrder)

      await this.eventBus_
        .withTransaction(manager)
        .emit(DraftOrderService.Events.CREATED, {
          id: result.id,
        })

      let shippingMethods = []
      for (const method of shipping_methods) {
        const m = await this.shippingOptionService_
          .withTransaction(manager)
          .createShippingMethod(method.option_id, method.data, {
            draft_order_id: draftOrder.id,
          })

        shippingMethods.push(m)
      }

      for (const item of items) {
        const line = await this.lineItemService_
          .withTransaction(manager)
          .generate(
            item.variant_id,
            cart.region_id,
            item.quantity,
            item.metadata
          )

        await this.lineItemService_
          .withTransaction(manager)
          .create({ draft_order_id: draftOrder.id, ...line })
      }

      return result
    })
  }
}

export default DraftOrderService
