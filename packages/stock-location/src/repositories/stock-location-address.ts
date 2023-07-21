import {
  Context,
  CreateStockLocationInput,
  FindOptions,
  StockLocationAddressInput,
} from "@medusajs/types"
import { StockLocationAddress } from "../models"

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
export class StockLocationAddressRepository extends AbstractBaseRepository<StockLocationAddress> {
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
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

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
    { transactionManager: manager }: Context = {}
  ): Promise<StockLocationAddress[]> {
    const items = data.map((item) => {
      return (manager as SqlEntityManager).create(StockLocationAddress, item)
    })

    ;(manager as SqlEntityManager).persist(items)

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
    { transactionManager }: Context = {}
  ): Promise<StockLocationAddress[]> {
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
      StockLocationAddress,
      { id: { $in: ids } },
      {}
    )
  }
}
