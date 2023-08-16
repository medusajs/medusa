import {
  Context,
  CreateInventoryLevelInput,
  FindOptions,
  UpdateInventoryLevelInput,
} from "@medusajs/types"
import { InventoryLevel, ReservationItem } from "../models"

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

// eslint-disable-next-line max-len
export class InventoryLevelRepository extends DALUtils.MikroOrmAbstractBaseRepository<InventoryLevel> {
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
    context: Context = {}
  ): Promise<[InventoryLevel[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const where = { deleted_at: null, ...options?.where }
    const findOptions_ = { ...options, where }

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
    context: Context = {}
  ): Promise<InventoryLevel[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map((level) => {
      return manager.create(InventoryLevel, level)
    })

    manager.persist(items)

    return items
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    context: Context = {}
  ): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(InventoryLevel, { id: { $in: ids } }, {})
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: InventoryLevel
      update: UpdateInventoryLevelInput
    }[],
    @MedusaContext()
    context: Context = {}
  ): Promise<InventoryLevel[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map(({ item, update }) => {
      return manager.assign(item, update)
    })

    await manager.persistAndFlush(items)

    return items
  }

  @InjectTransactionManager()
  async getStockedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext()
    context: Context = {}
  ): Promise<number> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const builder = manager.createQueryBuilder(InventoryLevel, "il")

    const formattedQuery = builder
      .select("SUM(il.stocked_quantity) as sum")
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: { $in: locationIds } },
        ],
      })
      .getFormattedQuery()

    const res = await manager.execute(formattedQuery)

    return Number(res[0]["sum"]) ?? 0
  }

  @InjectTransactionManager()
  async getAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext()
    context: Context = {}
  ): Promise<number> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const builder = manager.createQueryBuilder(InventoryLevel, "il")

    const [result] = await builder
      .select("SUM(il.stocked_quantity - il.reserved_quantity) as sum")
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: { $in: locationIds } },
        ],
      })
      .execute()

    return Number(result["sum"]) ?? 0
  }

  @InjectTransactionManager()
  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext()
    context: Context = {}
  ): Promise<number> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const builder = manager.createQueryBuilder(InventoryLevel, "il")

    const [result] = await builder
      .select("SUM(il.reserved_quantity) as sum")
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: { $in: locationIds } },
        ],
      })
      .execute()

    return Number(result["sum"]) ?? 0
  }

  @InjectTransactionManager()
  async adjustReservedQuantity(
    inventoryItemId: string,
    locationId: string,
    quantity: number,
    @MedusaContext()
    context: Context = {}
  ): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const qb = manager.createQueryBuilder(InventoryLevel, "il")

    await qb
      .update({
        reserved_quantity: qb.raw(`il.reserved_quantity + ${quantity}`),
      })
      .where({
        $and: [
          { inventory_item_id: inventoryItemId },
          { location_id: locationId },
        ],
      })
      .execute()
  }
}
