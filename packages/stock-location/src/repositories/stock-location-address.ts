import {
  Context,
  CreateStockLocationInput,
  FindOptions,
  StockLocationAddressInput,
} from "@medusajs/types"
import { StockLocationAddress } from "../models"

import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  DALUtils,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import {
  FilterQuery as MikroQuery,
  LoadStrategy,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"

type InjectedDependencies = { manager: SqlEntityManager }

// eslint-disable-next-line max-len
export class StockLocationAddressRepository extends DALUtils.MikroOrmAbstractBaseRepository<StockLocationAddress> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    options?: FindOptions<StockLocationAddress> | undefined,
    context: Context = {}
  ): Promise<StockLocationAddress[]> {
    const [items] = await this.findAndCount(options, context)
    return items
  }

  async findAndCount(
    options?: FindOptions<StockLocationAddress> | undefined,
    context: Context = {}
  ): Promise<[StockLocationAddress[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...options }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      StockLocationAddress,
      findOptions_.where as MikroQuery<StockLocationAddress>,
      findOptions_.options as MikroOptions<StockLocationAddress>
    )
  }

  @InjectTransactionManager()
  async create(
    data: StockLocationAddressInput[],
    @MedusaContext()
    context: Context = {}
  ): Promise<StockLocationAddress[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map((item) => {
      return (manager as SqlEntityManager).create(StockLocationAddress, item)
    })

    await (manager as SqlEntityManager).persistAndFlush(items)

    return items
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: StockLocationAddress
      update: Omit<
        Partial<StockLocationAddress>,
        "id" | "created_at" | "metadata" | "deleted_at" | "updated_at"
      >
    }[],
    @MedusaContext()
    context: Context = {}
  ): Promise<StockLocationAddress[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = await Promise.all(
      data.map(async ({ item, update }) => {
        const item1 = manager.assign(item, update)
        await manager.persistAndFlush(item1)
        return item1
      })
    )

    return items
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    context: Context = {}
  ): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(StockLocationAddress, { id: { $in: ids } }, {})
  }
}
