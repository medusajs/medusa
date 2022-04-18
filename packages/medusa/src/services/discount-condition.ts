import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { EventBusService } from "."
import { DiscountConditionRepository } from "../repositories/discount-condition"
import { DiscountRuleRepository } from "../repositories/discount-rule"
import { UpsertDiscountConditionInput } from "../types/discount"
import { PostgresError } from "../utils/exception-formatter"

/**
 * Provides layer to manipulate discounts.
 * @implements {BaseService}
 */
class DiscountConditionService extends BaseService {
  private manager_: EntityManager
  private discountRuleRepository_: typeof DiscountRuleRepository
  private discountConditionRepository_: typeof DiscountConditionRepository
  private eventBus_: EventBusService

  constructor({
    manager,
    discountRuleRepository,
    discountConditionRepository,
    eventBusService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {DiscountRuleRepository} */
    this.discountRuleRepository_ = discountRuleRepository

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
      discountConditionRepository: this.discountConditionRepository_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager
    cloned.manager_ = transactionManager

    return cloned
  }

  async upsertCondition(
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

  async remove(discountConditionId): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const conditionRepo = manager.getCustomRepository(
        this.discountConditionRepository_
      )

      const condition = await conditionRepo.findOne({
        where: { id: discountConditionId },
      })

      if (!condition) {
        return Promise.resolve()
      }

      await conditionRepo.remove(condition)

      return Promise.resolve()
    })
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

export default DiscountConditionService
