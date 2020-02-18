import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate carts.
 * @implements BaseService
 */
class CartService extends BaseService {
  constructor({
    cartModel,
    eventBusService,
    paymentProviderService,
    productService,
    productVariantService,
    regionService,
  }) {
    super()

    /** @private @const {CartModel} */
    this.cartModel_ = cartModel

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService
  }

  /**
   * Used to validate cart ids. Throws an error if the cast fails
   * @param {string} rawId - the raw cart id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The cartId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Used to validate line items.
   * @param {object} rawLineItem - the raw cart id to validate.
   * @return {object} the validated id
   */
  validateLineItem_(rawLineItem) {
    const content = Validator.object({
      unit_price: Validator.number().required(),
      variant: Validator.object().required(),
      product: Validator.object().required(),
      quantity: Validator.number()
        .integer()
        .min(1)
        .default(1),
    })

    const lineItemSchema = Validator.object({
      title: Validator.string().required(),
      description: Validator.string(),
      thumbnail: Validator.string(),
      content: Validator.alternatives()
        .try(content, Validator.array().items(content))
        .required(),
      quantity: Validator.number()
        .integer()
        .min(1)
        .required(),
      metadata: Validator.object(),
    })

    const { value, error } = lineItemSchema.validate(rawLineItem)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        error.details[0].message
      )
    }

    return value
  }

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
  async confirmInventory_(content, lineQuantity) {
    if (Array.isArray(content)) {
      const coverage = await Promise.all(
        content.map(({ variant, quantity }) => {
          return this.productVariantService_.canCoverQuantity(
            variant._id,
            lineQuantity * quantity
          )
        })
      )

      return coverage.every(c => c)
    }

    const { variant, quantity } = content
    return this.productVariantService_.canCoverQuantity(
      variant._id,
      lineQuantity * quantity
    )
  }

  /**
   * Transforms some line item content to have unit_prices corresponding to a
   * given region's pricing scheme.
   * @param {(LineItemContent | LineItemContentArray)} - the content of the line
   *    item
   * @param {string} regionId - the id of the region whose price we should
   *    update to
   * @return {(LineItemContent | LineItemContentArray)} true if the inventory
   *    covers the line item.
   */
  async updateContentPrice_(content, regionId) {
    if (Array.isArray(content)) {
      return await Promise.all(
        content.map(async c => {
          const unitPrice = await this.productVariantService_.getRegionPrice(
            c.variant._id,
            regionId
          )
          c.unit_price = unitPrice
          return c
        })
      )
    }

    const unitPrice = await this.productVariantService_.getRegionPrice(
      content.variant._id,
      regionId
    )
    content.unit_price = unitPrice
    return content
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
  retrieve(cartId) {
    const validatedId = this.validateId_(cartId)
    return this.cartModel_.findOne({ _id: validatedId }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
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
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(cart, fields.concat(requiredFields))
    return decorated
  }

  /**
   * Adds a line item to the cart.
   * @param {string} cartId - the id of the cart that we will add to
   * @param {LineItem} lineItem - the line item to add.
   * @retur {Promise} the result of the update operation
   */
  async addLineItem(cartId, lineItem) {
    const validatedLineItem = this.validateLineItem_(lineItem)

    const cart = await this.retrieve(cartId)
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The cart was not found"
      )
    }

    const currentItem = cart.items.find(line =>
      _.isEqual(line.content, validatedLineItem.content)
    )

    // If content matches one of the line items currently in the cart we can
    // simply update the quantity of the existing line item
    if (currentItem) {
      const newQuantity = currentItem.quantity + validatedLineItem.quantity

      // Confirm inventory
      const hasInventory = await this.confirmInventory_(
        validatedLineItem.content,
        newQuantity
      )

      if (!hasInventory) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Inventory doesn't cover the desired quantity"
        )
      }

      return this.cartModel_.updateOne(
        {
          _id: cartId,
          "items._id": currentItem._id,
        },
        {
          $set: {
            "items.$.quantity": newQuantity,
          },
        }
      )
    }

    // Confirm inventory
    const hasInventory = await this.confirmInventory_(
      validatedLineItem.content,
      validatedLineItem.quantity
    )

    if (!hasInventory) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Inventory doesn't cover the desired quantity"
      )
    }

    // The line we are adding doesn't already exist so it is safe to push
    return this.cartModel_.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { items: validatedLineItem },
      }
    )
  }

  /**
   * Sets the email of a cart
   * @param {string} cartId - the id of the cart to add email to
   * @param {string} email - the email to add to cart
   * @return {Promise} the result of the update operation
   */
  async updateEmail(cartId, email) {
    const cart = await this.retrieve(cartId)
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The cart was not found"
      )
    }

    const schema = Validator.string()
      .email()
      .required()
    const { value, error } = schema.validate(email)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The email is not valid"
      )
    }

    return this.cartModel_.updateOne(
      {
        _id: cartId,
      },
      {
        $set: { email: value },
      }
    )
  }

  /**
   * Updates the cart's billing address.
   * @param {string} cartId - the id of the cart to update
   * @param {object} address - the value to set the billing address to
   * @return {Promise} the result of the update operation
   */
  async updateBillingAddress(cartId, address) {
    const cart = await this.retrieve(cartId)
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The cart was not found"
      )
    }

    const { value, error } = Validator.address().validate(address)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The address is not valid"
      )
    }

    return this.cartModel_.updateOne(
      {
        _id: cartId,
      },
      {
        $set: { billing_address: value },
      }
    )
  }

  /**
   * Updates the cart's shipping address.
   * @param {string} cartId - the id of the cart to update
   * @param {object} address - the value to set the shipping address to
   * @return {Promise} the result of the update operation
   */
  async updateShippingAddress(cartId, address) {
    const cart = await this.retrieve(cartId)
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The cart was not found"
      )
    }

    const { value, error } = Validator.address().validate(address)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The address is not valid"
      )
    }

    return this.cartModel_.updateOne(
      {
        _id: cartId,
      },
      {
        $set: { shipping_address: value },
      }
    )
  }

  /**
   * @typedef {object} PaymentMethod
   * @property {string} provider_id - the identifier of the payment method's
   *     provider
   * @property {object} data - the data associated with the payment method
   */

  /**
   * Sets a payment method for a cart.
   * @param {string} cartId - the id of the cart to add payment method to
   * @param {PaymentMethod} paymentMethod - the method to be set to the cart
   * @returns {Promise} result of update operation
   */
  async setPaymentMethod(cartId, paymentMethod) {
    const cart = await this.retrieve(cartId)
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The cart was not found"
      )
    }

    const region = await this.regionService_.retrieve(cart.region_id)
    if (!region) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The cart does not have a region associated`
      )
    }

    // The region must have the provider id in its providers array
    if (
      !(
        region.payment_providers.length &&
        region.payment_providers.includes(paymentMethod.provider_id)
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The payment method is not available in this region`
      )
    }

    // Check if the payment method has been authorized.
    const provider = this.paymentProviderService_.retrieveProvider(
      paymentMethod.provider_id
    )
    if (!provider) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The payment provider for the payment method was not found`
      )
    }

    const status = await provider.getStatus(paymentMethod.data)
    if (status !== "authorized") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The payment method was not authorized`
      )
    }

    // At this point we can register the payment method.
    return this.cartModel_.updateOne(
      {
        _id: cart._id,
      },
      {
        $set: { payment_method: paymentMethod },
      }
    )
  }

  /**
   * Set's the region of a cart.
   * @param {string} cartId - the id of the cart to set region on
   * @param {string} regionId - the id of the region to set the cart to
   * @return {Promise} the result of the update operation
   */
  async setRegion(cartId, regionId) {
    const cart = await this.retrieve(cartId)
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The cart was not found"
      )
    }

    const region = await this.regionService_.retrieve(regionId)
    if (!region) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The region: ${regionId} was not found`
      )
    }

    let update = {
      region_id: region._id,
    }

    // If the cart contains items we want to change the unit_price field of each
    // item to correspond to the price given in the region
    if (cart.items.length) {
      const newItems = await Promise.all(
        cart.items.map(async lineItem => {
          try {
            lineItem.content = await this.updateContentPrice_(
              lineItem.content,
              region._id
            )
          } catch (err) {
            return null
          }
          return lineItem
        })
      )

      update.items = newItems.filter(i => !!i)
    }

    // If the country code of a shipping address is set we need to clear it
    let shippingAddress = cart.shipping_address
    if (!_.isEmpty(shippingAddress) && shippingAddress.country_code) {
      shippingAddress.country_code = ""
      update.shipping_address = shippingAddress
    }

    // If the country code of a billing address is set we need to clear it
    let billingAddress = cart.billing_address
    if (!_.isEmpty(billingAddress) && billingAddress.country_code) {
      billingAddress.country_code = ""
      update.billing_address = billingAddress
    }

    // Shipping methods are determined by region so the user needs to find a
    // new shipping method
    if (!_.isEmpty(cart.shipping_method)) {
      update.shipping_method = undefined
    }

    // Payment methods are region specific so the user needs to find a
    // new payment method
    if (!_.isEmpty(cart.payment_method)) {
      update.payment_method = undefined
    }

    return this.cartModel_.updateOne({ _id: cart._id }, { $set: update })
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
  setMetadata(cartId, key, value) {
    const validatedId = this.validateId_(cartId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.cartModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default CartService
