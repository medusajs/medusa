import { Context, CreateStockLocationInput, FindOptions } from "@medusajs/types"
import { StockLocation } from "../models"

import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import {
  FilterQuery as MikroQuery,
  LoadStrategy,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"

type InjectedDependencies = { manager: SqlEntityManager }

// eslint-disable-next-line max-len
export class StockLocationRepostiory extends AbstractBaseRepository<StockLocation> {
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
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

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
    { transactionManager: manager }: Context = {}
  ): Promise<StockLocation[]> {
    const items = data.map((item) => {
      return (manager as SqlEntityManager).create(StockLocation, item)
    })

    ;(manager as SqlEntityManager).persist(items)

    return items
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: StockLocation
      update: Omit<
        Partial<StockLocation>,
        "id" | "created_at" | "metadata" | "deleted_at" | "updated_at"
      >
    }[],
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<StockLocation[]> {
    const manager = (transactionManager ?? this.manager_) as SqlEntityManager

    const items = data.map(({ item, update }) => {
      return manager.assign(item, update)
    })

    return items
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<void> {
    await (manager as SqlEntityManager).nativeDelete(
      StockLocation,
      { id: { $in: ids } },
      {}
    )
  }
}
