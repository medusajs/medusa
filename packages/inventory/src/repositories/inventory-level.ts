import { Context, FindOptions } from "@medusajs/types"
import { InventoryLevel, ReservationItem } from "../models"

import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"

// eslint-disable-next-line max-len
export class InventoryLevelRepository extends AbstractBaseRepository<InventoryLevel> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  find(
    options?: FindOptions<InventoryLevel> | undefined,
    context?: Context | undefined
  ) {
    throw new Error("Method not implemented.")
  }
  async findAndCount(
    options?: FindOptions<InventoryLevel> | undefined,
    context?: Context | undefined
  ): Promise<[InventoryLevel[], number]> {
    throw new Error("Method not implemented.")
  }
  async create(
    data: unknown[],
    context?: Context | undefined
  ): Promise<InventoryLevel[]> {
    throw new Error("Method not implemented.")
  }
  async delete(ids: string[], context?: Context | undefined): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
