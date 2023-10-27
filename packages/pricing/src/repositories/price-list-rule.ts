import { CreatePriceListRuleDTO, UpdatePriceListRuleDTO } from "@medusajs/types"
import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceListRule } from "@models"

export class PriceListRuleRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceListRule> = { where: {} },
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceListRule,
      findOptions_.where as MikroFilterQuery<PriceListRule>,
      findOptions_.options as MikroOptions<PriceListRule>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceListRule> = { where: {} },
    context: Context = {}
  ): Promise<[PriceListRule[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceListRule,
      findOptions_.where as MikroFilterQuery<PriceListRule>,
      findOptions_.options as MikroOptions<PriceListRule>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceListRule, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const priceSets = data.map((priceSetData) => {
      return manager.create(PriceListRule, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }

  async update(
    data: UpdatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const priceSetIds = data.map((priceSetData) => priceSetData.id)
    const existingPriceSets = await this.find(
      {
        where: {
          id: {
            $in: priceSetIds,
          },
        },
      },
      context
    )

    const existingPriceSetMap = new Map(
      existingPriceSets.map<[string, PriceListRule]>((priceSet) => [
        priceSet.id,
        priceSet,
      ])
    )

    const priceSets = data.map((priceSetData) => {
      const existingPriceSet = existingPriceSetMap.get(priceSetData.id)

      if (!existingPriceSet) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceListRule with id "${priceSetData.id}" not found`
        )
      }

      return manager.assign(existingPriceSet, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }
}
