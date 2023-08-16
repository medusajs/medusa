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

import { ReservationItem } from "../models"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  DALUtils,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"

// eslint-disable-next-line max-len
export class ReservationItemRepository extends DALUtils.MikroOrmAbstractBaseRepository<ReservationItem> {
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
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const where = { deleted_at: null, ...options?.where }
    const findOptions_ = { ...options, where }

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
    context: Context = {}
  ): Promise<ReservationItem[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map((item) => {
      return manager.create(ReservationItem, item)
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

    await manager.nativeDelete(ReservationItem, { id: { $in: ids } }, {})
  }

  @InjectTransactionManager()
  async update(
    data: {
      item: ReservationItem
      update: UpdateReservationItemInput
    }[],
    @MedusaContext()
    context: Context = {}
  ): Promise<ReservationItem[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const items = data.map(({ item, update }) => {
      return manager.assign(item, update)
    })

    await manager.persistAndFlush(items)

    return items
  }
}
