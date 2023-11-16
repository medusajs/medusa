import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError, arrayDifference } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceListRuleValue } from "@models"
import {
  CreatePriceListRuleValueDTO,
  UpdatePriceListRuleValueDTO,
} from "../types"

export class PriceListRuleValueRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceListRuleValue> = { where: {} },
    context: Context = {}
  ): Promise<PriceListRuleValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceListRuleValue,
      findOptions_.where as MikroFilterQuery<PriceListRuleValue>,
      findOptions_.options as MikroOptions<PriceListRuleValue>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceListRuleValue> = { where: {} },
    context: Context = {}
  ): Promise<[PriceListRuleValue[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceListRuleValue,
      findOptions_.where as MikroFilterQuery<PriceListRuleValue>,
      findOptions_.options as MikroOptions<PriceListRuleValue>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(PriceListRuleValue, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePriceListRuleValueDTO[],
    context: Context = {}
  ): Promise<PriceListRuleValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const priceListRuleValues = data.map((priceRuleValueData) => {
      const { price_list_rule_id: priceListRuleId, ...priceRuleValue } =
        priceRuleValueData

      if (priceListRuleId) {
        priceRuleValue.price_list_rule = priceListRuleId
      }

      return manager.create(PriceListRuleValue, priceRuleValue)
    })

    manager.persist(priceListRuleValues)

    return priceListRuleValues
  }

  async update(
    data: UpdatePriceListRuleValueDTO[],
    context: Context = {}
  ): Promise<PriceListRuleValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const priceValueIds = data.map(
      (priceRuleValueData) => priceRuleValueData.id
    )
    const existingPriceValues = await this.find(
      {
        where: {
          id: {
            $in: priceValueIds,
          },
        },
      },
      context
    )

    const dataAndExistingIdDifference = arrayDifference(
      data.map((d) => d.id),
      existingPriceValues.map((pv) => pv.id)
    )

    if (dataAndExistingIdDifference.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `PriceListRuleValue with id(s) "${dataAndExistingIdDifference.join(
          ", "
        )}" not found`
      )
    }

    const existingValuesMap = new Map(
      existingPriceValues.map<[string, PriceListRuleValue]>((priceValue) => [
        priceValue.id,
        priceValue,
      ])
    )

    const priceValues = data.map((priceRuleValueData) => {
      const existingPriceValue = existingValuesMap.get(priceRuleValueData.id)!

      return manager.assign(existingPriceValue, priceRuleValueData)
    })

    manager.persist(priceValues)

    return priceValues
  }
}
