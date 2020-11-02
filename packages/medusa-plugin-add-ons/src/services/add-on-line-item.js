import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

class AddOnLineItemService extends BaseService {
  static Events = {
    UPDATED: "add_on.updated",
    CREATED: "add_on.created",
  }

  constructor(
    {
      addOnService,
      productService,
      productVariantService,
      regionService,
      eventBusService,
    },
    options
  ) {
    super()

    this.addOnService_ = addOnService

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.regionService_ = regionService

    this.eventBus_ = eventBusService

    this.options_ = options
  }

  /**
   * Generates a line item.
   * @param {string} variantId - id of the line item variant
   * @param {*} regionId - id of the cart region
   * @param {*} quantity - number of items
   * @param {[string]} addOnIds - id of add-ons
   */
  async generate(variantId, regionId, quantity, addOnIds, metadata = {}) {
    const variant = await this.productVariantService_.retrieve(variantId)
    const region = await this.regionService_.retrieve(regionId)

    const products = await this.productService_.list({ variants: variantId })
    // this should never fail, since a variant must have a product associated
    // with it to exists, but better safe than sorry
    if (!products.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Could not find product for variant with id: ${variantId}`
      )
    }

    const product = products[0]

    let unitPrice = await this.productVariantService_.getRegionPrice(
      variant._id,
      region._id
    )

    const addOnPrices = await Promise.all(
      addOnIds.map(async (id) => {
        const addOn = await this.addOnService_.retrieve(id)
        // Check if any of the add-ons can't be added to the product
        if (!addOn.valid_for.includes(`${product._id}`)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `${addOn.name} can not be added to ${product.title}`
          )
        } else {
          return await this.addOnService_.getRegionPrice(id, region._id)
        }
      })
    )

    unitPrice += _.sum(addOnPrices)

    const line = {
      title: product.title,
      quantity,
      thumbnail: product.thumbnail,
      should_merge: false,
      content: {
        unit_price: unitPrice * quantity,
        variant,
        product,
        quantity: 1,
      },
      should_merge: false,
      metadata: {
        ...metadata,
        add_ons: addOnIds,
      },
    }

    return line
  }

  async decorate(lineItem, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(lineItem, fields.concat(requiredFields))
    if (
      expandFields.includes("add_ons") &&
      decorated.metadata &&
      decorated.metadata.add_ons
    ) {
      decorated.metadata.add_ons = await Promise.all(
        decorated.metadata.add_ons.map(
          async (ao) => await this.addOnService_.retrieve(ao)
        )
      )
    }
    return decorated
  }
}

export default AddOnLineItemService
