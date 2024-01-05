import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError, arrayDifference } from "@medusajs/utils"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"

import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PromotionRuleValue } from "@models"
import {
  CreatePromotionRuleValueDTO,
  UpdatePromotionRuleValueDTO,
} from "@types"

export class PromotionRuleValueRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PromotionRuleValue> = { where: {} },
    context: Context = {}
  ): Promise<PromotionRuleValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    return await manager.find(
      PromotionRuleValue,
      findOptions_.where as MikroFilterQuery<PromotionRuleValue>,
      findOptions_.options as MikroOptions<PromotionRuleValue>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PromotionRuleValue> = { where: {} },
    context: Context = {}
  ): Promise<[PromotionRuleValue[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    return await manager.findAndCount(
      PromotionRuleValue,
      findOptions_.where as MikroFilterQuery<PromotionRuleValue>,
      findOptions_.options as MikroOptions<PromotionRuleValue>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PromotionRuleValue, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePromotionRuleValueDTO[],
    context: Context = {}
  ): Promise<PromotionRuleValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const promotionRuleValue = data.map((promotionRuleValue) => {
      return manager.create(PromotionRuleValue, promotionRuleValue)
    })

    manager.persist(promotionRuleValue)

    return promotionRuleValue
  }

  async update(
    data: UpdatePromotionRuleValueDTO[],
    context: Context = {}
  ): Promise<PromotionRuleValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const promotionRuleValueIds = data.map(
      (promotionRuleValue) => promotionRuleValue.id
    )
    const existingPromotionRuleValues = await this.find(
      {
        where: {
          id: {
            $in: promotionRuleValueIds,
          },
        },
      },
      context
    )

    const dataAndExistingIdDifference = arrayDifference(
      data.map((d) => d.id),
      existingPromotionRuleValues.map((plr) => plr.id)
    )

    if (dataAndExistingIdDifference.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `PromotionRuleValue with id(s) "${dataAndExistingIdDifference.join(
          ", "
        )}" not found`
      )
    }

    const existingPromotionRuleValueMap = new Map(
      existingPromotionRuleValues.map<[string, PromotionRuleValue]>(
        (promotionRuleValue) => [promotionRuleValue.id, promotionRuleValue]
      )
    )

    const promotionRuleValue = data.map((promotionRuleValueData) => {
      const existingPromotionRuleValue = existingPromotionRuleValueMap.get(
        promotionRuleValueData.id
      )!

      return manager.assign(existingPromotionRuleValue, promotionRuleValueData)
    })

    manager.persist(promotionRuleValue)

    return promotionRuleValue
  }
}
