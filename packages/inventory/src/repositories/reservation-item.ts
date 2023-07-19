import { Context, FindOptions } from "@medusajs/types"

import { AbstractBaseRepository } from "./base"
import { ReservationItem } from "../models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

// eslint-disable-next-line max-len
export class ReservationItemRepository extends AbstractBaseRepository<ReservationItem> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  find(
    options?: FindOptions<ReservationItem> | undefined,
    context?: Context | undefined
  ) {
    throw new Error("Method not implemented.")
  }
  async findAndCount(
    options?: FindOptions<ReservationItem> | undefined,
    context?: Context | undefined
  ): Promise<[ReservationItem[], number]> {
    throw new Error("Method not implemented.")
  }
  async create(
    data: unknown[],
    context?: Context | undefined
  ): Promise<ReservationItem[]> {
    throw new Error("Method not implemented.")
  }
  async delete(ids: string[], context?: Context | undefined): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
