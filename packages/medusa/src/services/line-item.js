import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate line items.
 * @implements BaseService
 */
class LineItemService extends BaseService {
  constructor({ productVariantService, productService }) {
    super()

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {ProductService} */
    this.productService_ = productService
  }

  /**
   * Used to validate line items.
   * @param {object} rawLineItem - the raw line item to validate.
   * @return {object} the validated id
   */
  validate(rawLineItem) {
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
   * Generates a line item.
   * @param {string} variantId - id of the line item variant
   * @param {*} regionId - id of the cart region
   * @param {*} quantity - number of items
   */
  async generate(variantId, regionId, quantity) {
    const products = await this.productService_.list({ variants: variantId })
    if (!products.length) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        `Could not find product for variant with id: ${variantId}`
      )
    }
    const product = products[0]
    const variant = await this.productVariantService_.retrieve(variantId)
    const unit_price = await this.productVariantService_.getRegionPrice(
      variantId,
      regionId
    )

    return {
      variant,
      product,
      quantity,
      content: {
        unit_price,
        variant,
        product,
        quantity: 1,
      },
    }
  }
}

export default LineItemService
