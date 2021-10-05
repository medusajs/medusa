import _ from "lodash"
import randomize from "randomatic"
import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"
import { MedusaErrorCodes } from "medusa-core-utils/dist/errors"
import { parse, toSeconds } from "iso8601-duration"
import { Brackets, ILike } from "typeorm"

/**
 * Provides layer to manipulate discounts.
 * @implements BaseService
 */
class DiscountService extends BaseService {
  constructor({
    manager,
    discountRepository,
    discountRuleRepository,
    giftCardRepository,
    totalsService,
    productVariantService,
    productService,
    regionService,
    eventBusService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {DiscountRepository} */
    this.discountRepository_ = discountRepository

    /** @private @const {DiscountRuleRepository} */
    this.discountRuleRepository_ = discountRuleRepository

    /** @private @const {GiftCardRepository} */
    this.giftCardRepository_ = giftCardRepository

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new DiscountService({
      manager: transactionManager,
      discountRepository: this.discountRepository_,
      discountRuleRepository: this.discountRuleRepository_,
      giftCardRepository: this.giftCardRepository_,
      totalsService: this.totalsService_,
      productService: this.productService_,
      regionService: this.regionService_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Creates a discount rule with provided data given that the data is validated.
   * @param {DiscountRule} discountRule - the discount rule to create
   * @return {Promise} the result of the create operation
   */
  validateDiscountRule_(discountRule) {
    const schema = Validator.object().keys({
      id: Validator.string().optional(),
      description: Validator.string().optional(),
      type: Validator.string().required(),
      value: Validator.number()
        .min(0)
        .required(),
      allocation: Validator.string().required(),
      valid_for: Validator.array().optional(),
      created_at: Validator.date().optional(),
      updated_at: Validator.date()
        .allow(null)
        .optional(),
      deleted_at: Validator.date()
        .allow(null)
        .optional(),
      metadata: Validator.object()
        .allow(null)
        .optional(),
    })

    const { value, error } = schema.validate(discountRule)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        error.details[0].message
      )
    }

    if (value.type === "percentage" && value.value > 100) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Discount value above 100 is not allowed when type is percentage"
      )
    }

    return value
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  async list(selector = {}, config = { relations: [], skip: 0, take: 10 }) {
    const discountRepo = this.manager_.getCustomRepository(
      this.discountRepository_
    )

    const query = this.buildQuery_(selector, config)
    return discountRepo.find(query)
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector = {},
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const discountRepo = this.manager_.getCustomRepository(
      this.discountRepository_
    )

    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (q) {
      const where = query.where

      delete where.code

      query.where = qb => {
        qb.where(where)

        qb.andWhere(
          new Brackets(qb => {
            qb.where({ code: ILike(`%${q}%`) })
          })
        )
      }
    }

    const [discounts, count] = await discountRepo.findAndCount(query)

    return [discounts, count]
  }

  /**
   * Creates a discount with provided data given that the data is validated.
   * Normalizes discount code to uppercase.
   * @param {Discount} discount - the discount data to create
   * @return {Promise} the result of the create operation
   */
  async create(discount) {
    return this.atomicPhase_(async manager => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)
      const ruleRepo = manager.getCustomRepository(this.discountRuleRepository_)

      const validatedRule = this.validateDiscountRule_(discount.rule)

      if (discount.regions) {
        discount.regions = await Promise.all(
          discount.regions.map(regionId =>
            this.regionService_.retrieve(regionId)
          )
        )
      }

      const discountRule = await ruleRepo.create(validatedRule)
      const createdDiscountRule = await ruleRepo.save(discountRule)

      discount.code = discount.code.toUpperCase()
      discount.rule = createdDiscountRule

      const created = await discountRepo.create(discount)
      const result = await discountRepo.save(created)
      return result
    })
  }

  /**
   * Gets a discount by id.
   * @param {string} discountId - id of discount to retrieve
   * @return {Promise<Discount>} the discount
   */
  async retrieve(discountId, config = {}) {
    const discountRepo = this.manager_.getCustomRepository(
      this.discountRepository_
    )

    const validatedId = this.validateId_(discountId)
    const query = this.buildQuery_({ id: validatedId }, config)
    const discount = await discountRepo.findOne(query)

    if (!discount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Discount with ${discountId} was not found`
      )
    }

    return discount
  }

  /**
   * Gets a discount by discount code.
   * @param {string} discountCode - discount code of discount to retrieve
   * @return {Promise<Discount>} the discount document
   */
  async retrieveByCode(discountCode, relations = []) {
    const discountRepo = this.manager_.getCustomRepository(
      this.discountRepository_
    )

    let discount = await discountRepo.findOne({
      where: { code: discountCode.toUpperCase(), is_dynamic: false },
      relations,
    })

    if (!discount) {
      discount = await discountRepo.findOne({
        where: { code: discountCode.toUpperCase(), is_dynamic: true },
        relations,
      })

      if (!discount) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Discount with code ${discountCode} was not found`
        )
      }
    }

    return discount
  }

  /**
   * Updates a discount.
   * @param {string} discountId - discount id of discount to update
   * @param {Discount} update - the data to update the discount with
   * @return {Promise} the result of the update operation
   */
  async update(discountId, update) {
    return this.atomicPhase_(async manager => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await this.retrieve(discountId)

      const { rule, metadata, regions, ...rest } = update

      if (rest.ends_at) {
        if (discount.starts_at >= new Date(update.ends_at)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `"ends_at" must be greater than "starts_at"`
          )
        }
      }

      if (regions) {
        discount.regions = await Promise.all(
          regions.map(regionId => this.regionService_.retrieve(regionId))
        )
      }

      if (metadata) {
        discount.metadata = await this.setMetadata_(discount.id, metadata)
      }

      if (rule) {
        discount.rule = this.validateDiscountRule_(rule)
      }

      for (const [key, value] of Object.entries(rest)) {
        discount[key] = value
      }

      const updated = await discountRepo.save(discount)
      return updated
    })
  }

  /**
   * Creates a dynamic code for a discount id.
   * @param {string} discountId - the id of the discount to create a code for
   * @param {string} code - the code to identify the discount by
   * @return {Promise} the newly created dynamic code
   */
  async createDynamicCode(discountId, data) {
    return this.atomicPhase_(async manager => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await this.retrieve(discountId)

      if (!discount.is_dynamic) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Discount must be set to dynamic"
        )
      }

      if (!data.code) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Discount must have a code"
        )
      }

      const toCreate = {
        ...data,
        rule_id: discount.rule_id,
        is_dynamic: true,
        is_disabled: false,
        code: data.code.toUpperCase(),
        parent_discount_id: discount.id,
        usage_limit: discount.usage_limit,
      }

      if (discount.valid_duration) {
        const lastValidDate = new Date()
        lastValidDate.setSeconds(
          lastValidDate.getSeconds() + toSeconds(parse(discount.valid_duration))
        )
        toCreate.ends_at = lastValidDate
      }
      const created = await discountRepo.create(toCreate)
      const result = await discountRepo.save(created)
      return result
    })
  }

  /**
   * Deletes a dynamic code for a discount id.
   * @param {string} discountId - the id of the discount to create a code for
   * @param {string} code - the code to identify the discount by
   * @return {Promise} the newly created dynamic code
   */
  async deleteDynamicCode(discountId, code) {
    return this.atomicPhase_(async manager => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)
      const discount = await discountRepo.findOne({
        where: { parent_discount_id: discountId, code },
      })

      if (!discount) return Promise.resolve()

      await discountRepo.softRemove(discount)

      return Promise.resolve()
    })
  }

  /**
   * Adds a valid product to the discount rule valid_for array.
   * @param {string} discountId - id of discount
   * @param {string} productId - id of product to add
   * @return {Promise} the result of the update operation
   */
  async addValidProduct(discountId, productId) {
    return this.atomicPhase_(async manager => {
      const discountRuleRepo = manager.getCustomRepository(
        this.discountRuleRepository_
      )

      const discount = await this.retrieve(discountId, {
        relations: ["rule", "rule.valid_for"],
      })

      const { rule } = discount

      const exists = rule.valid_for.find(p => p.id === productId)
      // If product is already present, we return early
      if (exists) {
        return rule
      }

      const product = await this.productService_.retrieve(productId)

      rule.valid_for = [...rule.valid_for, product]

      const updated = await discountRuleRepo.save(rule)
      return updated
    })
  }

  /**
   * Removes a product from the discount rule valid_for array
   * @param {string} discountId - id of discount
   * @param {string} productId - id of product to add
   * @return {Promise} the result of the update operation
   */
  async removeValidProduct(discountId, productId) {
    return this.atomicPhase_(async manager => {
      const discountRuleRepo = manager.getCustomRepository(
        this.discountRuleRepository_
      )

      const discount = await this.retrieve(discountId, {
        relations: ["rule", "rule.valid_for"],
      })

      const { rule } = discount

      const exists = rule.valid_for.find(p => p.id === productId)
      // If product is not present, we return early
      if (!exists) {
        return rule
      }

      rule.valid_for = rule.valid_for.filter(p => p.id !== productId)

      const updated = await discountRuleRepo.save(rule)
      return updated
    })
  }

  /**
   * Adds a region to the discount regions array.
   * @param {string} discountId - id of discount
   * @param {string} regionId - id of region to add
   * @return {Promise} the result of the update operation
   */
  async addRegion(discountId, regionId) {
    return this.atomicPhase_(async manager => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await this.retrieve(discountId, {
        relations: ["regions"],
      })

      const exists = discount.regions.find(r => r.id === regionId)
      // If region is already present, we return early
      if (exists) {
        return discount
      }

      const region = await this.regionService_.retrieve(regionId)

      discount.regions = [...discount.regions, region]

      const updated = await discountRepo.save(discount)
      return updated
    })
  }

  /**
   * Removes a region from the discount regions array.
   * @param {string} discountId - id of discount
   * @param {string} regionId - id of region to remove
   * @return {Promise} the result of the update operation
   */
  async removeRegion(discountId, regionId) {
    return this.atomicPhase_(async manager => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await this.retrieve(discountId, {
        relations: ["regions"],
      })

      const exists = discount.regions.find(r => r.id === regionId)
      // If region is not present, we return early
      if (!exists) {
        return discount
      }

      discount.regions = discount.regions.filter(r => r.id !== regionId)

      const updated = await discountRepo.save(discount)
      return updated
    })
  }

  /**
   * Deletes a discount idempotently
   * @param {string} discountId - id of discount to delete
   * @return {Promise} the result of the delete operation
   */
  async delete(discountId) {
    return this.atomicPhase_(async manager => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await discountRepo.findOne({ where: { id: discountId } })

      if (!discount) return Promise.resolve()

      await discountRepo.softRemove(discount)

      return Promise.resolve()
    })
  }

  /**
   * Decorates a discount.
   * @param {Discount} discount - the discount to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Discount} return the decorated discount.
   */
  async decorate(discountId, fields = [], expandFields = []) {
    const requiredFields = ["id", "code", "is_dynamic", "metadata"]

    fields = fields.concat(requiredFields)

    const discount = await this.retrieve(discountId, {
      select: fields,
      relations: expandFields,
    })

    // const final = await this.runDecorators_(decorated)
    return discount
  }
}

export default DiscountService
