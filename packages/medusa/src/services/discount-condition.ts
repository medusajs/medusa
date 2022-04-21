import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { EventBusService } from "."
import { DiscountCondition, DiscountConditionType } from "../models"
import { DiscountRepository } from "../repositories/discount"
import { DiscountConditionRepository } from "../repositories/discount-condition"
import { DiscountRuleRepository } from "../repositories/discount-rule"
import { FindConfig } from "../types/common"
import { UpsertDiscountConditionInput } from "../types/discount"
import { PostgresError } from "../utils/exception-formatter"

/**
 * Provides layer to manipulate discount conditions.
 * @implements {BaseService}
 */
class DiscountConditionService extends BaseService {
  protected readonly manager_: EntityManager
  protected readonly discountRuleRepository_: typeof DiscountRuleRepository
  protected readonly discountRepository_: typeof DiscountRepository
  protected readonly discountConditionRepository_: typeof DiscountConditionRepository
  protected readonly eventBus_: EventBusService

  constructor({
    manager,
    discountRuleRepository,
    discountRepository,
    discountConditionRepository,
    eventBusService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {DiscountRuleRepository} */
    this.discountRuleRepository_ = discountRuleRepository

    /** @private @const {DiscountRepository} */
    this.discountRepository_ = discountRepository

    /** @private @const {DiscountConditionRepository} */
    this.discountConditionRepository_ = discountConditionRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager: EntityManager): DiscountConditionService {
    if (!transactionManager) {
      return this
    }

    const cloned = new DiscountConditionService({
      manager: transactionManager,
      discountRuleRepository: this.discountRuleRepository_,
      discountRepository: this.discountRepository_,
      discountConditionRepository: this.discountConditionRepository_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async retrieve(
    conditionId: string,
    config: FindConfig<DiscountCondition> = {}
  ): Promise<DiscountCondition> {
    const conditionRepo = this.manager_.getCustomRepository(
      this.discountConditionRepository_
    )

    const query = this.buildQuery_({ id: conditionId }, config)
    const condition = await conditionRepo.findOne(query)

    if (!condition) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `DiscountCondition with id: ${conditionId} was not found`
      )
    }

    return condition
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

  async upsertCondition(
    discountId: string,
    data: UpsertDiscountConditionInput
  ): Promise<void> {
    const resolvedConditionType = this.resolveConditionType_(data)

    if (!resolvedConditionType) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Missing one of products, collections, tags, types or customer groups in data`
      )
    }

    return await this.atomicPhase_(
      async (manager: EntityManager) => {
        const discountConditionRepo: DiscountConditionRepository =
          manager.getCustomRepository(this.discountConditionRepository_)
        const discountRepo: DiscountRepository = manager.getCustomRepository(
          this.discountRepository_
        )

        if (data.id) {
          // throw if condition does not exist
          const condition = await this.retrieve(data.id)

          return await discountConditionRepo.addConditionResources(
            condition.id,
            resolvedConditionType.resource_ids,
            resolvedConditionType.type,
            true
          )
        }

        const discount = await discountRepo.findOne({
          where: { id: discountId },
          relations: ["rule", "rule.conditions"],
        })

        if (!discount) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Discount with ${discountId} was not found`
          )
        }

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
  }

  async remove(discountConditionId): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const conditionRepo = manager.getCustomRepository(
        this.discountConditionRepository_
      )

      const condition = await conditionRepo.findOne({
        where: { id: discountConditionId },
      })

      if (!condition) {
        return Promise.resolve()
      }

      return await conditionRepo.remove(condition)
    })
  }
}

export default DiscountConditionService
