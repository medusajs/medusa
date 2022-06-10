import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { DeepPartial, EntityManager, FindOneOptions } from "typeorm"
import { FulfillmentProviderService, RegionService, TotalsService } from "."
import {
  Cart,
  Order,
  ShippingMethod,
  ShippingOption,
  ShippingOptionRequirement,
} from ".."
import { ShippingOptionPriceType } from "../models/shipping-option"
import { ShippingMethodRepository } from "../repositories/shipping-method"
import { ShippingOptionRepository } from "../repositories/shipping-option"
import { ShippingOptionRequirementRepository } from "../repositories/shipping-option-requirement"
import { FindConfig } from "../types/common"
import {
  CreateShippingMethodDto,
  ShippingMethodUpdate,
  ShippingOptionUpdate,
  ShippingRequirement,
} from "../types/shipping-options"

type ShippingOptionServiceProps = {
  shippingOptionRepository: typeof ShippingOptionRepository
  shippingMethodRepository: typeof ShippingMethodRepository
  shippingOptionRequirementRepository: typeof ShippingOptionRequirementRepository
  fulfillmentProviderService: FulfillmentProviderService
  regionService: RegionService
  totalsService: TotalsService
  manager: EntityManager
}

/**
 * Provides layer to manipulate profiles.
 * @extends BaseService
 */
class ShippingOptionService extends BaseService {
  private manager_: EntityManager
  private optionRepository_: typeof ShippingOptionRepository
  private methodRepository_: typeof ShippingMethodRepository
  private requirementRepository_: typeof ShippingOptionRequirementRepository
  private providerService_: FulfillmentProviderService
  private regionService_: RegionService
  private totalsService_: TotalsService

  constructor({
    manager,
    shippingOptionRepository,
    shippingMethodRepository,
    shippingOptionRequirementRepository,
    fulfillmentProviderService,
    regionService,
    totalsService,
  }: ShippingOptionServiceProps) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ShippingOptionRepository} */
    this.optionRepository_ = shippingOptionRepository

    /** @private @const {ShippingMethodRepository} */
    this.methodRepository_ = shippingMethodRepository

    /** @private @const {ShippingOptionRequirementRepository} */
    this.requirementRepository_ = shippingOptionRequirementRepository

    /** @private @const {FulfillmentProviderService} */
    this.providerService_ = fulfillmentProviderService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService
  }

  withTransaction(transactionManager): ShippingOptionService {
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
   * @param {string} optionId - the id to validate the requirement
   * @return {ShippingRequirement} a validated shipping requirement
   */
  async validateRequirement_(
    requirement: ShippingOptionRequirement,
    optionId?: string
  ): Promise<ShippingOptionRequirement> {
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

    const reqRepo: ShippingOptionRequirementRepository =
      this.manager_.getCustomRepository(this.requirementRepository_)

    const existingReq: ShippingOptionRequirement | undefined =
      await reqRepo.findOne({
        where: { id: requirement.id },
      })

    if (!existingReq && requirement.id) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "ID does not exist")
    }

    // If no option id is provided, we are currently in the process of creating
    // a new shipping option. Therefore, simply return the requirement, such
    // that the cascading will take care of the creation of the requirement.
    if (!optionId) {
      return requirement
    }

    let req
    if (existingReq) {
      req = await reqRepo.save({
        ...existingReq,
        ...requirement,
      })
    } else {
      const created = reqRepo.create({
        ...requirement,
        shipping_option_id: optionId,
      })

      req = await reqRepo.save(created)
    }

    return req
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {FindConfig<ShippingOption>} config - config object
   * @return {Promise<ShippingOption[]>} the result of the find operation
   */
  async list(
    selector,
    config: FindConfig<ShippingOption> = { skip: 0, take: 50 }
  ): Promise<ShippingOption[]> {
    const optRepo: ShippingOptionRepository = this.manager_.getCustomRepository(
      this.optionRepository_
    )

    const query = this.buildQuery_(selector, config)
    return optRepo.find(query)
  }

  /**
   * Gets a profile by id.
   * Throws in case of DB Error and if profile was not found.
   * @param {string} optionId - the id of the profile to get.
   * @param {FindConfig<ShippingOption>} options - the options to get a profile
   * @return {Promise<ShippingOption>} the profile document.
   */
  async retrieve(
    optionId,
    options: FindConfig<ShippingOption> = {}
  ): Promise<ShippingOption> {
    const soRepo = this.manager_.getCustomRepository(this.optionRepository_)
    const validatedId = this.validateId_(optionId)

    const query: FindOneOptions<ShippingOption> = {
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
   * @param {ShippingMethodUpdate} update - the values to update the method with
   * @return {Promise<ShippingMethod>} the resulting shipping method
   */
  async updateShippingMethod(
    id: string,
    update: ShippingMethodUpdate
  ): Promise<ShippingMethod> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const methodRepo: ShippingMethodRepository = manager.getCustomRepository(
        this.methodRepository_
      )
      const method = await methodRepo.findOne({ where: { id } })

      if (method) {
        for (const key of Object.keys(update).filter(
          (k) => typeof update[k] !== `undefined`
        )) {
          method[key] = update[key]
        }

        return methodRepo.save(method)
      }
      return undefined
    })
  }

  /**
   * Removes a given shipping method
   * @param {ShippingMethod} sm - the shipping method to remove
   * @return the removed shipping method
   */
  async deleteShippingMethod(sm: ShippingMethod): Promise<ShippingMethod> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const methodRepo: ShippingMethodRepository = manager.getCustomRepository(
        this.methodRepository_
      )
      return methodRepo.remove(sm)
    })
  }

  /**
   * Creates a shipping method for a given cart.
   * @param {string} optionId - the id of the option to use for the method.
   * @param {object} data - the optional provider data to use.
   * @param {object} config - the cart to create the shipping method for.
   * @return {ShippingMethod} the resulting shipping method.
   */
  async createShippingMethod(
    optionId: string,
    data: object,
    config: CreateShippingMethodDto
  ): Promise<ShippingMethod> {
    return this.atomicPhase_(async (manager) => {
      const option = await this.retrieve(optionId, {
        relations: ["requirements"],
      })

      const methodRepo: ShippingMethodRepository = manager.getCustomRepository(
        this.methodRepository_
      )

      if (typeof config.cart !== "undefined") {
        this.validateCartOption(option, config.cart)
      }

      const validatedData = await this.providerService_.validateFulfillmentData(
        option,
        data,
        config.cart || {}
      )

      let methodPrice
      if (typeof config.price !== "undefined") {
        methodPrice = config.price
      } else {
        methodPrice = await this.getPrice_(option, validatedData, config.cart)
      }

      const toCreate: DeepPartial<ShippingMethod> = {
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

      if (config.cart_id) {
        toCreate.cart_id = config.cart_id
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
   * Creates a shipping method for a given cart.
   * @param {string} optionId - the id of the option to use for the method.
   * @param {string} cartId - the cart for which the shipping option is updated.
   * @param {ShippingMethodUpdate} update - the update which is applied to the cart.
   * @return {Promise<ShippingMethod>} the resulting shipping method.
   */
  async updateShippingMethodForCart(
    optionId: string,
    cartId: string,
    update: ShippingMethodUpdate
  ): Promise<ShippingMethod> {
    return this.atomicPhase_(async (manager) => {
      const methodRepo: ShippingMethodRepository = manager.getCustomRepository(
        this.methodRepository_
      )
      const method = await methodRepo.findOne({
        where: { shipping_option_id: optionId, cart_id: cartId },
      })
      if (method) {
        return await this.updateShippingMethod(method.id, update)
      }
      return undefined
    })
  }

  /**
   * Checks if a given option id is a valid option for a cart. If it is the
   * option is returned with the correct price. Throws when region_ids do not
   * match, or when the shipping option requirements are not satisfied.
   * @param {object} option - the option object to check
   * @param {Cart} cart - the cart object to check against
   * @return {ShippingOption | null} the validated shipping option
   */
  validateCartOption(option, cart: Cart): ShippingOption | null {
    if (option.is_return) {
      return null
    }

    if (cart.region_id !== option.region_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The shipping option is not available in the cart's region"
      )
    }

    if (typeof cart.subtotal === "undefined") {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Cart subtotal must be defined for cart option validation"
      )
    }
    const subtotal = cart.subtotal
    const requirementResults: boolean[] = option.requirements.map(
      (requirement) => {
        switch (requirement.type) {
          case "max_subtotal":
            return requirement.amount > subtotal
          case "min_subtotal":
            return requirement.amount <= subtotal
          default:
            if (typeof subtotal === "undefined") {
              throw new MedusaError(
                MedusaError.Types.UNEXPECTED_STATE,
                "subtotal of the cart cannot be undefined"
              )
            }
            return true
        }
      }
    )

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
   * @param {ShippingOption} data - the data to create shipping options
   * @return {Promise<ShippingOption>} the result of the create operation
   */
  async create(data: ShippingOption): Promise<ShippingOption> {
    return this.atomicPhase_(async (manager) => {
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

      if ("requirements" in data && data.requirements) {
        const acc: ShippingRequirement[] = []
        for (const r of data.requirements) {
          const validated = await this.validateRequirement_(r)

          if (acc.find((raw) => raw.type === validated.type)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Only one requirement of each type is allowed"
            )
          }

          if (
            acc.find(
              (raw) =>
                (raw.type === "max_subtotal" &&
                  validated.amount > raw.amount) ||
                (raw.type === "min_subtotal" && validated.amount < raw.amount)
            )
          ) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Max. subtotal must be greater than Min. subtotal"
            )
          }

          acc.push(validated)
        }
      }

      const result = await optionRepo.save(option)
      return result
    })
  }

  /**
   * Validates a shipping option price
   * @param {ShippingOptionPriceType} priceType - the price to validate
   * @param {ShippingOption} option - the option to validate against
   * @return {Promise<ShippingOptionPriceType>} the validated price
   */
  async validatePriceType_(
    priceType: ShippingOptionPriceType,
    option: ShippingOption
  ): Promise<ShippingOptionPriceType> {
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
      const canCalculate = await this.providerService_.canCalculate({
        provider_id: option.provider_id,
        data: option.data,
      })
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
   * @param {ShippingOptionUpdate} update - an object with the update values.
   * @return {Promise<ShippingOption>} resolves to the update result.
   */
  async update(
    optionId: string,
    update: ShippingOptionUpdate
  ): Promise<ShippingOption> {
    return this.atomicPhase_(async (manager) => {
      const option = await this.retrieve(optionId, {
        relations: ["requirements"],
      })

      if (typeof update.metadata !== "undefined") {
        option.metadata = await this.setMetadata_(option, update.metadata)
      }

      if (
        "region_id" in update ||
        "provider_id" in update ||
        "data" in update
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Region and Provider cannot be updated after creation"
        )
      }

      if (typeof update.is_return !== "undefined") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "is_return cannot be changed after creation"
        )
      }

      if (typeof update.requirements !== "undefined") {
        const acc: ShippingOptionRequirement[] = []
        for (const r of update.requirements) {
          const validated = await this.validateRequirement_(r, optionId)

          if (acc.find((raw) => raw.type === validated.type)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Only one requirement of each type is allowed"
            )
          }

          if (
            acc.find(
              (raw) =>
                (raw.type === "max_subtotal" &&
                  validated.amount > raw.amount) ||
                (raw.type === "min_subtotal" && validated.amount < raw.amount)
            )
          ) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Max. subtotal must be greater than Min. subtotal"
            )
          }

          acc.push(validated)
        }

        if (option.requirements) {
          const accReqs = acc.map((a) => a.id)
          const toRemove = option.requirements.filter(
            (r) => !accReqs.includes(r.id)
          )
          await Promise.all(
            toRemove.map(async (req) => {
              await this.removeRequirement(req.id)
            })
          )
        }

        option.requirements = acc
      }

      if (typeof update.price_type !== "undefined") {
        option.price_type = await this.validatePriceType_(
          update.price_type,
          option
        )
        if (update.price_type === "calculated") {
          option.amount = null
        }
      }

      if (
        typeof update.amount !== "undefined" &&
        option.price_type !== "calculated"
      ) {
        option.amount = update.amount
      }

      if (typeof update.name !== "undefined") {
        option.name = update.name
      }

      if (typeof update.admin_only !== "undefined") {
        option.admin_only = update.admin_only
      }

      const optionRepo: ShippingOptionRepository = manager.getCustomRepository(
        this.optionRepository_
      )
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
  async delete(optionId: string): Promise<ShippingOption | void> {
    try {
      const option = await this.retrieve(optionId)

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
   * Adds a requirement to a shipping option. Only 1 requirement of each type
   * is allowed.
   * @param {string} optionId - the option to add the requirement to.
   * @param {ShippingOptionRequirement} requirement - the requirement for the option.
   * @return {Promise} the result of update
   */
  async addRequirement(
    optionId: string,
    requirement: ShippingOptionRequirement
  ): Promise<ShippingOption> {
    return this.atomicPhase_(async (manager) => {
      const option = await this.retrieve(optionId, {
        relations: ["requirements"],
      })
      const validatedReq = await this.validateRequirement_(requirement)

      if (option.requirements.find((r) => r.type === validatedReq.type)) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
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
   * @param {string} requirementId - the id of the requirement to remove
   * @return {Promise} the result of update
   */
  async removeRequirement(requirementId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      try {
        const reqRepo = manager.getCustomRepository(this.requirementRepository_)
        const requirement = await reqRepo.findOne({
          where: { id: requirementId },
        })

        const result = await reqRepo.softRemove(requirement)

        return result
      } catch (error) {
        // Delete is idempotent, but we return a promise to allow then-chaining
        return Promise.resolve()
      }
    })
  }

  /**
   * Decorates a shipping option.
   * @param {ShippingOption} optionId - the shipping option to decorate using optionId.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {ShippingOption} the decorated ShippingOption.
   */
  async decorate(
    optionId,
    fields: (keyof ShippingOption)[] = [],
    expandFields: (keyof ShippingOption)[] = []
  ): Promise<ShippingOption> {
    const requiredFields: (keyof ShippingOption)[] = ["id", "metadata"]

    fields = fields.concat(requiredFields)

    const option = await this.retrieve(optionId, {
      select: fields,
      relations: expandFields,
    })

    return option
  }

  /**
   * Dedicated method to set metadata for a shipping option.
   * @param {ShippingOption} option - the option to set metadata for.
   * @param {object} metadata - object for metadata field
   * @return {Promise<object>} resolves to the updated result.
   */
  async setMetadata_(option, metadata): Promise<object> {
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
   * @param {ShippingData} data - the shipping data to retrieve the price.
   * @param {Cart | Order} cart - the context in which the price should be
   *   retrieved.
   * @return {Promise<Number>} the price of the shipping option.
   */
  async getPrice_(
    option: ShippingOption,
    data: object,
    cart: Cart | Order | undefined
  ): Promise<number> {
    if (option.price_type === "calculated" || option.amount === null) {
      return this.providerService_.calculatePrice(option, data, cart)
    }
    return option.amount
  }
}

export default ShippingOptionService
