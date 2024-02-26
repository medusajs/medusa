import { Context, DAL } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { LoadStrategy } from "@mikro-orm/core"
import { EntityManager } from "@mikro-orm/postgresql"
import { Order } from "@models"

export class OrderRepository extends DALUtils.mikroOrmBaseRepositoryFactory<Order>(
  Order
) {
  async find(
    options?: DAL.FindOptions<Order>,
    context?: Context
  ): Promise<Order[]> {
    const manager = this.getActiveManager<EntityManager>(context)
    const knex = manager.getKnex()

    const findOptions_ = { ...options } as any
    findOptions_.options ??= {}
    findOptions_.where ??= {}

    if (!("strategy" in findOptions_.options)) {
      if (findOptions_.options.limit != null || findOptions_.options.offset) {
        Object.assign(findOptions_.options, {
          strategy: LoadStrategy.SELECT_IN,
        })
      } else {
        Object.assign(findOptions_.options, {
          strategy: LoadStrategy.JOINED,
        })
      }
    }

    const expandDetails = findOptions_.options.populate?.filter((p) =>
      p.includes("items")
    )?.length

    // If no version is specified, we default to the latest version
    if (expandDetails) {
      let defaultVersion = knex.raw(`"o0"."version"`)
      const strategy = findOptions_.options.strategy ?? LoadStrategy.JOINED
      if (strategy === LoadStrategy.SELECT_IN) {
        const sql = manager
          .qb(Order, "_sub0")
          .select("version")
          .where({ id: knex.raw(`"o0"."order_id"`) })
          .getKnexQuery()
          .toString()

        defaultVersion = knex.raw(`(${sql})`)
      }

      const version = findOptions_.where?.version ?? defaultVersion
      delete findOptions_.where?.version

      findOptions_.options.populateWhere ??= {}
      findOptions_.options.populateWhere.items ??= {}
      findOptions_.options.populateWhere.items.version = version
    }

    return await manager.find(Order, findOptions_.where, findOptions_.options)
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Order> = { where: {} },
    context: Context = {}
  ): Promise<[Order[], number]> {
    const manager = this.getActiveManager<EntityManager>(context)
    const knex = manager.getKnex()

    const findOptions_ = { ...findOptions } as any
    findOptions_.options ??= {}
    findOptions_.where ??= {}

    if (!("strategy" in findOptions_.options)) {
      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })
    }

    const expandDetails = findOptions_.options.populate?.filter((p) =>
      p.includes("items")
    )?.length

    // If no version is specified, we default to the latest version
    if (expandDetails) {
      let defaultVersion = knex.raw(`"o0"."version"`)
      const strategy = findOptions_.options.strategy ?? LoadStrategy.JOINED
      if (strategy === LoadStrategy.SELECT_IN) {
        const sql = manager
          .qb(Order, "_sub0")
          .select("version")
          .where({ id: knex.raw(`"o0"."order_id"`) })
          .getKnexQuery()
          .toString()

        defaultVersion = knex.raw(`(${sql})`)
      }

      const version = findOptions_.where?.version ?? defaultVersion
      delete findOptions_.where?.version

      findOptions_.options.populateWhere ??= {}
      findOptions_.options.populateWhere.items ??= {}
      findOptions_.options.populateWhere.items.version = version
    }

    return await manager.findAndCount(
      Order,
      findOptions_.where,
      findOptions_.options
    )
  }
}
