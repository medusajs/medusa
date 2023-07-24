import {
  Context,
  CreateInventoryLevelInput,
  FindOptions,
  UpdateInventoryLevelInput,
} from "@medusajs/types"
import { InventoryLevel, ReservationItem } from "../models"

import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import {
  FilterQuery as MikroQuery,
  LoadStrategy,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"

// eslint-disable-next-line max-len
export class InventoryLevelRepository extends AbstractBaseRepository<InventoryLevel> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    options?: FindOptions<InventoryLevel> | undefined,
    context?: Context | undefined
  ): Promise<InventoryLevel[]> {
    const [levels] = await this.findAndCount(options, context)
    return levels
  }

  async findAndCount(
    options?: FindOptions<InventoryLevel> | undefined,
    context: Context | undefined = {}
  ): Promise<[InventoryLevel[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...options }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      InventoryLevel,
      findOptions_.where as MikroQuery<InventoryLevel>,
      findOptions_.options as MikroOptions<InventoryLevel>
    )
  }

  @InjectTransactionManager()
  async create(
    data: CreateInventoryLevelInput[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<InventoryLevel[]> {
    const items = data.map((level) => {
      return (manager as SqlEntityManager).create(InventoryLevel, level)
    })

    ;(manager as SqlEntityManager).persist(items)

    return items
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<void> {
    await (manager as SqlEntityManager).nativeDelete(
      InventoryLevel,
      { id: { $in: ids } },
      {}
    )
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: InventoryLevel
      update: UpdateInventoryLevelInput
    }[],
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<InventoryLevel[]> {
    const manager = (transactionManager ?? this.manager_) as SqlEntityManager

    const items = data.map(({ item, update }) => {
      return manager.assign(item, update)
    })

    return items
  }

  @InjectTransactionManager()
  async getStockedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<number> {
    const manager = (transactionManager ?? this.manager_) as SqlEntityManager

    const builder = manager.createQueryBuilder(InventoryLevel, "il")

    const [result] = await builder
      .select("SUM(il.quantity) as sum")
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: { $in: locationIds } },
        ],
      })
      .execute()

    return result["sum"] ?? 0
  }

  @InjectTransactionManager()
  async getAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<number> {
    const manager = (transactionManager ?? this.manager_) as SqlEntityManager

    const builder = manager.createQueryBuilder(InventoryLevel, "il")

    const [result] = await builder
      .select("SUM(stocked_quantity - reserved_quantity) as sum")
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: { $in: locationIds } },
        ],
      })
      .execute()

    return result["sum"] ?? 0
  }

  @InjectTransactionManager()
  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<number> {
    const manager = (transactionManager ?? this.manager_) as SqlEntityManager

    const builder = manager.createQueryBuilder(InventoryLevel, "il")

    const [result] = await builder
      .select("SUM(reserved_quantity) as sum")
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: { $in: locationIds } },
        ],
      })
      .execute()

    return result["sum"] ?? 0
  }

  @InjectTransactionManager()
  async adjustReservedQuantity(
    inventoryItemId: string,
    locationId: string,
    quantity: number,
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<void> {
    const manager = (transactionManager ?? this.manager_) as SqlEntityManager

    const qb = manager.createQueryBuilder(InventoryLevel)

    await qb
      .update({ reserved_quantity: qb.raw(`reserved_quantity + ${quantity}`) })
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: locationId },
        ],
      })
      .execute()
  }
}
