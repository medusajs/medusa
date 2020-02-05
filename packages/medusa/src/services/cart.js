import mongoose from "mongoose"
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
    regionService,
    productService,
    productVariantService,
    eventBusService,
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
        .min(1),
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
    const decorated = _.pick(product, fields.concat(requiredFields))
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
