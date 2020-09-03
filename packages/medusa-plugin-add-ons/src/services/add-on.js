import _ from "lodash"
import { BaseService } from "medusa-interfaces"

class AddOnService extends BaseService {
  static Events = {
    UPDATED: "add_on.updated",
    CREATED: "add_on.created",
  }

  constructor(
    { addOnModel, productService, productVariantService, eventBusService },
    options
  ) {
    super()

    this.addOnModel_ = addOnModel

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.eventBus_ = eventBusService

    this.options_ = options
  }

  /**
   * Used to validate product ids. Throws an error if the cast fails
   * @param {string} rawId - the raw product id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The productId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector, offset, limit) {
    return this.addOnModel_.find(selector, {}, offset, limit)
  }

  /**
   * Gets an add-on by id.
   * @param {string} addOnId - the id of the add-on to get.
   * @return {Promise<AddOn>} the add-on document.
   */
  async retrieve(addOnId) {
    const validatedId = this.validateId_(addOnId)
    const addOn = await this.addOnModel_
      .findOne({ _id: validatedId })
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!addOn) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Add-on with ${addOnId} was not found`
      )
    }
    return addOn
  }

  /**
   * Creates an unpublished add-on.
   * @param {object} addOn - the add-on to create
   * @return {Promise} resolves to the creation result.
   */
  async create(addOn) {
    return this.addOnModel_
      .create(addOn)
      .then((result) => {
        this.eventBus_.emit(AddOnService.Events.CREATED, result)
        return result
      })
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default AddOnService
