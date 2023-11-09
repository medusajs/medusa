import { Context, DAL, UpdatePriceListDTO } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceList } from "@models"
import { CreatePriceListDTO } from "../types"

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
    data: CreatePriceListDTO[],
    context: Context = {}
  ): Promise<PriceList[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const priceLists = data.map((priceListData) => {
      return manager.create(PriceList, priceListData)
    })

    manager.persist(priceLists)

    return priceLists
  }

  async update(
    data: Omit<UpdatePriceListDTO, "rules">[],
    context: Context = {}
  ): Promise<PriceList[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const priceListIds = data.map((priceListData) => priceListData.id)
    const existingPriceLists = await this.find(
      {
        where: {
          id: {
            $in: priceListIds,
          },
        },
      },
      context
    )

    const existingPriceListMap = new Map(
      existingPriceLists.map<[string, PriceList]>((priceList) => [
        priceList.id,
        priceList,
      ])
    )

    const priceLists = data.map((priceListData) => {
      const existingPriceList = existingPriceListMap.get(priceListData.id)

      if (!existingPriceList) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `PriceList with id "${priceListData.id}" not found`
        )
      }

      if (!!priceListData.starts_at) {
        priceListData.starts_at = new Date(
          priceListData.starts_at
        ).toISOString()
      }

      if (!!priceListData.ends_at) {
        priceListData.ends_at = new Date(priceListData.ends_at).toISOString()
      }

      return manager.assign(existingPriceList, priceListData)
    })

    manager.persist(priceLists)

    return priceLists
  }
}
