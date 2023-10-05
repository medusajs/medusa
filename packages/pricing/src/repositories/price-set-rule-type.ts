import {
  Context,
  DAL,
  UpdatePriceSetDTO,
  CreatePriceSetRuleTypeDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet, PriceSetRuleType, RuleType } from "@models"

export class PriceSetRuleTypeRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceSetRuleType> = { where: {} },
    context: Context = {}
  ): Promise<PriceSetRuleType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceSetRuleType,
      findOptions_.where as MikroFilterQuery<PriceSetRuleType>,
      findOptions_.options as MikroOptions<PriceSetRuleType>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceSetRuleType> = { where: {} },
    context: Context = {}
  ): Promise<[PriceSetRuleType[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceSetRuleType,
      findOptions_.where as MikroFilterQuery<PriceSetRuleType>,
      findOptions_.options as MikroOptions<PriceSetRuleType>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceSetRuleType, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePriceSetRuleTypeDTO[],
    context: Context = {}
  ): Promise<PriceSetRuleType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const priceSets = data.map((priceSetData) => {
      return manager.create(PriceSetRuleType, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }

  async update(
    data: UpdatePriceSetDTO[],
    context: Context = {}
  ): Promise<PriceSetRuleType[]> {
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
      existingPriceSets.map<[string, PriceSetRuleType]>((priceSet) => [
        priceSet.id,
        priceSet,
      ])
    )

    const priceSets = data.map((priceSetData) => {
      const existingPriceSet = existingPriceSetMap.get(priceSetData.id)

      if (!existingPriceSet) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceSetRuleType with id "${priceSetData.id}" not found`
        )
      }

      return manager.assign(existingPriceSet, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }
}
