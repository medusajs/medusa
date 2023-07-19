import {
  Context,
  CreateInventoryItemInput,
  DAL,
  FindOptions,
} from "@medusajs/types"
import { InventoryItem, ReservationItem } from "../models"

import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import {
  FilterQuery as MikroQuery,
  LoadStrategy,
  FindOptions as MikroOptions,
  DeepPartial,
} from "@mikro-orm/core"

type InjectedDependencies = { manager: SqlEntityManager }

// eslint-disable-next-line max-len
export class InventoryItemRepository extends AbstractBaseRepository<InventoryItem> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    options?: FindOptions<InventoryItem> | undefined,
    context: Context = {}
  ): Promise<InventoryItem[]> {
    const [items] = await this.findAndCount(options, context)
    return items
  }

  async findAndCount(
    options?: FindOptions<InventoryItem> | undefined,
    context: Context = {}
  ): Promise<[InventoryItem[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...options }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      InventoryItem,
      findOptions_.where as MikroQuery<InventoryItem>,
      findOptions_.options as MikroOptions<InventoryItem>
    )
  }

  @InjectTransactionManager()
  async create(
    data: CreateInventoryItemInput[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<InventoryItem[]> {
    const items = data.map((item) => {
      return (manager as SqlEntityManager).create(InventoryItem, item)
    })

    ;(manager as SqlEntityManager).persist(items)

    return items
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: InventoryItem
      update: Omit<
        Partial<InventoryItem>,
        "id" | "created_at" | "metadata" | "deleted_at" | "updated_at"
      >
    }[],
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<InventoryItem[]> {
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
      InventoryItem,
      { id: { $in: ids } },
      {}
    )
  }
}
