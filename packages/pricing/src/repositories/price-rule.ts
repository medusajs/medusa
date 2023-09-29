import {
  Context,
  CreatePriceRuleDTO,
  DAL,
  UpdatePriceRuleDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { PriceRule } from "@models"

import { SqlEntityManager } from "@mikro-orm/postgresql"

export class PriceRuleRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceRule> = { where: {} },
    context: Context = {}
  ): Promise<PriceRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceRule,
      findOptions_.where as MikroFilterQuery<PriceRule>,
      findOptions_.options as MikroOptions<PriceRule>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceRule> = { where: {} },
    context: Context = {}
  ): Promise<[PriceRule[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceRule,
      findOptions_.where as MikroFilterQuery<PriceRule>,
      findOptions_.options as MikroOptions<PriceRule>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceRule, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePriceRuleDTO[],
    context: Context = {}
  ): Promise<PriceRule[]> {
    const manager: SqlEntityManager =
      this.getActiveManager<SqlEntityManager>(context)

    const toCreate = data.map((ruleData) => {
      const ruleDataClone = { ...ruleData } as any

      ruleDataClone.rule_type ??= ruleData.rule_type_id
      ruleDataClone.price_set ??= ruleData.price_set_id
      ruleDataClone.price_set_money_amount ??=
        ruleData.price_set_money_amount_id

      return ruleDataClone
    })

    const priceRules = toCreate.map((ruleData) => {
      return manager.create(PriceRule, ruleData)
    })

    manager.persist(priceRules)

    return priceRules
  }

  async update(
    data: UpdatePriceRuleDTO[],
    context: Context = {}
  ): Promise<PriceRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const priceRuleIds = data.map((priceRuleData) => priceRuleData.id)
    const existingPriceRules = await this.find(
      {
        where: {
          id: {
            $in: priceRuleIds,
          },
        },
      },
      context
    )

    const existingPriceRulesMap = new Map(
      existingPriceRules.map<[string, PriceRule]>((priceRule) => [
        priceRule.id,
        priceRule,
      ])
    )

    const priceRules = data.map((priceRuleData) => {
      const existingPriceRule = existingPriceRulesMap.get(priceRuleData.id)

      if (!existingPriceRule) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceRule with id "${priceRuleData.id}" not found`
        )
      }

      return manager.assign(existingPriceRule, priceRuleData)
    })

    manager.persist(priceRules)

    return priceRules
  }
}
