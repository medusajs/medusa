import { Context, DAL } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { LoadStrategy } from "@mikro-orm/core"
import { EntityManager } from "@mikro-orm/postgresql"
import { Order } from "@models"
import { mapRepositoryToOrderModel } from "../utils/transform-order"

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

    const config = mapRepositoryToOrderModel(findOptions_)

    let defaultVersion = knex.raw(`"o0"."version"`)
    const strategy = config.options.strategy ?? LoadStrategy.JOINED
    if (strategy === LoadStrategy.SELECT_IN) {
      const sql = manager
        .qb(Order, "_sub0")
        .select("version")
        .where({ id: knex.raw(`"o0"."order_id"`) })
        .getKnexQuery()
        .toString()

      defaultVersion = knex.raw(`(${sql})`)
    }

    const version = config.where.version ?? defaultVersion
    delete config.where?.version

    config.options.populateWhere ??= {}

    config.options.populateWhere.items ??= {}
    config.options.populateWhere.items.version = version

    config.options.populateWhere.summary ??= {}
    config.options.populateWhere.summary.version = version

    config.options.populateWhere.shipping_methods ??= {}
    config.options.populateWhere.shipping_methods.version = version

    if (!config.options.orderBy) {
      config.options.orderBy = { id: "ASC" }
    }

    return await manager.find(Order, config.where, config.options)
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

    const config = mapRepositoryToOrderModel(findOptions_)

    let defaultVersion = knex.raw(`"o0"."version"`)
    const strategy = config.options.strategy ?? LoadStrategy.JOINED
    if (strategy === LoadStrategy.SELECT_IN) {
      const sql = manager
        .qb(Order, "_sub0")
        .select("version")
        .where({ id: knex.raw(`"o0"."order_id"`) })
        .getKnexQuery()
        .toString()

      defaultVersion = knex.raw(`(${sql})`)
    }

    const version = config.where.version ?? defaultVersion
    delete config.where.version

    config.options.populateWhere ??= {}
    config.options.populateWhere.items ??= {}
    config.options.populateWhere.items.version = version

    config.options.populateWhere.summary ??= {}
    config.options.populateWhere.summary.version = version

    config.options.populateWhere.shipping_methods ??= {}
    config.options.populateWhere.shipping_methods.version = version

    if (!config.options.orderBy) {
      config.options.orderBy = { id: "ASC" }
    }

    return await manager.findAndCount(Order, config.where, config.options)
  }
}
