import { Context, DAL, FindOptions } from "@medusajs/types"
import { InventoryItem, ReservationItem } from "../models"

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
export class InventoryItemRepository extends AbstractBaseRepository<InventoryItem> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  @InjectTransactionManager()
  async find(
    options?: FindOptions<InventoryItem> | undefined,
    @MedusaContext()
    context: Context = {}
  ): Promise<InventoryItem[]> {
    const [items] = await this.findAndCount(options, context)
    return items
  }

  @InjectTransactionManager()
  async findAndCount(
    options?: FindOptions<InventoryItem> | undefined,
    @MedusaContext()
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

  async create(
    data: unknown[],
    context?: Context | undefined
  ): Promise<InventoryItem[]> {
    throw new Error("Method not implemented.")
  }
  async delete(ids: string[], context?: Context | undefined): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
