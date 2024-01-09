import {
  Context,
  DAL,
  FilterQuery,
  RepositoryTransformOptions,
} from "@medusajs/types"
import { arrayDifference, isString, MedusaError } from "../../common"
import { MedusaContext } from "../../decorators"
import { buildQuery, InjectTransactionManager } from "../../modules-sdk"
import {
  getSoftDeletedCascadedEntitiesIdsMappedBy,
  transactionWrapper,
} from "../utils"
import { mikroOrmSerializer, mikroOrmUpdateDeletedAtRecursively } from "./utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { LoadStrategy, RequiredEntityData } from "@mikro-orm/core"
import {
  EntityClass,
  EntityName,
  FilterQuery as MikroFilterQuery,
} from "@mikro-orm/core/typings"
import { FindOptions as MikroOptions } from "@mikro-orm/core/drivers/IDatabaseDriver"

export class MikroOrmBase<T = any> {
  protected readonly manager_: any

  protected constructor({ manager }) {
    this.manager_ = manager
  }

  getFreshManager<TManager = unknown>(): TManager {
    return (this.manager_.fork
      ? this.manager_.fork()
      : this.manager_) as unknown as TManager
  }

  getActiveManager<TManager = unknown>(
    @MedusaContext()
    { transactionManager, manager }: Context = {}
  ): TManager {
    return (transactionManager ?? manager ?? this.manager_) as TManager
  }

  async transaction<TManager = unknown>(
    task: (transactionManager: TManager) => Promise<any>,
    options: {
      isolationLevel?: string
      enableNestedTransactions?: boolean
      transaction?: TManager
    } = {}
  ): Promise<any> {
    // @ts-ignore
    return await transactionWrapper.bind(this)(task, options)
  }

  async serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput> {
    return await mikroOrmSerializer<TOutput>(data, options)
  }
}

export abstract class MikroOrmAbstractBaseRepository<T extends object = object>
  extends MikroOrmBase
  implements DAL.RepositoryService<T>
{
  abstract find(options?: DAL.FindOptions<T>, context?: Context): Promise<T[]>

  abstract findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  abstract create(data: unknown[], context?: Context): Promise<T[]>

  update(data: unknown[], context?: Context): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  abstract delete(ids: string[], context?: Context): Promise<void>

  @InjectTransactionManager()
  async softDelete(
    idsOrFilter: string[] | FilterQuery,
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<[T[], Record<string, unknown[]>]> {
    const isArray = Array.isArray(idsOrFilter)
    const filter =
      isArray || isString(idsOrFilter)
        ? {
            id: {
              $in: isArray ? idsOrFilter : [idsOrFilter],
            },
          }
        : idsOrFilter

    const entities = await this.find({ where: filter as any })
    const date = new Date()

    await mikroOrmUpdateDeletedAtRecursively<T>(
      manager,
      entities as any[],
      date
    )

    const softDeletedEntitiesMap = getSoftDeletedCascadedEntitiesIdsMappedBy({
      entities,
    })

    return [entities, softDeletedEntitiesMap]
  }

  @InjectTransactionManager()
  async restore(
    idsOrFilter: string[] | FilterQuery,
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<[T[], Record<string, unknown[]>]> {
    const isArray = Array.isArray(idsOrFilter)
    const filter =
      isArray || isString(idsOrFilter)
        ? {
            id: {
              $in: isArray ? idsOrFilter : [idsOrFilter],
            },
          }
        : idsOrFilter

    const query = buildQuery(filter, {
      withDeleted: true,
    })

    const entities = await this.find(query)

    await mikroOrmUpdateDeletedAtRecursively(manager, entities as any[], null)

    const softDeletedEntitiesMap = getSoftDeletedCascadedEntitiesIdsMappedBy({
      entities,
      restored: true,
    })

    return [entities, softDeletedEntitiesMap]
  }

  applyFreeTextSearchFilters<T>(
    findOptions: DAL.FindOptions<T & { q?: string }>,
    retrieveConstraintsToApply: (q: string) => any[]
  ): void {
    if (!("q" in findOptions.where) || !findOptions.where.q) {
      delete findOptions.where.q

      return
    }

    const q = findOptions.where.q as string
    delete findOptions.where.q

    findOptions.where = {
      $and: [findOptions.where, { $or: retrieveConstraintsToApply(q) }],
    } as unknown as DAL.FilterQuery<T & { q?: string }>
  }
}

export abstract class MikroOrmAbstractTreeRepositoryBase<T = any>
  extends MikroOrmBase<T>
  implements DAL.TreeRepositoryService<T>
{
  protected constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }

  abstract find(
    options?: DAL.FindOptions<T>,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  )

  abstract findAndCount(
    options?: DAL.FindOptions<T>,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<[T[], number]>

  abstract create(data: unknown, context?: Context): Promise<T>

  abstract delete(id: string, context?: Context): Promise<void>
}

/**
 * Privileged extends of the abstract classes unless most of the methods can't be implemented
 * in your repository. This base repository is also used to provide a base repository
 * injection if needed to be able to use the common methods without being related to an entity.
 * In this case, none of the method will be implemented except the manager and transaction
 * related ones.
 */

export class MikroOrmBaseRepository<
  T extends object = object
> extends MikroOrmAbstractBaseRepository<T> {
  constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }

  create(data: unknown[], context?: Context): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  update(data: unknown[], context?: Context): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  delete(ids: string[], context?: Context): Promise<void> {
    throw new Error("Method not implemented.")
  }

  find(options?: DAL.FindOptions<T>, context?: Context): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]> {
    throw new Error("Method not implemented.")
  }
}

export class MikroOrmBaseTreeRepository extends MikroOrmAbstractTreeRepositoryBase {
  constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }

  find(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<[any[], number]> {
    throw new Error("Method not implemented.")
  }

  create(data: unknown, context?: Context): Promise<any> {
    throw new Error("Method not implemented.")
  }

  delete(id: string, context?: Context): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export function mikroOrmBaseRepositoryFactory<T extends object>(
  entity: EntityClass<T>
): { new (...args: any[]): MikroOrmBaseRepository<T> } {
  class MikroOrmAbstractBaseRepository_ extends MikroOrmBaseRepository<T> {
    constructor({ manager }: { manager: SqlEntityManager }) {
      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      super(...arguments)
    }

    async create(data: unknown[], context?: Context): Promise<T[]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const entities = data.map((data_) => {
        return manager.create(
          entity as EntityName<T>,
          data_ as RequiredEntityData<T>
        )
      })

      manager.persist(entities)

      return entities
    }

    async update(data: any[], context?: Context): Promise<T[]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const ids = data.map((data_) => data_.id)
      const existingEntities = await this.find(
        {
          where: {
            id: {
              $in: ids,
            },
          } as any,
        },
        context
      )

      const missingEntities = arrayDifference(
        data.map((d) => d.id),
        existingEntities.map((plr: any) => plr.id)
      )

      if (missingEntities.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${entity.name} with id(s) "${missingEntities.join(", ")}" not found`
        )
      }

      const existingEntitiesMap = new Map(
        existingEntities.map<[string, T]>((entity_: any) => [
          entity_.id,
          entity_,
        ])
      )

      const entities = data.map((data_) => {
        const existingEntity = existingEntitiesMap.get(data_.id)!
        return manager.assign(existingEntity, data_ as RequiredEntityData<T>)
      })

      manager.persist(entities)

      return entities
    }

    async delete(ids: string[], context?: Context): Promise<void> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      await manager.nativeDelete(
        entity as EntityName<T>,
        { id: { $in: ids } } as any,
        {}
      )
    }

    async find(options?: DAL.FindOptions<T>, context?: Context): Promise<T[]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const findOptions_ = { ...options }
      findOptions_.options ??= {}

      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })

      return await manager.find(
        entity as EntityName<T>,
        findOptions_.where as MikroFilterQuery<T>,
        findOptions_.options as MikroOptions<T>
      )
    }

    async findAndCount(
      findOptions: DAL.FindOptions<T> = { where: {} },
      context: Context = {}
    ): Promise<[T[], number]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const findOptions_ = { ...findOptions }
      findOptions_.options ??= {}

      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })

      return await manager.findAndCount(
        entity as EntityName<T>,
        findOptions_.where as MikroFilterQuery<T>,
        findOptions_.options as MikroOptions<T>
      )
    }
  }

  return MikroOrmAbstractBaseRepository_
}
