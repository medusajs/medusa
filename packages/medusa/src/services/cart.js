import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate carts.
 * @implements BaseService
 */
class CartService extends BaseService {
  static Events = {
    CUSTOMER_UPDATED: "cart.customer_updated",
    CREATED: "cart.created",
    UPDATED: "cart.updated",
  }

  constructor({
    manager,
    cartRepository,
    shippingMethodRepository,
    eventBusService,
    paymentProviderService,
    productService,
    productVariantService,
    regionService,
    lineItemService,
    shippingOptionService,
    shippingProfileService,
    customerService,
    discountService,
    giftCardService,
    totalsService,
    addressRepository,
    paymentSessionRepository,
    inventoryService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ShippingMethodRepository} */
    this.shippingMethodRepository_ = shippingMethodRepository

    /** @private @const {CartRepository} */
    this.cartRepository_ = cartRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {LineItemService} */
    this.lineItemService_ = lineItemService

    /** @private @const {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @const {ShippingProfileService} */
    this.shippingProfileService_ = shippingProfileService

    /** @private @const {CustomerService} */
    this.customerService_ = customerService

    /** @private @const {ShippingOptionService} */
    this.shippingOptionService_ = shippingOptionService

    /** @private @const {DiscountService} */
    this.discountService_ = discountService

    /** @private @const {GiftCardService} */
    this.giftCardService_ = giftCardService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {AddressRepository} */
    this.addressRepository_ = addressRepository

    /** @private @const {PaymentSessionRepository} */
    this.paymentSessionRepository_ = paymentSessionRepository

    /** @private @const {InventoryService} */
    this.inventoryService_ = inventoryService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new CartService({
      manager: transactionManager,
      cartRepository: this.cartRepository_,
      eventBusService: this.eventBus_,
      paymentProviderService: this.paymentProviderService_,
      paymentSessionRepository: this.paymentSessionRepository_,
      shippingMethodRepository: this.shippingMethodRepository_,
      productService: this.productService_,
      productVariantService: this.productVariantService_,
      regionService: this.regionService_,
      lineItemService: this.lineItemService_,
      shippingOptionService: this.shippingOptionService_,
      shippingProfileService: this.shippingProfileService_,
      customerService: this.customerService_,
      discountService: this.discountService_,
      totalsService: this.totalsService_,
      addressRepository: this.addressRepository_,
      giftCardService: this.giftCardService_,
      inventoryService: this.inventoryService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Used to validate cart ids. Throws an error if the cast fails
   * @param {string} rawId - the raw cart id to validate.
   * @return {string} the validated id
   */
  /**
   * Contents of a line item
   * @typedef {(object | array)} LineItemContent
   * @property {number} unit_price - the price of the content
   * @property {object} variant - the product variant of the content
   * @property {object} product - the product of the content
   * @property {number} quantity - the quantity of the content
   */

  /**
   * A collection of contents grouped in the same line item
   * @typedef {LineItemContent[]} LineItemContentArray
   */

  transformQueryForTotals_(config) {
    let { select, relations } = config

    if (!select) {
      return {
        select,
        relations,
        totalsToSelect: [],
      }
    }

    const totalFields = [
      "subtotal",
      "tax_total",
      "shipping_total",
      "discount_total",
      "gift_card_total",
      "total",
    ]

    const totalsToSelect = select.filter(v => totalFields.includes(v))
    if (totalsToSelect.length > 0) {
      const relationSet = new Set(relations)
      relationSet.add("items")
      relationSet.add("gift_cards")
      relationSet.add("discounts")
      relationSet.add("discounts.rule")
      relationSet.add("discounts.rule.valid_for")
      //relationSet.add("discounts.parent_discount")
      //relationSet.add("discounts.parent_discount.rule")
      //relationSet.add("discounts.parent_discount.regions")
      relationSet.add("shipping_methods")
      relationSet.add("region")
      relations = [...relationSet]

      select = select.filter(v => !totalFields.includes(v))
    }

    return {
      relations,
      select,
      totalsToSelect,
    }
  }

  async decorateTotals_(cart, totalsFields = []) {
    if (totalsFields.includes("shipping_total")) {
      cart.shipping_total = await this.totalsService_.getShippingTotal(cart)
    }
    if (totalsFields.includes("discount_total")) {
      cart.discount_total = await this.totalsService_.getDiscountTotal(cart)
    }
    if (totalsFields.includes("tax_total")) {
      cart.tax_total = await this.totalsService_.getTaxTotal(cart)
    }
    if (totalsFields.includes("gift_card_total")) {
      cart.gift_card_total = await this.totalsService_.getGiftCardTotal(cart)
    }
    if (totalsFields.includes("subtotal")) {
      cart.subtotal = await this.totalsService_.getSubtotal(cart)
    }
    if (totalsFields.includes("total")) {
      cart.total = await this.totalsService_.getTotal(cart)
    }
    return cart
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector, config = {}) {
    const cartRepo = this.manager_.getCustomRepository(this.cartRepository_)

    const query = {
      where: selector,
    }

    if (config.select) {
      query.select = config.select
    }

    if (config.relations) {
      query.relations = config.relations
    }

    return cartRepo.find(query)
  }

  /**
   * Gets a cart by id.
   * @param {string} cartId - the id of the cart to get.
   * @return {Promise<Cart>} the cart document.
   */
  async retrieve(cartId, options = {}) {
    const cartRepo = this.manager_.getCustomRepository(this.cartRepository_)
    const validatedId = this.validateId_(cartId)

    const { select, relations, totalsToSelect } = this.transformQueryForTotals_(
      options
    )

    const query = {
      where: { id: validatedId },
    }

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    }

    const rels = query.relations
    delete query.relations
    const raw = await cartRepo.findOneWithRelations(rels, query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Cart with ${cartId} was not found`
      )
    }

    const cart = await this.decorateTotals_(raw, totalsToSelect)
    return cart
  }

  /**
   * Creates a cart.
   * @param {Object} data - the data to create the cart with
   * @return {Promise} the result of the create operation
   */
  async create(data) {
    return this.atomicPhase_(async manager => {
      const cartRepo = manager.getCustomRepository(this.cartRepository_)
      const addressRepo = manager.getCustomRepository(this.addressRepository_)
      const { region_id } = data
      if (!region_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `A region_id must be provided when creating a cart`
        )
      }

      const region = await this.regionService_.retrieve(region_id, {
        relations: ["countries"],
      })

      const regCountries = region.countries.map(({ iso_2 }) => iso_2)

      if (data.email) {
        const customer = await this.createOrFetchUserFromEmail_(data.email)
        data.customer = customer
        data.customer_id = customer.id
        data.email = customer.email
      }

      if (data.shipping_address_id) {
        const addr = await addressRepo.findOne(data.shipping_address_id)
        data.shipping_address = addr
      }

      if (!data.shipping_address) {
        if (region.countries.length === 1) {
          // Preselect the country if the region only has 1
          // and create address entity
          data.shipping_address = addressRepo.create({
            country_code: regCountries[0],
          })
        }
      } else {
        if (!regCountries.includes(data.shipping_address.country_code)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Shipping country not in region"
          )
        }
      }

      const toCreate = {
        ...data,
        region_id: region.id,
      }

      const inProgress = await cartRepo.create(toCreate)
      const result = await cartRepo.save(inProgress)
      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.CREATED, {
          id: result.id,
        })
      return result
    })
  }

  /**
   * Removes a line item from the cart.
   * @param {string} cartId - the id of the cart that we will remove from
   * @param {LineItem} lineItemId - the line item to remove.
   * @retur {Promise} the result of the update operation
   */
  async removeLineItem(cartId, lineItemId) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: [
          "items",
          "items.variant",
          "items.variant.product",
          "payment_sessions",
        ],
      })

      const lineItem = cart.items.find(li => li.id === lineItemId)
      if (!lineItem) {
        return cart
      }

      // Remove shipping methods if they are not needed
      if (cart.shipping_methods && cart.shipping_methods.length) {
        for (const method of cart.shipping_methods) {
          await this.shippingOptionService_
            .withTransaction(manager)
            .deleteShippingMethod(method)
        }
      }

      for (const itm of cart.items) {
        await this.lineItemService_.withTransaction(manager).update(itm.id, {
          has_shipping: false,
        })
      }

      await this.lineItemService_.withTransaction(manager).delete(lineItem.id)

      const result = await this.retrieve(cartId)
      // Notify subscribers
      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, {
          id: result.id,
        })
      return result
    })
  }

  /**
   * Checks if a given line item has a shipping method that can fulfill it.
   * Returns true if all products in the cart can be fulfilled with the current
   * shipping methods.
   * @param {Cart} cart - the cart
   * @param {LineItem} lineItem - the line item
   * @return {boolean}
   */
  validateLineItemShipping_(shippingMethods, lineItem) {
    if (!lineItem.variant_id) {
      return true
    }

    if (
      shippingMethods &&
      shippingMethods.length &&
      lineItem.variant &&
      lineItem.variant.product
    ) {
      const productProfile = lineItem.variant.product.profile_id
      const selectedProfiles = shippingMethods.map(
        ({ shipping_option }) => shipping_option.profile_id
      )
      return selectedProfiles.includes(productProfile)
    }

    return false
  }

  /**
   * Adds a line item to the cart.
   * @param {string} cartId - the id of the cart that we will add to
   * @param {LineItem} lineItem - the line item to add.
   * @return {Promise} the result of the update operation
   */
  async addLineItem(cartId, lineItem) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: [
          "shipping_methods",
          "items",
          "payment_sessions",
          "items.variant",
          "items.variant.product",
        ],
      })

      let currentItem
      if (lineItem.should_merge) {
        currentItem = cart.items.find(line => {
          if (line.should_merge && line.variant_id === lineItem.variant_id) {
            return _.isEqual(line.metadata, lineItem.metadata)
          }
        })
      }

      // If content matches one of the line items currently in the cart we can
      // simply update the quantity of the existing line item
      if (currentItem) {
        const newQuantity = currentItem.quantity + lineItem.quantity
        // Confirm inventory or throw error
        await this.inventoryService_
          .withTransaction(manager)
          .confirmInventory(lineItem.variant_id, newQuantity)

        await this.lineItemService_
          .withTransaction(manager)
          .update(currentItem.id, {
            quantity: newQuantity,
          })
      } else {
        // Confirm inventory or throw error
        await this.inventoryService_
          .withTransaction(manager)
          .confirmInventory(lineItem.variant_id, lineItem.quantity)

        await this.lineItemService_.withTransaction(manager).create({
          ...lineItem,
          has_shipping: false,
          cart_id: cartId,
        })
      }

      for (const itm of cart.items) {
        await this.lineItemService_.withTransaction(manager).update(itm.id, {
          has_shipping: false,
        })
      }

      // Remove shipping methods
      if (cart.shipping_methods && cart.shipping_methods.length) {
        for (const method of cart.shipping_methods) {
          await this.shippingOptionService_
            .withTransaction(manager)
            .deleteShippingMethod(method)
        }
      }

      const result = await this.retrieve(cartId)
      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Updates a cart's existing line item.
   * @param {string} cartId - the id of the cart to update
   * @param {string} lineItemId - the id of the line item to update.
   * @param {LineItemUpdate} lineItem - the line item to update. Must include an id
   *    field.
   * @return {Promise} the result of the update operation
   */
  async updateLineItem(cartId, lineItemId, lineItemUpdate) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: ["items", "payment_sessions"],
      })

      // Ensure that the line item exists in the cart
      const lineItemExists = cart.items.find(i => i.id === lineItemId)
      if (!lineItemExists) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "A line item with the provided id doesn't exist in the cart"
        )
      }

      if (lineItemUpdate.quantity) {
        const hasInventory = await this.inventoryService_
          .withTransaction(manager)
          .confirmInventory(lineItemExists.variant_id, lineItemUpdate.quantity)

        if (!hasInventory) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Inventory doesn't cover the desired quantity"
          )
        }
      }

      await this.lineItemService_
        .withTransaction(manager)
        .update(lineItemId, lineItemUpdate)

      // Update the line item
      const result = await this.retrieve(cartId)
      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Ensures shipping total on cart is correct in regards to a potential free
   * shipping discount
   * If a free shipping is present, we set shipping methods price to 0
   * if a free shipping was present, we set shipping methods to original amount
   * @param {Cart} cart - the the cart to adjust free shipping for
   * @param {boolean} shouldAdd - flag to indicate, if we should add or remove
   */
  async adjustFreeShipping_(cart, shouldAdd) {
    if (cart.shipping_methods?.length) {
      // if any free shipping discounts, we ensure to update shipping method amount
      if (shouldAdd) {
        await Promise.all(
          cart.shipping_methods.map(async sm => {
            const smRepo = this.manager_.getCustomRepository(
              this.shippingMethodRepository_
            )

            const method = await smRepo.findOne({ where: { id: sm.id } })

            if (method) {
              method.price = 0
              await smRepo.save(method)
            }
          })
        )
      } else {
        await Promise.all(
          cart.shipping_methods.map(async sm => {
            const smRepo = this.manager_.getCustomRepository(
              this.shippingMethodRepository_
            )

            // if free shipping discount is removed, we adjust the shipping
            // back to its original amount
            sm.price = sm.shipping_option.amount
            await smRepo.save(sm)
          })
        )
      }
    }
  }

  async update(cartId, update) {
    return this.atomicPhase_(async manager => {
      const cartRepo = manager.getCustomRepository(this.cartRepository_)
      const cart = await this.retrieve(cartId, {
        select: [
          "subtotal",
          "tax_total",
          "shipping_total",
          "discount_total",
          "total",
        ],
        relations: [
          "items",
          "shipping_methods",
          "shipping_address",
          "billing_address",
          "gift_cards",
          "customer",
          "region",
          "payment_sessions",
          "region.countries",
          "discounts",
          "discounts.rule",
          "discounts.rule.valid_for",
          "discounts.regions",
        ],
      })

      if ("region_id" in update) {
        await this.setRegion_(cart, update.region_id, update.country_code)
      }

      if ("customer_id" in update) {
        await this.updateCustomerId_(cart, update.customer_id)
      } else {
        if ("email" in update) {
          const customer = await this.createOrFetchUserFromEmail_(update.email)
          cart.customer = customer
          cart.customer_id = customer.id
          cart.email = customer.email
        }
      }

      const addrRepo = manager.getCustomRepository(this.addressRepository_)
      if ("shipping_address_id" in update || "shipping_address" in update) {
        const address = update.shipping_address_id || update.shipping_address
        await this.updateShippingAddress_(cart, address, addrRepo)
      }

      if ("billing_address_id" in update || "billing_address" in update) {
        const address = update.billing_address_id || update.billing_address
        await this.updateBillingAddress_(cart, address, addrRepo)
      }

      if ("discounts" in update) {
        const previousDiscounts = cart.discounts
        cart.discounts = []

        for (const { code } of update.discounts) {
          await this.applyDiscount(cart, code)
        }

        const hasFreeShipping = cart.discounts.some(
          ({ rule }) => rule.type === "free_shipping"
        )

        // if we previously had a free shipping discount and then removed it,
        // we need to update shipping methods to original price
        if (
          previousDiscounts.some(({ rule }) => rule.type === "free_shipping") &&
          !hasFreeShipping
        ) {
          await this.adjustFreeShipping_(cart, false)
        }

        if (hasFreeShipping) {
          await this.adjustFreeShipping_(cart, true)
        }
      }

      if ("gift_cards" in update) {
        cart.gift_cards = []

        for (const { code } of update.gift_cards) {
          await this.applyGiftCard_(cart, code)
        }
      }

      if ("metadata" in update) {
        cart.metadata = this.setMetadata_(cart, update.metadata)
      }

      if ("context" in update) {
        const prevContext = cart.context || {}
        cart.context = {
          ...prevContext,
          ...update.context,
        }
      }

      if ("completed_at" in update) {
        cart.completed_at = update.completed_at
      }

      if ("payment_authorized_at" in update) {
        cart.payment_authorized_at = update.payment_authorized_at
      }

      const result = await cartRepo.save(cart)

      if ("email" in update || "customer_id" in update) {
        await this.eventBus_
          .withTransaction(manager)
          .emit(CartService.Events.CUSTOMER_UPDATED, result.id)
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)

      return result
    })
  }

  /**
   * Sets the customer id of a cart
   * @param {string} cartId - the id of the cart to add email to
   * @param {string} customerId - the customer to add to cart
   * @return {Promise} the result of the update operation
   */
  async updateCustomerId_(cart, customerId) {
    const customer = await this.customerService_
      .withTransaction(this.transactionManager_)
      .retrieve(customerId)

    cart.customer = customer
    cart.customer_id = customer.id
    cart.email = customer.email
  }

  /**
   * Creates or fetches a user based on an email.
   * @param {string} email - the email to use
   * @return {Promise} the resultign customer object
   */
  async createOrFetchUserFromEmail_(email) {
    const schema = Validator.string()
      .email()
      .required()
    const { value, error } = schema.validate(email.toLowerCase())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The email is not valid"
      )
    }

    let customer = await this.customerService_
      .withTransaction(this.transactionManager_)
      .retrieveByEmail(value)
      .catch(() => undefined)

    if (!customer) {
      customer = await this.customerService_
        .withTransaction(this.transactionManager_)
        .create({ email: value })
    }

    return customer
  }

  /**
   * Updates the cart's billing address.
   * @param {string} cartId - the id of the cart to update
   * @param {object} address - the value to set the billing address to
   * @return {Promise} the result of the update operation
   */
  async updateBillingAddress_(cart, addressOrId, addrRepo) {
    if (typeof addressOrId === `string`) {
      addressOrId = await addrRepo.findOne({
        where: { id: addressOrId },
      })
    }

    addressOrId.country_code = addressOrId.country_code.toLowerCase()

    if (addressOrId.id) {
      cart.billing_address_id = addressOrId.id
      cart.billing_address = addressOrId
    } else {
      if (cart.billing_address_id) {
        const addr = await addrRepo.findOne({
          where: { id: cart.billing_address_id },
        })

        await addrRepo.save({ ...addr, ...addressOrId })
      } else {
        const created = addrRepo.create({
          ...addressOrId,
        })

        cart.billing_address = created
      }
    }
  }

  /**
   * Updates the cart's shipping address.
   * @param {string} cartId - the id of the cart to update
   * @param {object} address - the value to set the shipping address to
   * @return {Promise} the result of the update operation
   */
  async updateShippingAddress_(cart, addressOrId, addrRepo) {
    if (typeof addressOrId === `string`) {
      addressOrId = await addrRepo.findOne({
        where: { id: addressOrId },
      })
    }

    addressOrId.country_code = addressOrId.country_code.toLowerCase()

    if (
      !cart.region.countries.find(
        ({ iso_2 }) => addressOrId.country_code === iso_2
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the cart region"
      )
    }

    if (addressOrId.id) {
      cart.shipping_address = addressOrId
      cart.shipping_address_id = addressOrId.id
    } else {
      if (cart.shipping_address_id) {
        const addr = await addrRepo.findOne({
          where: { id: cart.shipping_address_id },
        })

        await addrRepo.save({ ...addr, ...addressOrId })
      } else {
        const created = addrRepo.create({
          ...addressOrId,
        })

        cart.shipping_address = created
      }
    }
  }

  async applyGiftCard_(cart, code) {
    const giftCard = await this.giftCardService_.retrieveByCode(code)

    if (giftCard.is_disabled) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The gift card is disabled"
      )
    }

    if (giftCard.region_id !== cart.region_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The gift card cannot be used in the current region"
      )
    }

    // if discount is already there, we simply resolve
    if (cart.gift_cards.find(({ id }) => id === giftCard.id)) {
      return Promise.resolve()
    }

    cart.gift_cards = [...cart.gift_cards, giftCard]
  }

  /**
   * Updates the cart's discounts.
   * If discount besides free shipping is already applied, this
   * will be overwritten
   * Throws if discount regions does not include the cart region
   * @param {string} cartId - the id of the cart to update
   * @param {string} discountCode - the discount code
   * @return {Promise} the result of the update operation
   */
  async applyDiscount(cart, discountCode) {
    const discount = await this.discountService_.retrieveByCode(discountCode, [
      "rule",
      "rule.valid_for",
      "regions",
    ])

    const rule = discount.rule

    // if limit is set and reached, we make an early exit
    if (discount.usage_limit) {
      discount.usage_count = discount.usage_count || 0

      if (discount.usage_limit === discount.usage_count)
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Discount has been used maximum allowed times"
        )
    }

    const today = new Date()
    if (discount.starts_at > today) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Discount is not valid yet"
      )
    }

    if (discount.ends_at && discount.ends_at < today) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Discount is expired"
      )
    }

    let regions = discount.regions
    if (discount.parent_discount_id) {
      const parent = await this.discountService_.retrieve(
        discount.parent_discount_id,
        {
          relations: ["rule", "regions"],
        }
      )

      regions = parent.regions
    }

    if (discount.is_disabled) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The discount code is disabled"
      )
    }

    if (!regions.find(({ id }) => id === cart.region_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The discount is not available in current region"
      )
    }

    // if discount is already there, we simply resolve
    if (cart.discounts.find(({ id }) => id === discount.id)) {
      return Promise.resolve()
    }

    const toParse = [...cart.discounts, discount]

    let sawNotShipping = false
    const newDiscounts = toParse.map(d => {
      const drule = d.rule
      switch (drule.type) {
        case "free_shipping":
          if (d.rule.type === rule.type) {
            return discount
          }
          return d
        default:
          if (!sawNotShipping) {
            sawNotShipping = true
            if (rule.type !== "free_shipping") {
              return discount
            }
            return d
          }
          return null
      }
    })

    cart.discounts = newDiscounts.filter(Boolean)
  }

  /**
   * Removes a discount based on a discount code.
   * @param {string} cartId - the id of the cart to remove from
   * @param {string} code - the discount code to remove
   * @return {Promise<Cart>} the resulting cart
   */
  async removeDiscount(cartId, discountCode) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: [
          "discounts",
          "discounts.rule",
          "discounts.rule.valid_for",
          "payment_sessions",
          "shipping_methods",
        ],
      })

      if (cart.discounts.some(({ rule }) => rule.type === "free_shipping")) {
        await this.adjustFreeShipping_(cart, false)
      }

      cart.discounts = cart.discounts.filter(d => d.code !== discountCode)

      const cartRepo = manager.getCustomRepository(this.cartRepository_)

      const result = await cartRepo.save(cart)

      if (cart.payment_sessions?.length) {
        await this.setPaymentSessions(cartId)
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)

      return result
    })
  }

  /**
   * A payment method represents a way for the customer to pay. The payment
   * method will typically come from one of the payment sessions.
   * @typedef {object} PaymentMethod
   * @property {string} provider_id - the identifier of the payment method's
   *     provider
   * @property {object} data - the data associated with the payment method
   */

  /**
   * Updates the currently selected payment session.
   */
  async updatePaymentSession(cartId, update) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: ["payment_sessions"],
      })

      if (cart.payment_session) {
        await this.paymentProviderService_.updateSessionData(
          cart.payment_session,
          update
        )
      }

      const result = await this.retrieve(cart.id)

      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Authorizes a payment for a cart.
   * Will authorize with chosen payment provider. This will return
   * a payment object, that we will use to update our cart payment with.
   * Additionally, if the payment does not require more or fails, we will
   * set the payment on the cart.
   * @param {string} cartId - the id of the cart to authorize payment for
   * @param {object} context - object containing whatever is relevant for
   *    authorizing the payment with the payment provider. As an example,
   *    this could be IP address or similar for fraud handling.
   * @return {Promise<Cart>} the resulting cart
   */
  async authorizePayment(cartId, context = {}) {
    return this.atomicPhase_(async manager => {
      const cartRepository = manager.getCustomRepository(this.cartRepository_)

      const cart = await this.retrieve(cartId, {
        select: ["total"],
        relations: ["region", "payment_sessions"],
      })

      // If cart total is 0, we don't perform anything payment related
      if (cart.total <= 0) {
        cart.payment_authorized_at = new Date()
        return cartRepository.save(cart)
      }

      const session = await this.paymentProviderService_
        .withTransaction(manager)
        .authorizePayment(cart.payment_session, context)

      const freshCart = await this.retrieve(cart.id, {
        select: ["total"],
        relations: ["payment_sessions"],
      })

      if (session.status === "authorized") {
        const payment = await this.paymentProviderService_
          .withTransaction(manager)
          .createPayment(freshCart)

        freshCart.payment = payment
        freshCart.payment_authorized_at = new Date()
      }

      const updated = await cartRepository.save(freshCart)
      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, updated)
      return updated
    })
  }

  /**
   * Sets a payment method for a cart.
   * @param {string} cartId - the id of the cart to add payment method to
   * @param {PaymentMethod} paymentMethod - the method to be set to the cart
   * @returns {Promise} result of update operation
   */
  async setPaymentSession(cartId, providerId) {
    return this.atomicPhase_(async manager => {
      const psRepo = manager.getCustomRepository(this.paymentSessionRepository_)

      const cart = await this.retrieve(cartId, {
        select: [
          "total",
          "subtotal",
          "tax_total",
          "discount_total",
          "gift_card_total",
        ],
        relations: ["region", "region.payment_providers", "payment_sessions"],
      })

      // The region must have the provider id in its providers array
      if (
        providerId !== "system" &&
        !(
          cart.region.payment_providers.length &&
          cart.region.payment_providers.find(({ id }) => providerId === id)
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `The payment method is not available in this region`
        )
      }

      await Promise.all(
        cart.payment_sessions.map(ps => {
          return psRepo.save({ ...ps, is_selected: null })
        })
      )

      const sess = cart.payment_sessions.find(
        ps => ps.provider_id === providerId
      )

      sess.is_selected = true

      await psRepo.save(sess)

      const result = await this.retrieve(cartId)

      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    }, "SERIALIZABLE")
  }

  /**
   * Creates, updates and sets payment sessions associated with the cart. The
   * first time the method is called payment sessions will be created for each
   * provider. Additional calls will ensure that payment sessions have correct
   * amounts, currencies, etc. as well as make sure to filter payment sessions
   * that are not available for the cart's region.
   * @param {string} cartId - the id of the cart to set payment session for
   * @returns {Promise} the result of the update operation.
   */
  async setPaymentSessions(cartOrCartId) {
    return this.atomicPhase_(async manager => {
      const psRepo = manager.getCustomRepository(this.paymentSessionRepository_)

      let cartId =
        typeof cartOrCartId === `string` ? cartOrCartId : cartOrCartId.id
      const cart = await this.retrieve(cartId, {
        select: [
          "gift_card_total",
          "subtotal",
          "tax_total",
          "shipping_total",
          "discount_total",
          "total",
        ],
        relations: [
          "items",
          "discounts",
          "discounts.rule",
          "discounts.rule.valid_for",
          "gift_cards",
          "billing_address",
          "shipping_address",
          "region",
          "region.payment_providers",
          "payment_sessions",
          "customer",
        ],
      })

      const region = cart.region

      // If there are existing payment sessions ensure that these are up to date
      let seen = []
      if (cart.payment_sessions && cart.payment_sessions.length) {
        for (const session of cart.payment_sessions) {
          if (
            cart.total <= 0 ||
            !region.payment_providers.find(
              ({ id }) => id === session.provider_id
            )
          ) {
            await this.paymentProviderService_
              .withTransaction(manager)
              .deleteSession(session)
          } else {
            seen.push(session.provider_id)
            await this.paymentProviderService_
              .withTransaction(manager)
              .updateSession(session, cart)
          }
        }
      }

      if (cart.total > 0) {
        // If only one payment session exists, we preselect it
        if (region.payment_providers.length === 1 && !cart.payment_session) {
          const p = region.payment_providers[0]
          const sess = await this.paymentProviderService_
            .withTransaction(manager)
            .createSession(p.id, cart)

          sess.is_selected = true

          await psRepo.save(sess)
        } else {
          for (const provider of region.payment_providers) {
            if (!seen.includes(provider.id)) {
              await this.paymentProviderService_
                .withTransaction(manager)
                .createSession(provider.id, cart)
            }
          }
        }
      }
    })
  }

  /**
   * Removes a payment session from the cart.
   * @param {string} cartId - the id of the cart to remove from
   * @param {string} providerId - the id of the provider whoose payment session
   *    should be removed.
   * @returns {Promise<Cart>} the resulting cart.
   */
  async deletePaymentSession(cartId, providerId) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: ["payment_sessions"],
      })

      const cartRepo = manager.getCustomRepository(this.cartRepository_)

      if (cart.payment_sessions) {
        const session = cart.payment_sessions.find(
          ({ provider_id }) => provider_id === providerId
        )

        cart.payment_sessions = cart.payment_sessions.filter(
          ({ provider_id }) => provider_id !== providerId
        )

        if (session) {
          // Delete the session with the provider
          await this.paymentProviderService_
            .withTransaction(manager)
            .deleteSession(session)
        }
      }

      await cartRepo.save(cart)

      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, cart)
      return cart
    })
  }

  /**
   * Refreshes a payment session on a cart
   * @param {string} cartId - the id of the cart to remove from
   * @param {string} providerId - the id of the provider whoose payment session
   *    should be removed.
   * @returns {Promise<Cart>} the resulting cart.
   */
  async refreshPaymentSession(cartId, providerId) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: ["payment_sessions"],
      })

      if (cart.payment_sessions) {
        const session = cart.payment_sessions.find(
          ({ provider_id }) => provider_id === providerId
        )

        if (session) {
          // Delete the session with the provider
          await this.paymentProviderService_
            .withTransaction(manager)
            .refreshSession(session, cart)
        }
      }

      const result = await this.retrieve(cartId)

      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Adds the shipping method to the list of shipping methods associated with
   * the cart. Shipping Methods are the ways that an order is shipped, whereas a
   * Shipping Option is a possible way to ship an order. Shipping Methods may
   * also have additional details in the data field such as an id for a package
   * shop.
   * @param {string} cartId - the id of the cart to add shipping method to
   * @param {string} optionId - id of shipping option to add as valid method
   * @param {Object} data - the fulmillment data for the method
   * @return {Promise} the result of the update operation
   */
  async addShippingMethod(cartId, optionId, data) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        select: ["subtotal"],
        relations: [
          "shipping_methods",
          "discounts",
          "discounts.rule",
          "discounts.rule.valid_for",
          "shipping_methods.shipping_option",
          "items",
          "items.variant",
          "payment_sessions",
          "items.variant.product",
        ],
      })
      const { shipping_methods } = cart

      const newMethod = await this.shippingOptionService_
        .withTransaction(manager)
        .createShippingMethod(optionId, data, { cart })

      const methods = [newMethod]
      if (shipping_methods.length) {
        for (const sm of shipping_methods) {
          if (
            sm.shipping_option.profile_id ===
            newMethod.shipping_option.profile_id
          ) {
            await this.shippingOptionService_
              .withTransaction(manager)
              .deleteShippingMethod(sm)
          } else {
            methods.push(sm)
          }
        }
      }

      for (const item of cart.items) {
        await this.lineItemService_.withTransaction(manager).update(item.id, {
          has_shipping: this.validateLineItemShipping_(methods, item),
        })
      }

      const result = await this.retrieve(cartId, {
        relations: [
          "discounts",
          "discounts.rule",
          "discounts.rule.valid_for",
          "shipping_methods",
        ],
      })

      // if cart has freeshipping, adjust price
      if (result.discounts.some(({ rule }) => rule.type === "free_shipping")) {
        await this.adjustFreeShipping_(result, true)
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    }, "SERIALIZABLE")
  }

  /**
   * Set's the region of a cart.
   * @param {string} cartId - the id of the cart to set region on
   * @param {string} regionId - the id of the region to set the cart to
   * @return {Promise} the result of the update operation
   */
  async setRegion_(cart, regionId, countryCode) {
    if (cart.completed_at || cart.payment_authorized_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot change the region of a completed cart"
      )
    }

    // Set the new region for the cart
    const region = await this.regionService_.retrieve(regionId, {
      relations: ["countries"],
    })
    const addrRepo = this.manager_.getCustomRepository(this.addressRepository_)
    cart.region = region
    cart.region_id = region.id

    // If the cart contains items we want to change the unit_price field of each
    // item to correspond to the price given in the region
    if (cart.items.length) {
      cart.items = await Promise.all(
        cart.items
          .map(async item => {
            const availablePrice = await this.productVariantService_
              .getRegionPrice(item.variant_id, regionId)
              .catch(() => undefined)

            if (availablePrice !== undefined) {
              return this.lineItemService_
                .withTransaction(this.transactionManager_)
                .update(item.id, {
                  has_shipping: false,
                  unit_price: availablePrice,
                })
            } else {
              await this.lineItemService_
                .withTransaction(this.transactionManager_)
                .delete(item.id)
              return null
            }
          })
          .filter(Boolean)
      )
    }

    let shippingAddress = {}
    if (cart.shipping_address_id) {
      shippingAddress = await addrRepo.findOne({
        where: { id: cart.shipping_address_id },
      })
    }

    if (countryCode !== undefined) {
      if (
        !region.countries.find(
          ({ iso_2 }) => iso_2 === countryCode.toLowerCase()
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Country not available in region`
        )
      }

      const updated = {
        ...shippingAddress,
        country_code: countryCode.toLowerCase(),
      }

      await addrRepo.save(updated)
    } else {
      let updated = { ...shippingAddress }
      // If the country code of a shipping address is set we need to clear it
      if (!_.isEmpty(shippingAddress) && shippingAddress.country_code) {
        updated = {
          ...updated,
          country_code: null,
        }
      }

      // If there is only one country in the region preset it
      if (region.countries.length === 1) {
        updated = {
          ...updated,
          country_code: region.countries[0].iso_2,
        }
      }

      await this.updateShippingAddress_(cart, updated, addrRepo)
    }

    // Shipping methods are determined by region so the user needs to find a
    // new shipping method
    if (cart.shipping_methods && cart.shipping_methods.length) {
      const smRepo = this.manager_.getCustomRepository(
        this.shippingMethodRepository_
      )
      await smRepo.remove(cart.shipping_methods)
    }

    if (cart.discounts && cart.discounts.length) {
      const newDiscounts = cart.discounts.map(d => {
        if (d.regions.find(({ id }) => id === regionId)) {
          return d
        }
      })

      cart.discounts = newDiscounts.filter(d => !!d)
    }

    cart.gift_cards = []

    if (cart.payment_sessions && cart.payment_sessions.length) {
      await Promise.all(
        cart.payment_sessions.map(ps =>
          this.paymentProviderService_
            .withTransaction(this.manager_)
            .deleteSession(ps)
        )
      )
      cart.payment_sessions = []
      cart.payment_session = null
    }
  }

  /**
   * Deletes a cart from the database. Completed carts cannot be deleted.
   * @param {string} cartId - the id of the cart to delete
   * @returns {Promise<Cart?>} the deleted cart or undefined if the cart was
   *    not found.
   */
  async delete(cartId) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, {
        relations: [
          "items",
          "discounts",
          "discounts.rule",
          "discounts.rule.valid_for",
          "payment_sessions",
        ],
      })

      if (cart.completed_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Completed carts cannot be deleted"
        )
      }

      if (cart.payment_authorized_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't delete a cart with an authorized payment"
        )
      }

      const cartRepo = manager.getCustomRepository(this.cartRepository_)
      return cartRepo.remove(cartId)
    })
  }

  /**
   * Dedicated method to set metadata for a cart.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} cartId - the cart to apply metadata to.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  async setMetadata(cartId, key, value) {
    return this.atomicPhase_(async manager => {
      const cartRepo = manager.getCustomRepository(this.cartRepository_)

      const validatedId = this.validateId_(cartId)
      if (typeof key !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Key type is invalid. Metadata keys must be strings"
        )
      }

      const cart = await cartRepo.findOne(validatedId)

      const existing = cart.metadata || {}
      cart.metadata = {
        ...existing,
        [key]: value,
      }

      const result = await cartRepo.save(cart)
      this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Dedicated method to delete metadata for a cart.
   * @param {string} cartId - the cart to delete metadata from.
   * @param {string} key - key for metadata field
   * @return {Promise} resolves to the updated result.
   */
  async deleteMetadata(cartId, key) {
    return this.atomicPhase_(async manager => {
      const cartRepo = manager.getCustomRepository(this.cartRepository_)
      const validatedId = this.validateId_(cartId)

      if (typeof key !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Key type is invalid. Metadata keys must be strings"
        )
      }

      const cart = await cartRepo.findOne(validatedId)
      if (!cart) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Cart with id: ${validatedId} was not found`
        )
      }

      const updated = cart.metadata || {}
      delete updated[key]
      cart.metadata = updated

      const result = await cartRepo.save(cart)
      this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
  }
}

export default CartService
