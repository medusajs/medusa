import { Context, CreateStockLocationInput, FindOptions } from "@medusajs/types"
import { StockLocation, StockLocationAddress } from "../models"

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
  wrap,
} from "@mikro-orm/core"

type InjectedDependencies = { manager: SqlEntityManager }

// eslint-disable-next-line max-len
export class StockLocationRepostiory extends DALUtils.MikroOrmAbstractBaseRepository<StockLocation> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    options?: FindOptions<StockLocation> | undefined,
    context: Context = {}
  ): Promise<StockLocation[]> {
    const [items] = await this.findAndCount(options, context)
    return items
  }

  async findAndCount(
    options?: FindOptions<StockLocation> | undefined,
    context: Context = {}
  ): Promise<[StockLocation[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...options }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      StockLocation,
      findOptions_.where as MikroQuery<StockLocation>,
      findOptions_.options as MikroOptions<StockLocation>
    )
  }

  @InjectTransactionManager()
  async create(
    data: CreateStockLocationInput[],
    @MedusaContext()
    context: Context = {}
  ): Promise<StockLocation[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map((item) => {
      return manager.create(StockLocation, item)
    })

    manager.persist(items)

    return items
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: StockLocation
      update: Omit<
        Partial<StockLocation>,
        "id" | "created_at" | "deleted_at" | "updated_at"
      >
    }[],
    @MedusaContext()
    context: Context = {}
  ): Promise<StockLocation[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map(({ item, update }) => {
      return manager.assign<StockLocation>(item, update)
    })

    await (manager as SqlEntityManager).persistAndFlush(items)

    return items
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    context: Context = {}
  ): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(StockLocation, { id: { $in: ids } }, {})
  }
}
