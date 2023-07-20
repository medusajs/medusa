import {
  Context,
  CreateReservationItemInput,
  FindOptions,
  UpdateReservationItemInput,
} from "@medusajs/types"
import {
  LoadStrategy,
  FindOptions as MikroOptions,
  FilterQuery as MikroQuery,
} from "@mikro-orm/core"

import { AbstractBaseRepository } from "./base"
import { ReservationItem } from "../models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"

// eslint-disable-next-line max-len
export class ReservationItemRepository extends AbstractBaseRepository<ReservationItem> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    options?: FindOptions<ReservationItem> | undefined,
    context?: Context | undefined
  ): Promise<ReservationItem[]> {
    const [items] = await this.findAndCount(options, context)
    return items
  }

  async findAndCount(
    options?: FindOptions<ReservationItem> | undefined,
    context: Context = {}
  ): Promise<[ReservationItem[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...options }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ReservationItem,
      findOptions_.where as MikroQuery<ReservationItem>,
      findOptions_.options as MikroOptions<ReservationItem>
    )
  }

  @InjectTransactionManager()
  async create(
    data: CreateReservationItemInput[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<ReservationItem[]> {
    const items = data.map((item) => {
      return (manager as SqlEntityManager).create(ReservationItem, item)
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
      ReservationItem,
      { id: { $in: ids } },
      {}
    )
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: ReservationItem
      update: UpdateReservationItemInput
    }[],
    @MedusaContext()
    { transactionManager }: Context = {}
  ): Promise<ReservationItem[]> {
    const manager = (transactionManager ?? this.manager_) as SqlEntityManager

    const items = data.map(({ item, update }) => {
      return manager.assign(item, update)
    })

    return items
  }
}
