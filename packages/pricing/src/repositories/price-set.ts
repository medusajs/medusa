import { UpdatePriceListDTO } from "@medusajs/types"
import {
  Context,
  DAL,
  UpdatePriceSetDTO,
  CreatePriceSetDTO,
} from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet } from "@models"

export class PriceSetRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceSet> = { where: {} },
    context: Context = {}
  ): Promise<PriceSet[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceSet,
      findOptions_.where as MikroFilterQuery<PriceSet>,
      findOptions_.options as MikroOptions<PriceSet>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceSet> = { where: {} },
    context: Context = {}
  ): Promise<[PriceSet[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceSet,
      findOptions_.where as MikroFilterQuery<PriceSet>,
      findOptions_.options as MikroOptions<PriceSet>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceSet, { id: { $in: ids } }, {})
  }

  async create(
    data: Omit<CreatePriceSetDTO, "rules">[],
    context: Context = {}
  ): Promise<PriceSet[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const priceSets = data.map((priceSetData) => {
      return manager.create(PriceSet, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }

  async update(
    data: Omit<UpdatePriceListDTO, "rules">[],
    context: Context = {}
  ): Promise<PriceSet[]> {
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
      existingPriceSets.map<[string, PriceSet]>((priceSet) => [
        priceSet.id,
        priceSet,
      ])
    )

    const priceSets = data.map((priceSetData) => {
      const existingPriceSet = existingPriceSetMap.get(priceSetData.id)

      if (!existingPriceSet) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceSet with id "${priceSetData.id}" not found`
        )
      }

      return manager.assign(existingPriceSet, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }
}
