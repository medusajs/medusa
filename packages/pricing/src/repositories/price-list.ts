import { CreatePriceListDTO, UpdatePriceListDTO } from "@medusajs/types"
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
import { PriceList } from "@models"

export class PriceListRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceList> = { where: {} },
    context: Context = {}
  ): Promise<PriceList[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceList,
      findOptions_.where as MikroFilterQuery<PriceList>,
      findOptions_.options as MikroOptions<PriceList>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceList> = { where: {} },
    context: Context = {}
  ): Promise<[PriceList[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceList,
      findOptions_.where as MikroFilterQuery<PriceList>,
      findOptions_.options as MikroOptions<PriceList>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceList, { id: { $in: ids } }, {})
  }

  async create(
    data: Omit<CreatePriceListDTO, "rules">[],
    context: Context = {}
  ): Promise<PriceList[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const priceSets = data.map((priceSetData) => {
      return manager.create(PriceList, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }

  async update(
    data: Omit<UpdatePriceListDTO, "rules">[],
    context: Context = {}
  ): Promise<PriceList[]> {
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

    const existingPriceListMap = new Map(
      existingPriceSets.map<[string, PriceList]>((priceSet) => [
        priceSet.id,
        priceSet,
      ])
    )

    const priceSets = data.map((priceSetData) => {
      const existingPriceList = existingPriceListMap.get(priceSetData.id)

      if (!existingPriceList) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceList with id "${priceSetData.id}" not found`
        )
      }
      
      if(!!priceSetData.starts_at) { 
        priceSetData.starts_at = priceSetData.starts_at.toISOString() as any
      }

      if(!!priceSetData.ends_at) { 
        priceSetData.ends_at = priceSetData.ends_at.toISOString() as any
      }

      return manager.assign(existingPriceList, priceSetData)
    })

    manager.persist(priceSets)

    return priceSets
  }
}
