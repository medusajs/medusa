import { Context, FindOptions } from "@medusajs/types"
import {
  EntitySchema,
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"

import { MikroOrmAbstractBaseRepository } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export function getPivotRepository(model: EntitySchema) {
  return class PivotRepository extends MikroOrmAbstractBaseRepository<object> {
    readonly manager_: SqlEntityManager
    readonly model_: EntitySchema

    constructor({ manager }: { manager: SqlEntityManager }) {
      // @ts-ignore
      super(...arguments)
      this.manager_ = manager
      this.model_ = model
    }

    async find(
      findOptions: FindOptions<unknown> = { where: {} },
      context: Context = {}
    ): Promise<unknown[]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const findOptions_ = { ...findOptions }
      findOptions_.options ??= {}

      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })

      return await manager.find(
        this.model_,
        findOptions_.where as MikroFilterQuery<unknown>,
        findOptions_.options as MikroOptions<any>
      )
    }

    async findAndCount(
      findOptions: FindOptions<object> = { where: {} },
      context: Context = {}
    ): Promise<[object[], number]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const findOptions_ = { ...findOptions }
      findOptions_.options ??= {}

      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })

      return await manager.findAndCount(
        this.model_,
        findOptions_.where as MikroFilterQuery<unknown>,
        findOptions_.options as MikroOptions<any>
      )
    }

    async delete(data: any, context: Context = {}): Promise<void> {
      const filter = {}
      for (const key in data) {
        filter[key] = {
          $in: Array.isArray(data[key]) ? data[key] : [data[key]],
        }
      }

      const manager = this.getActiveManager<SqlEntityManager>(context)
      await manager.nativeDelete(this.model_, data, {})
    }

    async create(data: object[], context: Context = {}): Promise<object[]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const links = data.map((link: any) => {
        return manager.create(this.model_, link)
      })

      await manager.upsertMany(this.model_, links)

      return links
    }
  }
}
