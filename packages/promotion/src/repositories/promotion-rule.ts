import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError, arrayDifference } from "@medusajs/utils"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"

import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PromotionRule } from "@models"
import { CreatePromotionRuleDTO, UpdatePromotionRuleDTO } from "@types"

export class PromotionRuleRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PromotionRule> = { where: {} },
    context: Context = {}
  ): Promise<PromotionRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    return await manager.find(
      PromotionRule,
      findOptions_.where as MikroFilterQuery<PromotionRule>,
      findOptions_.options as MikroOptions<PromotionRule>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PromotionRule> = { where: {} },
    context: Context = {}
  ): Promise<[PromotionRule[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    return await manager.findAndCount(
      PromotionRule,
      findOptions_.where as MikroFilterQuery<PromotionRule>,
      findOptions_.options as MikroOptions<PromotionRule>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PromotionRule, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePromotionRuleDTO[],
    context: Context = {}
  ): Promise<PromotionRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const promotionRule = data.map((promotionRule) => {
      return manager.create(PromotionRule, promotionRule)
    })

    manager.persist(promotionRule)

    return promotionRule
  }

  async update(
    data: UpdatePromotionRuleDTO[],
    context: Context = {}
  ): Promise<PromotionRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const promotionRuleIds = data.map((promotionRule) => promotionRule.id)
    const existingPromotionRules = await this.find(
      {
        where: {
          id: {
            $in: promotionRuleIds,
          },
        },
      },
      context
    )

    const dataAndExistingIdDifference = arrayDifference(
      data.map((d) => d.id),
      existingPromotionRules.map((plr) => plr.id)
    )

    if (dataAndExistingIdDifference.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `PromotionRule with id(s) "${dataAndExistingIdDifference.join(
          ", "
        )}" not found`
      )
    }

    const existingPromotionRuleMap = new Map(
      existingPromotionRules.map<[string, PromotionRule]>((promotionRule) => [
        promotionRule.id,
        promotionRule,
      ])
    )

    const promotionRule = data.map((promotionRuleData) => {
      const existingPromotionRule = existingPromotionRuleMap.get(
        promotionRuleData.id
      )!

      return manager.assign(existingPromotionRule, promotionRuleData)
    })

    manager.persist(promotionRule)

    return promotionRule
  }
}
