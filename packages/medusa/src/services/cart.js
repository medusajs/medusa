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
    totalsService,
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

    /** @private @const {DiscountService} */
    this.totalsService_ = totalsService
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
      productService: this.productService_,
      productVariantService: this.productVariantService_,
      regionService: this.regionService_,
      lineItemService: this.lineItemService_,
      shippingOptionService: this.shippingOptionService_,
      shippingProfileService: this.shippingProfileService_,
      customerService: this.customerService_,
      discountService: this.discountService_,
      totalsService: this.totalsService_,
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

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.cartModel_.find(selector)
  }

  /**
   * Gets a cart by id.
   * @param {string} cartId - the id of the cart to get.
   * @return {Promise<Cart>} the cart document.
   */
  async retrieve(cartId, relations = []) {
    const cartRepo = this.manager_.getCustomRepository(this.cartRepository_)
    const validatedId = this.validateId_(cartId)
    const cart = await cartRepo.findOne({
      where: { id: validatedId },
      relations,
    })

    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Cart with ${cartId} was not found`
      )
    }

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
      const { region_id } = data
      if (!region_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `A region_id must be provided when creating a cart`
        )
      }

      const region = await this.regionService_.retrieve(region_id, [
        "countries",
      ])

      const regCountries = region.countries.map(
        ({ country_code }) => country_code
      )

      if (!data.shipping_address) {
        if (region.countries.length === 1) {
          // Preselect the country if the region only has 1
          data.shipping_address = {
            country_code: regCountries[0],
          }
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

      const inProgress = cartRepo.create(toCreate)
      const result = cartRepo.save(inProgress)
      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.CREATED, result)
      return result
    })
  }

  /**
   * Decorates a cart.
   * @param {Cart} cart - the cart to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Cart} return the decorated cart.
   */
  async decorate(cart, fields, expandFields = []) {
    const c = cart
    c.shipping_total = await this.totalsService_.getShippingTotal(cart)
    c.discount_total = await this.totalsService_.getDiscountTotal(cart)
    c.tax_total = await this.totalsService_.getTaxTotal(cart)
    c.subtotal = await this.totalsService_.getSubtotal(cart)
    c.total = await this.totalsService_.getTotal(cart)

    const final = await this.runDecorators_(c)
    return final
  }

  /**
   * Removes a line item from the cart.
   * @param {string} cartId - the id of the cart that we will remove from
   * @param {LineItem} lineItemId - the line item to remove.
   * @retur {Promise} the result of the update operation
   */
  async removeLineItem(cartId, lineItemId) {
    return this.atomicPhase_(async manager => {
      const smRepo = manager.getCustomRepository(this.shippingMethodRepository_)

      const cart = await this.retrieve(cartId, [
        "items",
        "items.variant",
        "items.variant.product",
      ])

      const lineItem = cart.items.find(li => li.id === lineItemId)
      if (!lineItem) {
        return cart
      }

      // Remove shipping methods if they are not needed
      if (cart.shipping_methods && cart.shipping_methods.length) {
        const method = cart.shipping_methods.find(
          m =>
            m.shipping_option.profile_id ===
            (lineItem.variant &&
              lineItem.variant.product &&
              lineItem.variant.product.profile_id)
        )
        if (method) {
          const filteredItems = cart.items.filter(i => i.id !== lineItemId)
          const hasItem = filteredItems.find(
            item => item.variant.product.profile_id === m.profile_id
          )

          if (!hasItem) {
            await smRepo.remove(method)
          }
        }
      }

      await this.lineItemService_.withTransaction(manager).delete(lineItem.id)

      const result = await this.retrieve(cartId)
      // Notify subscribers
      await this.eventBus_
        .withTransaction(manager)
        .emit(CartService.Events.UPDATED, result)
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
  async validateLineItemShipping_(shippingMethods, lineItem) {
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
   * @retur {Promise} the result of the update operation
   */
  async addLineItem(cartId, lineItem) {
    return this.atomicPhase_(async manager => {
      const cartRepo = manager.getCustomRepository(this.cartRepository_)
      const cart = await this.retrieve(cartId, [
        "shipping_methods",
        "shipping_methods.shipping_option",
        "items",
        "items.variant",
        "items.variant.product",
      ])

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

        lineItem.has_shipping = await this.validateLineItemShipping_(
          cart.shipping_methods,
          lineItem
        )

        await this.lineItemService_.withTransaction(manager).create({
          ...lineItem,
          cart_id: cartId,
        })
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
      const cart = await this.retrieve(cartId, ["items"])

      // Ensure that the line item exists in the cart
      const lineItemExists = cart.items.find(i => i.id === lineItemId)
      if (!lineItemExists) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "A line item with the provided id doesn't exist in the cart"
        )
      }

      if (lineItemUpdate.quantity) {
        const hasInventory = await this.confirmInventory_(
          lineItemExists.variant_id,
          lineItemUpdate.quantity
        )

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

  async update(cartId, update) {
    return this.atomicPhase_(async manager => {
      const cartRepo = manager.getCustomRepository(this.cartRepository_)
      const cart = await this.retrieve(cartId, [
        "shipping_address",
        "billing_address",
        "discounts",
        "discounts.regions",
      ])

      if ("region_id" in update) {
        await this.setRegion_(cart, update.region_id, update.country_code)
      }

      if ("customer_id" in update) {
        await this.updateCustomerId_(cart, update.customer_id)
      } else {
        if ("email" in update) {
          await this.updateEmail_(cart, update.email)
        }
      }

      if ("customer_id" in update) {
        await this.updateCustomerId_(cart, update.email)
      }

      if ("shipping_address" in update) {
        await this.updateShippingAddress_(cart, update.shipping_address)
      }

      if ("billing_address" in update) {
        await this.updateBillingAddress_(cart, update.billing_address)
      }

      if ("discounts" in update) {
        for (const { code } of update.discounts) {
          await this.applyDiscount_(cart, code)
        }
      }

      const result = await cartRepo.save(cart)

      if ("email" in update || "customer_id" in update) {
        await this.eventBus_
          .withTransaction(this.transactionManager_)
          .emit(CartService.Events.CUSTOMER_UPDATED, result)
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
    cart.customer_id = customer.id
    cart.email = customer.email
  }

  /**
   * Sets the email of a cart
   * @param {string} cartId - the id of the cart to add email to
   * @param {string} email - the email to add to cart
   * @return {Promise} the result of the update operation
   */
  async updateEmail_(cart, email) {
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
        .create({ email })
    }

    cart.email = value
    cart.customer_id = customer.id
  }

  /**
   * Updates the cart's billing address.
   * @param {string} cartId - the id of the cart to update
   * @param {object} address - the value to set the billing address to
   * @return {Promise} the result of the update operation
   */
  async updateBillingAddress_(cart, address) {
    const { value, error } = Validator.address().validate(address)
    if (error) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
    }

    value.country_code = address.country_code.toLowerCase()
    cart.billing_address = value
  }

  /**
   * Updates the cart's shipping address.
   * @param {string} cartId - the id of the cart to update
   * @param {object} address - the value to set the shipping address to
   * @return {Promise} the result of the update operation
   */
  async updateShippingAddress_(cart, address) {
    const { value, error } = Validator.address().validate(address)
    if (error) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
    }

    value.country_code = value.country_code.toLowerCase()

    const region = await this.regionService_.retrieve(cart.region_id, [
      "countries",
    ])
    if (
      !region.countries.find(
        ({ country_code }) => value.country_code === country_code
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the cart region"
      )
    }
    cart.shipping_address = value
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
  async applyDiscount(cartId, discountCode) {
    const cart = await this.retrieve(cartId)
    const discount = await this.discountService_.retrieveByCode(discountCode)

    if (discount.disabled) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The discount code is disabled"
      )
    }

    if (!discount.regions.includes(cart.region_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The discount is not available in current region"
      )
    }

    // if discount is already there, we simply resolve
    if (cart.discounts.includes(discount.id)) {
      return Promise.resolve()
    }

    // find the current discounts (if there)
    // partition them into shipping and other
    const [shippingDisc, otherDisc] = _.partition(
      cart.discounts,
      d => d.discount_rule.type === "free_shipping"
    )

    // if no shipping exists and the one to apply is shipping, we simply add it
    // else we remove the current shipping and add the other one
    if (
      shippingDisc.length === 0 &&
      discount.discount_rule.type === "free_shipping"
    ) {
      return this.cartModel_
        .updateOne(
          {
            id: cart.id,
          },
          {
            $push: { discounts: discount },
          },
          { session: this.current_session }
        )
        .then(result => {
          // Notify subscribers
          this.eventBus_.emit(CartService.Events.UPDATED, result)
          return result
        })
    } else if (
      shippingDisc.length > 0 &&
      discount.discount_rule.type === "free_shipping"
    ) {
      return this.cartModel_
        .updateOne(
          {
            id: cart.id,
          },
          {
            $pull: { discounts: { id: shippingDisc[0].id } },
            $push: { discounts: discount },
          },
          { session: this.current_session }
        )
        .then(result => {
          // Notify subscribers
          this.eventBus_.emit(CartService.Events.UPDATED, result)
          return result
        })
    }

    // replace the current discount if there, else add the new one
    if (otherDisc.length === 0) {
      return this.cartModel_
        .updateOne(
          {
            id: cart.id,
          },
          {
            $push: { discounts: discount },
          },
          { session: this.current_session }
        )
        .then(result => {
          // Notify subscribers
          this.eventBus_.emit(CartService.Events.UPDATED, result)
          return result
        })
    } else {
      return this.cartModel_
        .updateOne(
          {
            id: cart.id,
          },
          {
            $pull: { discounts: { id: otherDisc[0].id } },
            $push: { discounts: discount },
          },
          { session: this.current_session }
        )
        .then(result => {
          // Notify subscribers
          this.eventBus_.emit(CartService.Events.UPDATED, result)
          return result
        })
    }
  }

  async removeDiscount(cartId, discountCode) {
    const cart = await this.retrieve(cartId)
    return this.cartModel_.updateOne(
      { id: cart.id },
      {
        $pull: { discounts: { code: discountCode } },
      },
      { session: this.current_session }
    )
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
   * Retrieves an open payment session from the list of payment sessions
   * stored in the cart. If none is an INVALID_DATA error is thrown.
   * @param {string} cartId - the id of the cart to retrieve the session from
   * @param {string} providerId - the id of the provider the session belongs to
   * @return {PaymentMethod} the session
   */
  async retrievePaymentSession(cartId, providerId) {
    const cart = await this.retrieve(cartId)
    const session = cart.payment_sessions.find(
      ({ provider_id }) => provider_id === providerId
    )

    if (!session) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The provider_id did not match any open payment sessions`
      )
    }

    return session
  }

  /**
   * Updates the currently selected payment session.
   */
  async updatePaymentSession(cartId, update) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, ["payment_session"])

      await this.paymentProviderService_.updateSessionData(
        cart.payment_session,
        update
      )

      const result = await cartRepo.save(cart)
      await this.eventBus_
        .withTransaction(this.manager_)
        .emit(CartService.Events.UPDATED, result)
      return result
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
      const cartRepo = manager.getCustomRepository(this.cartRepository_)
      const cart = await this.retrieve(cartId, [
        "region",
        "region.payment_providers",
        "payment_sessions",
      ])

      // The region must have the provider id in its providers array
      if (
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

      const session = cart.payment_sessions.find(
        s => s.provider_id === providerId
      )

      cart.payment_session_id = session.id

      const result = await cartRepo.save(cart)
      await this.eventBus_
        .withTransaction(this.manager_)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
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
  async setPaymentSessions(cartId) {
    return this.atomicPhase_(async manager => {
      const cart = await this.retrieve(cartId, [
        "region",
        "region.payment_providers",
        "payment_sessions",
      ])
      const region = cart.region
      const total = await this.totalsService_.getTotal(cart)

      // If there are existing payment sessions ensure that these are up to date
      let seen = []
      if (cart.payment_sessions && cart.payment_sessions.length) {
        for (const session of cart.payment_sessions) {
          if (
            total === 0 ||
            !region.payment_providers.find(
              ({ id }) => id === session.provider_id
            )
          ) {
            await this.paymentProviderService_.deleteSession(session)
          } else {
            seen.push(session.provider_id)
            await this.paymentProviderService_.updateSession(session, cart)
          }
        }
      }

      for (const provider of region.payment_providers) {
        if (!seen.includes(provider.id)) {
          await this.paymentProviderService_.createSession(provider.id, cart)
        }
      }

      const result = await cartRepo.save(cart)
      await this.eventBus_
        .withTransaction(this.manager_)
        .emit(CartService.Events.UPDATED, result)
      return result
    })
  }

  async deletePaymentSession(cartId, providerId) {
    const cart = await this.retrieve(cartId)
    if (cart.payment_sessions) {
      const session = cart.payment_sessions.find(
        s => s.provider_id === providerId
      )

      if (session) {
        // Delete the session with the provider
        await this.paymentProviderService_.deleteSession(session)

        const selector = {
          $pull: { payment_sessions: { provider_id: providerId } },
        }

        if (
          cart.payment_method &&
          cart.payment_method.provider_id === providerId
        ) {
          selector["$set"] = { payment_method: null }
        }

        return this.cartModel_
          .updateOne({ id: cart.id }, selector, {
            session: this.current_session,
          })
          .then(result => {
            // Notify subscribers
            this.eventBus_.emit(CartService.Events.UPDATED, result)
            return result
          })
      }
    }

    return cart
  }

  async updatePaymentSession(cartId, providerId, data) {
    const cart = await this.retrieve(cartId)

    const provider = retrieveProvider()
    const newData = await provider.updatePayment(data)

    const newSession = {
      provider_id: providerId,
      data: session,
    }

    return this.cartModel_
      .updateOne(
        {
          id: cart.id,
          "payment_sessions.provider_id": providerId,
        },
        {
          $set: {
            "payment_sessions.$": {
              provider_id: providerId,
              data: newData,
            },
          },
        },
        { session: this.current_session }
      )
      .then(result => {
        console.log("Result: ", result)
        // Notify subscribers
        this.eventBus_.emit(CartService.Events.UPDATED, result)
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
    const cart = await this.retrieve(cartId)
    const { shipping_methods } = cart

    const option = await this.shippingOptionService_.validateCartOption(
      optionId,
      cart
    )

    option.data = await this.shippingOptionService_.validateFulfillmentData(
      optionId,
      data,
      cart
    )

    const profile = await this.shippingProfileService_.list({
      shipping_options: option.id,
    })
    if (profile.length !== 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping Method must belong to a shipping profile"
      )
    }

    option.profile_id = profile[0].id

    // Go through all existing selected shipping methods and update the one
    // that has the same profile as the selected shipping method.
    let exists = false
    const newMethods = shipping_methods.map(sm => {
      if (option.profile_id.equals(sm.profile_id)) {
        exists = true
        return option
      }

      return sm
    })

    // If none of the selected methods are for the same profile as the new
    // shipping method the exists flag will be false. Therefore we push the new
    // method.
    if (!exists) {
      newMethods.push(option)
    }

    const newItems = await Promise.all(
      cart.items.map(async item => {
        const hasShipping = await this.validateLineItemShipping_(
          newMethods,
          item
        )

        return {
          ...item,
          has_shipping: hasShipping,
        }
      })
    )

    return this.cartModel_
      .updateOne(
        {
          id: cart.id,
        },
        {
          $set: { shipping_methods: newMethods, items: newItems },
        },
        { session: this.current_session }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(CartService.Events.UPDATED, result)
        return result
      })
  }

  /**
   * Set's the region of a cart.
   * @param {string} cartId - the id of the cart to set region on
   * @param {string} regionId - the id of the region to set the cart to
   * @return {Promise} the result of the update operation
   */
  async setRegion_(cart, regionId, countryCode) {
    // Set the new region for the cart
    cart.region_id = regionId

    // If the cart contains items we want to change the unit_price field of each
    // item to correspond to the price given in the region
    if (cart.items.length) {
      for (const item of cart.items) {
        const availablePrice = await this.productVariantService_
          .getRegionPrice(item.variant_id, regionId)
          .catch(() => undefined)

        if (availablePrice !== undefined) {
          await this.lineItemService_
            .withTransaction(this.transactionManager_)
            .update(item.id, {
              has_shipping: false,
              unit_price: availablePrice,
            })
        } else {
          await this.lineItemService_
            .withTransaction(this.transactionManager_)
            .delete(item.id)
        }
      }
    }

    let shippingAddress = cart.shipping_address || {}
    const region = await this.regionService_.retrieve(regionId, ["countries"])
    if (countryCode !== undefined) {
      if (
        !region.countries.find(
          ({ country_code }) => country_code === countryCode
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Country not available in region`
        )
      }
      cart.shipping_address = {
        ...shippingAddress,
        country_code: countryCode,
      }
    } else {
      // If the country code of a shipping address is set we need to clear it
      if (!_.isEmpty(shippingAddress) && shippingAddress.country_code) {
        cart.shipping_address = {
          ...shippingAddress,
          country_code: null,
        }
      }

      // If there is only one country in the region preset it
      if (region.countries.length === 1) {
        cart.shipping_address = {
          ...shippingAddress,
          country_code: region.countries[0].country_code,
        }
      }
    }

    // Shipping methods are determined by region so the user needs to find a
    // new shipping method
    if (cart.shipping_methods && cart.shipping_methods.length) {
      const smRepo = this.manager_.getCustomRepository(
        this.shippingMethodRepository_
      )
      await smRepo.remove({ where: { cart_id: cart.id } })
    }

    if (cart.discounts && cart.discounts.length) {
      const newDiscounts = cart.discounts.map(d => {
        if (d.regions.find(({ id }) => id === regionId)) {
          return d
        }
      })

      cart.discounts = newDiscounts.filter(d => !!d)
    }

    // Payment methods are region specific so the user needs to find a
    // new payment method
    if (!_.isEmpty(cart.payment)) {
      cart.payment = undefined
    }

    if (cart.payment_sessions && cart.payment_sessions.length) {
      cart.payment_sessions = []
    }
  }

  async delete(cartId) {
    const cart = await this.retrieve(cartId)
    return this.cartModel_.deleteOne(
      { id: cart.id },
      { session: this.current_session }
    )
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
