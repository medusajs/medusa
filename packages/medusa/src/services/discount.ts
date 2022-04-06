import { parse, toSeconds } from "iso8601-duration"
import { isEmpty, omit } from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { Brackets, EntityManager, ILike, SelectQueryBuilder } from "typeorm"
import {
  EventBusService,
  ProductService,
  RegionService,
  TotalsService,
} from "."
import { Cart } from "../models/cart"
import { Discount } from "../models/discount"
import { DiscountConditionType } from "../models/discount-condition"
import {
  AllocationType as DiscountAllocation,
  DiscountRule,
  DiscountRuleType,
} from "../models/discount-rule"
import { LineItem } from "../models/line-item"
import { DiscountRepository } from "../repositories/discount"
import { DiscountConditionRepository } from "../repositories/discount-condition"
import { DiscountRuleRepository } from "../repositories/discount-rule"
import { GiftCardRepository } from "../repositories/gift-card"
import { FindConfig } from "../types/common"
import {
  CreateDiscountInput,
  CreateDynamicDiscountInput,
  FilterableDiscountProps,
  UpdateDiscountInput,
  UpsertDiscountConditionInput,
} from "../types/discount"
import { formatException, PostgresError } from "../utils/exception-formatter"

/**
 * Provides layer to manipulate discounts.
 * @implements {BaseService}
 */
class DiscountService extends BaseService {
  private manager_: EntityManager
  private discountRepository_: typeof DiscountRepository
  private discountRuleRepository_: typeof DiscountRuleRepository
  private giftCardRepository_: typeof GiftCardRepository
  private discountConditionRepository_: typeof DiscountConditionRepository
  private totalsService_: TotalsService
  private productService_: ProductService
  private regionService_: RegionService
  private eventBus_: EventBusService

  constructor({
    manager,
    discountRepository,
    discountRuleRepository,
    giftCardRepository,
    discountConditionRepository,
    totalsService,
    productService,
    regionService,
    customerService,
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

    /** @private @const {DiscountConditionRepository} */
    this.discountConditionRepository_ = discountConditionRepository

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {CustomerService} */
    this.customerService_ = customerService

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager: EntityManager): DiscountService {
    if (!transactionManager) {
      return this
    }

    const cloned = new DiscountService({
      manager: transactionManager,
      discountRepository: this.discountRepository_,
      discountRuleRepository: this.discountRuleRepository_,
      giftCardRepository: this.giftCardRepository_,
      discountConditionRepository: this.discountConditionRepository_,
      totalsService: this.totalsService_,
      productService: this.productService_,
      regionService: this.regionService_,
      customerService: this.customerService_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager
    cloned.manager_ = transactionManager

    return cloned
  }

  /**
   * Creates a discount rule with provided data given that the data is validated.
   * @param {DiscountRule} discountRule - the discount rule to create
   * @return {Promise} the result of the create operation
   */
  validateDiscountRule_(discountRule): DiscountRule {
    const schema = Validator.object().keys({
      id: Validator.string().optional(),
      description: Validator.string().optional(),
      type: Validator.string().required(),
      value: Validator.number().min(0).required(),
      allocation: Validator.string().required(),
      created_at: Validator.date().optional(),
      updated_at: Validator.date().allow(null).optional(),
      deleted_at: Validator.date().allow(null).optional(),
      metadata: Validator.object().allow(null).optional(),
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
   * @param {Object} config - the config object containing query settings
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: FilterableDiscountProps = {},
    config: FindConfig<Discount> = { relations: [], skip: 0, take: 10 }
  ): Promise<Discount[]> {
    const discountRepo = this.manager_.getCustomRepository(
      this.discountRepository_
    )

    const query = this.buildQuery_(selector, config)
    return discountRepo.find(query)
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config object containing query settings
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: FilterableDiscountProps = {},
    config: FindConfig<Discount> = {
      take: 20,
      skip: 0,
      order: { created_at: "DESC" },
    }
  ): Promise<[Discount[], number]> {
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

      query.where = (qb: SelectQueryBuilder<Discount>): void => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
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
  async create(discount: CreateDiscountInput): Promise<Discount> {
    return this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)
      const ruleRepo = manager.getCustomRepository(this.discountRuleRepository_)

      const conditions = discount.rule?.conditions

      const ruleToCreate = omit(discount.rule, ["conditions"])
      discount.rule = ruleToCreate

      const validatedRule = this.validateDiscountRule_(discount.rule)

      if (
        discount?.regions &&
        discount?.regions.length > 1 &&
        discount?.rule?.type === "fixed"
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Fixed discounts can have one region"
        )
      }
      try {
        if (discount.regions) {
          discount.regions = await Promise.all(
            discount.regions.map((regionId) =>
              this.regionService_.withTransaction(manager).retrieve(regionId)
            )
          )
        }

        const discountRule = await ruleRepo.create(validatedRule)
        const createdDiscountRule = await ruleRepo.save(discountRule)

        discount.code = discount.code!.toUpperCase()
        discount.rule = createdDiscountRule

        const created = await discountRepo.create(discount)
        const result = await discountRepo.save(created)

        if (conditions?.length) {
          for (const cond of conditions) {
            await this.upsertDiscountCondition_(result.id, cond)
          }
        }

        return result
      } catch (error) {
        throw formatException(error)
      }
    })
  }

  /**
   * Gets a discount by id.
   * @param {string} discountId - id of discount to retrieve
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Discount>} the discount
   */
  async retrieve(
    discountId: string,
    config: FindConfig<Discount> = {}
  ): Promise<Discount> {
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
   * @param {array} relations - list of relations
   * @return {Promise<Discount>} the discount document
   */
  async retrieveByCode(
    discountCode: string,
    relations: string[] = []
  ): Promise<Discount> {
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
  async update(
    discountId: string,
    update: UpdateDiscountInput
  ): Promise<Discount> {
    return this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await this.retrieve(discountId, {
        relations: ["rule"],
      })

      const conditions = update?.rule?.conditions
      const ruleToUpdate = omit(update.rule, "conditions")

      if (!isEmpty(ruleToUpdate)) {
        update.rule = ruleToUpdate
      }

      const { rule, metadata, regions, ...rest } = update

      if (rest.ends_at) {
        if (discount.starts_at >= new Date(rest.ends_at)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `"ends_at" must be greater than "starts_at"`
          )
        }
      }

      if (regions && regions?.length > 1 && discount.rule.type === "fixed") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Fixed discounts can have one region"
        )
      }

      if (conditions?.length) {
        for (const cond of conditions) {
          await this.upsertDiscountCondition_(discount.id, cond)
        }
      }

      if (regions) {
        discount.regions = await Promise.all(
          regions.map((regionId) => this.regionService_.retrieve(regionId))
        )
      }

      if (metadata) {
        discount.metadata = await this.setMetadata_(discount.id, metadata)
      }

      if (rule) {
        discount.rule = this.validateDiscountRule_(ruleToUpdate)
      }

      for (const key of Object.keys(rest).filter(
        (k) => typeof rest[k] !== `undefined`
      )) {
        discount[key] = rest[key]
      }

      discount.code = discount.code.toUpperCase()

      const updated = await discountRepo.save(discount)
      return updated
    })
  }

  /**
   * Creates a dynamic code for a discount id.
   * @param {string} discountId - the id of the discount to create a code for
   * @param {Object} data - the object containing a code to identify the discount by
   * @return {Promise} the newly created dynamic code
   */
  async createDynamicCode(
    discountId: string,
    data: CreateDynamicDiscountInput
  ): Promise<Discount> {
    return this.atomicPhase_(async (manager) => {
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
  async deleteDynamicCode(discountId: string, code: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)
      const discount = await discountRepo.findOne({
        where: { parent_discount_id: discountId, code },
      })

      if (!discount) {
        return Promise.resolve()
      }

      await discountRepo.softRemove(discount)

      return Promise.resolve()
    })
  }

  /**
   * Adds a region to the discount regions array.
   * @param {string} discountId - id of discount
   * @param {string} regionId - id of region to add
   * @return {Promise} the result of the update operation
   */
  async addRegion(discountId: string, regionId: string): Promise<Discount> {
    return this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await this.retrieve(discountId, {
        relations: ["regions", "rule"],
      })

      const exists = discount.regions.find((r) => r.id === regionId)
      // If region is already present, we return early
      if (exists) {
        return discount
      }

      if (discount.regions?.length === 1 && discount.rule.type === "fixed") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Fixed discounts can have one region"
        )
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
  async removeRegion(discountId: string, regionId: string): Promise<Discount> {
    return this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await this.retrieve(discountId, {
        relations: ["regions"],
      })

      const exists = discount.regions.find((r) => r.id === regionId)
      // If region is not present, we return early
      if (!exists) {
        return discount
      }

      discount.regions = discount.regions.filter((r) => r.id !== regionId)

      const updated = await discountRepo.save(discount)
      return updated
    })
  }

  /**
   * Deletes a discount idempotently
   * @param {string} discountId - id of discount to delete
   * @return {Promise} the result of the delete operation
   */
  async delete(discountId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.discountRepository_)

      const discount = await discountRepo.findOne({ where: { id: discountId } })

      if (!discount) {
        return Promise.resolve()
      }

      await discountRepo.softRemove(discount)

      return Promise.resolve()
    })
  }

  resolveConditionType_(data: UpsertDiscountConditionInput):
    | {
        type: DiscountConditionType
        resource_ids: string[]
      }
    | undefined {
    switch (true) {
      case !!data.products?.length:
        return {
          type: DiscountConditionType.PRODUCTS,
          resource_ids: data.products!,
        }
      case !!data.product_collections?.length:
        return {
          type: DiscountConditionType.PRODUCT_COLLECTIONS,
          resource_ids: data.product_collections!,
        }
      case !!data.product_types?.length:
        return {
          type: DiscountConditionType.PRODUCT_TYPES,
          resource_ids: data.product_types!,
        }
      case !!data.product_tags?.length:
        return {
          type: DiscountConditionType.PRODUCT_TAGS,
          resource_ids: data.product_tags!,
        }
      case !!data.customer_groups?.length:
        return {
          type: DiscountConditionType.CUSTOMER_GROUPS,
          resource_ids: data.customer_groups!,
        }
      default:
        return undefined
    }
  }

  async upsertDiscountCondition_(
    discountId: string,
    data: UpsertDiscountConditionInput
  ): Promise<void> {
    const resolvedConditionType = this.resolveConditionType_(data)

    const res = this.atomicPhase_(
      async (manager) => {
        const discountConditionRepo: DiscountConditionRepository =
          manager.getCustomRepository(this.discountConditionRepository_)

        if (!resolvedConditionType) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Missing one of products, collections, tags, types or customer groups in data`
          )
        }

        if (data.id) {
          return await discountConditionRepo.addConditionResources(
            data.id,
            resolvedConditionType.resource_ids,
            resolvedConditionType.type,
            true
          )
        }

        const discount = await this.retrieve(discountId, {
          relations: ["rule", "rule.conditions"],
        })

        const created = discountConditionRepo.create({
          discount_rule_id: discount.rule_id,
          operator: data.operator,
          type: resolvedConditionType.type,
        })

        const discountCondition = await discountConditionRepo.save(created)

        return await discountConditionRepo.addConditionResources(
          discountCondition.id,
          resolvedConditionType.resource_ids,
          resolvedConditionType.type
        )
      },
      async (err: { code: string }) => {
        if (err.code === PostgresError.DUPLICATE_ERROR) {
          // A unique key constraint failed meaning the combination of
          // discount rule id, type, and operator already exists in the db.
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            `Discount Condition with operator '${data.operator}' and type '${resolvedConditionType?.type}' already exist on a Discount Rule`
          )
        }
      }
    )

    return res
  }

  async validateDiscountForProduct(
    discountRuleId: string,
    productId: string | undefined
  ): Promise<boolean> {
    return this.atomicPhase_(async (manager) => {
      const discountConditionRepo: DiscountConditionRepository =
        manager.getCustomRepository(this.discountConditionRepository_)

      // In case of custom line items, we don't have a product id.
      // Instead of throwing, we simply invalidate the discount.
      if (!productId) {
        return false
      }

      const product = await this.productService_.retrieve(productId, {
        relations: ["tags"],
      })

      return await discountConditionRepo.isValidForProduct(
        discountRuleId,
        product.id
      )
    })
  }

  async calculateDiscountForLineItem(
    discountId: string,
    lineItem: LineItem,
    cart: Cart
  ): Promise<number> {
    let adjustment = 0

    if (!lineItem.allow_discounts) {
      return adjustment
    }

    const discount = await this.retrieve(discountId, { relations: ["rule"] })

    const { type, value, allocation } = discount.rule

    const fullItemPrice = lineItem.unit_price * lineItem.quantity

    if (type === DiscountRuleType.PERCENTAGE) {
      adjustment = Math.round((fullItemPrice / 100) * value)
    } else if (
      type === DiscountRuleType.FIXED &&
      allocation === DiscountAllocation.TOTAL
    ) {
      // when a fixed discount should be applied to the total,
      // we create line adjustments for each item with an amount
      // relative to the subtotal
      const subtotal = this.totalsService_.getSubtotal(cart, {
        excludeNonDiscounts: true,
      })
      const nominator = Math.min(value, subtotal)
      const itemRelativeToSubtotal = lineItem.unit_price / subtotal
      const totalItemPercentage = itemRelativeToSubtotal * lineItem.quantity
      adjustment = Math.round(nominator * totalItemPercentage)
    } else {
      adjustment = value * lineItem.quantity
    }
    // if the amount of the discount exceeds the total price of the item,
    // we return the total item price, else the fixed amount
    return adjustment >= fullItemPrice ? fullItemPrice : adjustment
  }

  async canApplyForCustomer(
    discountRuleId: string,
    customerId: string | undefined
  ): Promise<boolean> {
    return this.atomicPhase_(async (manager) => {
      const discountConditionRepo: DiscountConditionRepository =
        manager.getCustomRepository(this.discountConditionRepository_)

      // Instead of throwing on missing customer id, we simply invalidate the discount
      if (!customerId) {
        return false
      }

      const customer = await this.customerService_.retrieve(customerId, {
        relations: ["groups"],
      })

      return await discountConditionRepo.canApplyForCustomer(
        discountRuleId,
        customer.id
      )
    })
  }
}

export default DiscountService
