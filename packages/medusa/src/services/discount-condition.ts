import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { EventBusService } from "."
import {
  DiscountCondition,
  DiscountConditionCustomerGroup,
  DiscountConditionProduct,
  DiscountConditionProductCollection,
  DiscountConditionProductTag,
  DiscountConditionProductType,
  DiscountConditionType,
} from "../models"
import { DiscountConditionRepository } from "../repositories/discount-condition"
import { FindConfig } from "../types/common"
import { UpsertDiscountConditionInput } from "../types/discount"
import { TransactionBaseService } from "../interfaces"
import { buildQuery, PostgresError } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  discountConditionRepository: typeof DiscountConditionRepository
  eventBusService: EventBusService
}

/**
 * Provides layer to manipulate discount conditions.
 * @implements {BaseService}
 */
class DiscountConditionService extends TransactionBaseService {
  // eslint-disable-next-line max-len
  protected readonly discountConditionRepository_: typeof DiscountConditionRepository
  protected readonly eventBus_: EventBusService

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor({
    manager,
    discountConditionRepository,
    eventBusService,
  }: InjectedDependencies) {
    super({ manager, discountConditionRepository, eventBusService })

    this.manager_ = manager
    this.discountConditionRepository_ = discountConditionRepository
    this.eventBus_ = eventBusService
  }

  async retrieve(
    conditionId: string,
    config?: FindConfig<DiscountCondition>
  ): Promise<DiscountCondition | never> {
    const manager = this.manager_
    const conditionRepo = manager.getCustomRepository(
      this.discountConditionRepository_
    )

    const query = buildQuery({ id: conditionId }, config)

    const condition = await conditionRepo.findOne(query)

    if (!condition) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `DiscountCondition with id ${conditionId} was not found`
      )
    }

    return condition
  }

  protected static resolveConditionType_(data: UpsertDiscountConditionInput):
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
    data: UpsertDiscountConditionInput
  ): Promise<
    (
      | DiscountConditionProduct
      | DiscountConditionProductType
      | DiscountConditionProductCollection
      | DiscountConditionProductTag
      | DiscountConditionCustomerGroup
    )[]
  > {
    let resolvedConditionType

    return await this.atomicPhase_(
      async (manager: EntityManager) => {
        resolvedConditionType =
          DiscountConditionService.resolveConditionType_(data)

        if (!resolvedConditionType) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Missing one of products, collections, tags, types or customer groups in data`
          )
        }

        const discountConditionRepo: DiscountConditionRepository =
          manager.getCustomRepository(this.discountConditionRepository_)

        if (data.id) {
          const resolvedCondition = await this.retrieve(data.id)

          if (data.operator && data.operator !== resolvedCondition.operator) {
            resolvedCondition.operator = data.operator
            await discountConditionRepo.save(resolvedCondition)
          }

          return await discountConditionRepo.addConditionResources(
            data.id,
            resolvedConditionType.resource_ids,
            resolvedConditionType.type,
            true
          )
        }

        const created = discountConditionRepo.create({
          discount_rule_id: data.rule_id,
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

  async delete(discountConditionId: string): Promise<DiscountCondition | void> {
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
