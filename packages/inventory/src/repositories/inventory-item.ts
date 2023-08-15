import { Context, CreateInventoryItemInput, FindOptions } from "@medusajs/types"
import { InventoryItem } from "../models"

import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  DALUtils,
  InjectTransactionManager,
  MedusaContext,
  isDefined,
} from "@medusajs/utils"
import { LoadStrategy, FindOptions as MikroOptions } from "@mikro-orm/core"

type InjectedDependencies = { manager: SqlEntityManager }

// eslint-disable-next-line max-len
export class InventoryItemRepository extends DALUtils.MikroOrmAbstractBaseRepository<InventoryItem> {
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
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const where = { deleted_at: null, ...options?.where }

    const findOptions_ = { ...options, where }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.getListQuery(
      { ...options, where } as unknown as FindOptions<
        InventoryItem & { q: string; location_id?: string | string[] }
      >,
      findOptions_.options as MikroOptions<InventoryItem>,
      manager
    )
  }

  @InjectTransactionManager()
  async create(
    data: CreateInventoryItemInput[],
    @MedusaContext()
    context: Context = {}
  ): Promise<InventoryItem[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map((item) => {
      return manager.create(InventoryItem, item)
    })

    manager.persist(items)

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
    context: Context = {}
  ): Promise<InventoryItem[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const convertToEntityWithStringValues = (
      item: Omit<
        Partial<InventoryItem>,
        "id" | "created_at" | "metadata" | "deleted_at" | "updated_at"
      >
    ) => {
      const it = {
        ...item,
      }
      if (isDefined(item.weight)) {
        it.weight = item.weight!.toString() as unknown as number
      }
      if (isDefined(item.length)) {
        it.length = item.length!.toString() as unknown as number
      }
      if (isDefined(item.height)) {
        it.height = item.height!.toString() as unknown as number
      }
      if (isDefined(item.width)) {
        it.width = item.width!.toString() as unknown as number
      }

      return it
    }

    const items = data.map(({ item, update }) => {
      return manager.assign(item, convertToEntityWithStringValues(update))
    })

    await manager.persistAndFlush(items)

    return items
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    context: Context = {}
  ): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(InventoryItem, { id: { $in: ids } }, {})
  }

  async getListQuery(
    query:
      | FindOptions<
          InventoryItem & { q: string; location_id?: string | string[] }
        >
      | undefined,
    options: MikroOptions<InventoryItem>,
    manager: SqlEntityManager
  ): Promise<[InventoryItem[], number]> {
    query ??= { where: {} }

    const { q, location_id, ...selector } = query.where

    const whereStatements: any[] = []

    if (location_id) {
      const locationIds: string[] = Array.isArray(location_id)
        ? location_id
        : [location_id]

      whereStatements.push({
        inventory_levels: { location_id: { $in: locationIds } },
      })
    }

    if (q) {
      whereStatements.push({
        $or: [
          { sku: { $ilike: `%${q}%` } },
          { description: { $ilike: `%${q}%` } },
          { title: { $ilike: `%${q}%` } },
        ],
      })
    } else {
      Object.entries(selector).forEach(([k, v]) => {
        whereStatements.push({ [k]: v })
      })
    }

    if (!whereStatements.length) {
      whereStatements.push({})
    }

    let where
    if (whereStatements.length > 1) {
      where = { $and: whereStatements }
    } else {
      where = whereStatements[0]
    }

    return await manager.findAndCount(InventoryItem, where, options)
  }
}
