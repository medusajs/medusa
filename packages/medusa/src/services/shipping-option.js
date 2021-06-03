import _ from "lodash"
import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { In } from "typeorm"

/**
 * Provides layer to manipulate profiles.
 * @implements BaseService
 */
class ShippingOptionService extends BaseService {
  constructor({
    manager,
    shippingOptionRepository,
    shippingOptionRequirementRepository,
    shippingMethodRepository,
    fulfillmentProviderService,
    regionService,
    totalsService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ShippingOptionRepository} */
    this.optionRepository_ = shippingOptionRepository

    /** @private @const {ShippingMethodRepository} */
    this.methodRepository_ = shippingMethodRepository

    /** @private @const {ShippingOptionRequirementRepository} */
    this.requirementRepository_ = shippingOptionRequirementRepository

    /** @private @const {ProductService} */
    this.providerService_ = fulfillmentProviderService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShippingOptionService({
      manager: transactionManager,
      shippingOptionRepository: this.optionRepository_,
      shippingMethodRepository: this.methodRepository_,
      shippingOptionRequirementRepository: this.requirementRepository_,
      fulfillmentProviderService: this.providerService_,
      regionService: this.regionService_,
      totalsService: this.totalsService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Validates a requirement
   * @param {ShippingRequirement} requirement - the requirement to validate
   * @return {ShippingRequirement} a validated shipping requirement
   */
  async validateRequirement_(requirement, optionId) {
    if (!requirement.type) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "A Shipping Requirement must have a type field"
      )
    }

    if (
      requirement.type !== "min_subtotal" &&
      requirement.type !== "max_subtotal"
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Requirement type must be one of min_subtotal, max_subtotal"
      )
    }

    const reqRepo = this.manager_.getCustomRepository(
      this.requirementRepository_
    )

    const existingReq = await reqRepo.findOne({
      where: { id: requirement.id },
    })

    let req
    if (existingReq) {
      req = await reqRepo.save({
        ...existingReq,
        ...requirement,
      })
    } else {
      req = await reqRepo.create({
        shipping_option_id: optionId,
        ...requirement,
      })
    }

    return req
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  async list(selector, config = { skip: 0, take: 50 }) {
    const optRepo = this.manager_.getCustomRepository(this.optionRepository_)

    const query = this.buildQuery_(selector, config)
    return optRepo.find(query)
  }

  /**
   * Gets a profile by id.
   * Throws in case of DB Error and if profile was not found.
   * @param {string} optionId - the id of the profile to get.
   * @return {Promise<Product>} the profile document.
   */
  async retrieve(optionId, options = {}) {
    const soRepo = this.manager_.getCustomRepository(this.optionRepository_)
    const validatedId = this.validateId_(optionId)

    const query = {
      where: { id: validatedId },
    }

    if (options.select) {
      query.select = options.select
    }

    if (options.relations) {
      query.relations = options.relations
    }

    const option = await soRepo.findOne(query)

    if (!option) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Shipping Option with ${optionId} was not found`
      )
    }

    return option
  }

  /**
   * Updates a shipping method's associations. Useful when a cart is completed
   * and its methods should be copied to an order/swap entity.
   * @param {string} id - the id of the shipping method to update
   * @param {object} update - the values to update the method with
   * @returns {Promise<ShippingMethod>} the resulting shipping method
   */
  async updateShippingMethod(id, update) {
    return this.atomicPhase_(async manager => {
      const methodRepo = manager.getCustomRepository(this.methodRepository_)
      const method = await methodRepo.findOne({ where: { id } })

      if ("return_id" in update) {
        method.return_id = update.return_id
      }

      if ("swap_id" in update) {
        method.swap_id = update.swap_id
      }

      if ("order_id" in update) {
        method.order_id = update.order_id
      }

      if ("claim_order_id" in update) {
        method.claim_order_id = update.claim_order_id
      }

      return methodRepo.save(method)
    })
  }

  /**
   * Removes a given shipping method
   * @param {string} id - the id of the option to use for the method.
   */
  async deleteShippingMethod(sm) {
    return this.atomicPhase_(async manager => {
      const methodRepo = manager.getCustomRepository(this.methodRepository_)
      return methodRepo.remove(sm)
    })
  }

  /**
   * Creates a shipping method for a given cart.
   * @param {string} optionId - the id of the option to use for the method.
   * @param {object} data - the optional provider data to use.
   * @param {object} config - the cart to create the shipping method for.
   * @returns {ShippingMethod} the resulting shipping method.
   */
  async createShippingMethod(optionId, data, config) {
    return this.atomicPhase_(async manager => {
      const option = await this.retrieve(optionId, {
        relations: ["requirements"],
      })

      const methodRepo = manager.getCustomRepository(this.methodRepository_)

      if ("cart" in config) {
        this.validateCartOption(option, config.cart || {})
      }

      const validatedData = await this.providerService_.validateFulfillmentData(
        option,
        data,
        config.cart || {}
      )

      let methodPrice
      if ("price" in config) {
        methodPrice = config.price
      } else {
        methodPrice = await this.getPrice_(option, validatedData, config.cart)
      }

      const toCreate = {
        shipping_option_id: option.id,
        data: validatedData,
        price: methodPrice,
      }

      if (config.order) {
        toCreate.order_id = config.order.id
      }

      if (config.cart) {
        toCreate.cart_id = config.cart.id
      }

      if (config.return_id) {
        toCreate.return_id = config.return_id
      }

      if (config.order_id) {
        toCreate.order_id = config.order_id
      }

      if (config.claim_order_id) {
        toCreate.claim_order_id = config.claim_order_id
      }

      const method = await methodRepo.create(toCreate)

      const created = await methodRepo.save(method)

      return methodRepo.findOne({
        where: { id: created.id },
        relations: ["shipping_option"],
      })
    })
  }

  /**
   * Checks if a given option id is a valid option for a cart. If it is the
   * option is returned with the correct price. Throws when region_ids do not
   * match, or when the shipping option requirements are not satisfied.
   * @param {string} optionId - the id of the option to check
   * @param {Cart} cart - the cart object to check against
   * @return {ShippingOption} the validated shipping option
   */
  validateCartOption(option, cart) {
    if (option.is_return) {
      return null
    }

    if (cart.region_id !== option.region_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The shipping option is not available in the cart's region"
      )
    }

    const subtotal = cart.subtotal
    const requirementResults = option.requirements.map(requirement => {
      switch (requirement.type) {
        case "max_subtotal":
          return requirement.amount > subtotal
        case "min_subtotal":
          return requirement.amount <= subtotal
        default:
          return true
      }
    })

    if (!requirementResults.every(Boolean)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The Cart does not satisfy the shipping option's requirements"
      )
    }

    return option
  }

  /**
   * Creates a new shipping option. Used both for outbound and inbound shipping
   * options. The difference is registered by the `is_return` field which
   * defaults to false.
   * @param {ShippingOption} option - the shipping option to create
   * @return {Promise<ShippingOption>} the result of the create operation
   */
  async create(data) {
    return this.atomicPhase_(async manager => {
      const optionRepo = manager.getCustomRepository(this.optionRepository_)
      const option = await optionRepo.create(data)

      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(option.region_id, {
          relations: ["fulfillment_providers"],
        })

      if (
        !region.fulfillment_providers.find(
          ({ id }) => id === option.provider_id
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The fulfillment provider is not available in the provided region"
        )
      }

      option.price_type = await this.validatePriceType_(data.price_type, option)
      option.amount = data.price_type === "calculated" ? null : data.amount

      const isValid = await this.providerService_.validateOption(option)

      if (!isValid) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The fulfillment provider cannot validate the shipping option"
        )
      }

      if ("requirements" in data) {
        option.requirements = await Promise.all(
          data.requirements.map(r => {
            return this.validateRequirement_(r, option.id)
          })
        )
      }

      const result = await optionRepo.save(option)
      return result
    })
  }

  /**
   * @typedef ShippingOptionPrice
   * @property {string} type - one of flat_rate, calculated
   * @property {number} value - the value if available
   */

  /**
   * Validates a shipping option price
   * @param {ShippingOptionPrice} price - the price to validate
   * @param {ShippingOption} option - the option to validate against
   * @return {Promise<ShippingOptionPrice>} the validated price
   */
  async validatePriceType_(priceType, option) {
    if (
      !priceType ||
      (priceType !== "flat_rate" && priceType !== "calculated")
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The price must be of type flat_rate or calculated"
      )
    }

    if (priceType === "calculated") {
      const canCalculate = await this.providerService_.canCalculate(
        option.provider_id,
        option.data
      )
      if (!canCalculate) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The fulfillment provider cannot calculate prices for this option"
        )
      }
    }

    return priceType
  }

  /**
   * Updates a profile. Metadata updates and product updates should use
   * dedicated methods, e.g. `setMetadata`, etc. The function
   * will throw errors if metadata or product updates are attempted.
   * @param {string} optionId - the id of the option. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(optionId, update) {
    return this.atomicPhase_(async manager => {
      const option = await this.retrieve(optionId)

      if ("metadata" in update) {
        option.metadata = await this.setMetadata_(option, update.metadata)
      }

      if (update.region_id || update.provider_id || update.data) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Region and Provider cannot be updated after creation"
        )
      }

      if ("is_return" in update) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "is_return cannot be changed after creation"
        )
      }

      if ("requirements" in update) {
        const acc = []
        for (const r of update.requirements) {
          const validated = await this.validateRequirement_(r, optionId)

          if (acc.find(raw => raw.type === validated.type)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Only one requirement of each type is allowed"
            )
          }

          acc.push(validated)
        }
        option.requirements = acc
      }

      if ("price_type" in update) {
        option.price_type = await this.validatePriceType_(
          update.price_type,
          option
        )
        if (update.price_type === "calculated") {
          option.amount = null
        }
      }

      if ("amount" in update && option.price_type !== "calculated") {
        option.amount = update.amount
      }

      if ("name" in update) {
        option.name = update.name
      }

      const optionRepo = manager.getCustomRepository(this.optionRepository_)
      const result = await optionRepo.save(option)
      return result
    })
  }

  /**
   * Deletes a profile with a given profile id.
   * @param {string} optionId - the id of the profile to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(optionId) {
    try {
      let option = await this.retrieve(optionId)

      const optionRepo = this.manager_.getCustomRepository(
        this.optionRepository_
      )

      return optionRepo.softRemove(option)
    } catch (error) {
      // Delete is idempotent, but we return a promise to allow then-chaining
      return Promise.resolve()
    }
  }

  /**
   * @typedef ShippingRequirement
   * @property {string} type - one of max_subtotal, min_subtotal
   * @property {number} amount - the value to match against
   */

  /**
   * Adds a requirement to a shipping option. Only 1 requirement of each type
   * is allowed.
   * @param {string} optionId - the option to add the requirement to.
   * @param {ShippingRequirement} requirement - the requirement for the option.
   * @return {Promise} the result of update
   */
  async addRequirement(optionId, requirement) {
    return this.atomicPhase_(async manager => {
      const option = await this.retrieve(optionId, {
        relations: ["requirements"],
      })
      const validatedReq = await this.validateRequirement_(requirement)

      if (option.requirements.find(r => r.type === validatedReq.type)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `A requirement with type: ${validatedReq.type} already exists`
        )
      }

      option.requirements.push(validatedReq)

      const optionRepo = manager.getCustomRepository(this.optionRepository_)
      return optionRepo.save(option)
    })
  }

  /**
   * Removes a requirement from a shipping option
   * @param {string} optionId - the shipping option to remove from
   * @param {string} requirementId - the id of the requirement to remove
   * @return {Promise} the result of update
   */
  async removeRequirement(optionId, requirementId) {
    return this.atomicPhase_(async manager => {
      const option = await this.retrieve(optionId, {
        relations: "requirements",
      })
      const newReqs = option.requirements.map(r => {
        if (r.id === requirementId) {
          return null
        } else {
          return r
        }
      })

      option.requirements = newReqs.filter(Boolean)

      const optionRepo = manager.getCustomRepository(this.optionRepository_)
      const result = await optionRepo.save(option)
      return result
    })
  }

  /**
   * Decorates a shipping option.
   * @param {ShippingOption} shippingOption - the shipping option to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {ShippingOption} the decorated ShippingOption.
   */
  async decorate(optionId, fields = [], expandFields = []) {
    const requiredFields = ["id", "metadata"]

    fields = fields.concat(requiredFields)

    const option = await this.retrieve(optionId, {
      select: fields,
      relations: expandFields,
    })

    return option
  }

  /**
   * Dedicated method to set metadata for a shipping option.
   * @param {string} optionId - the option to set metadata for.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  async setMetadata_(option, metadata) {
    const existing = option.metadata || {}
    const newData = {}
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof key !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Key type is invalid. Metadata keys must be strings"
        )
      }

      newData[key] = value
    }

    const updated = {
      ...existing,
      ...newData,
    }

    return updated
  }

  /**
   * Returns the amount to be paid for a shipping method. Will ask the
   * fulfillment provider to calculate the price if the shipping option has the
   * price type "calculated".
   * @param {ShippingOption} option - the shipping option to retrieve the price
   *   for.
   * @param {Cart || Order} cart - the context in which the price should be
   *   retrieved.
   * @returns {Promise<Number>} the price of the shipping option.
   */
  async getPrice_(option, data, cart) {
    if (option.price_type === "calculated") {
      return this.providerService_.calculatePrice(option, data, cart)
    }
    return option.amount
  }
}

export default ShippingOptionService
