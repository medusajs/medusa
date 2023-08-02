import { Context, DAL } from "@medusajs/types"
import {
  EntitySchema,
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"

import { SqlEntityManager } from "@mikro-orm/postgresql"
import { AbstractBaseRepository } from "./base"

export function getPivotRepository(model: EntitySchema) {
  return class PivotRepository extends AbstractBaseRepository {
    readonly manager_: SqlEntityManager
    readonly model_: EntitySchema

    constructor({ manager }: { manager: SqlEntityManager }) {
      // @ts-ignore
      super(...arguments)
      this.manager_ = manager
      this.model_ = model
    }

    async find(
      findOptions: DAL.FindOptions<unknown> = { where: {} },
      context: Context = {}
    ): Promise<unknown[]> {
      const manager = (context.transactionManager ??
        this.manager_) as SqlEntityManager

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
      findOptions: DAL.FindOptions<unknown> = { where: {} },
      context: Context = {}
    ): Promise<[unknown[], number]> {
      const findOptions_ = { ...findOptions }
      findOptions_.options ??= {}

      if (context.transactionManager) {
        Object.assign(findOptions_.options, { ctx: context.transactionManager })
      }

      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })

      return await this.manager_.findAndCount(
        this.model_,
        findOptions_.where as MikroFilterQuery<unknown>,
        findOptions_.options as MikroOptions<any>
      )
    }

    async delete(
      data: any,
      { transactionManager: manager }: Context = {}
    ): Promise<void> {
      const filter = {}
      for (const key in data) {
        filter[key] = { $in: data[key] }
      }

      await (manager as SqlEntityManager).nativeDelete(this.model_, data, {})
    }

    async create(
      data: unknown[],
      { transactionManager: manager }: Context = {}
    ): Promise<unknown[]> {
      const links = data.map((link: any) => {
        return (manager as SqlEntityManager).create(this.model_, link)
      })

      await (manager as SqlEntityManager).persist(links)

      return links
    }
  }
}
