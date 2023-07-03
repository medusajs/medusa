import { Context, DAL, RepositoryTransformOptions } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export abstract class DalRepositoryBase<T = any>
  implements DAL.RepositoryService<T>
{
  protected readonly manager_: SqlEntityManager

  protected constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async transaction(
    task: (transactionManager: unknown) => Promise<T[]>,
    {
      transaction,
      isolationLevel,
    }: { isolationLevel?: string; transaction?: unknown }
  ): Promise<T[]> {
    const forkedManager = this.manager_.fork()
    forkedManager.begin({ ctx: { transaction, isolationLevel } })

    try {
      const result = await task(forkedManager)
      await forkedManager.commit()
      return result
    } catch (e) {
      await forkedManager.rollback()
      throw e
    }
  }

  abstract find(options?: DAL.FindOptions<T>, context?: Context)

  abstract findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>
}

export abstract class DalTreeRepositoryBase<T = any>
  implements DAL.TreeRepositoryService<T>
{
  protected readonly manager_: SqlEntityManager

  protected constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async transaction(
    task: (transactionManager: unknown) => Promise<T[]>,
    {
      transaction,
      isolationLevel,
    }: { isolationLevel?: string; transaction?: unknown }
  ): Promise<T[]> {
    const forkedManager = this.manager_.fork()
    forkedManager.begin({ ctx: { transaction, isolationLevel } })

    try {
      const result = await task(forkedManager)
      await forkedManager.commit()
      return result
    } catch (e) {
      await forkedManager.rollback()
      throw e
    }
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
}

export class BaseRepository extends DalRepositoryBase {
  constructor() {
    // @ts-ignore
    super(...arguments)
  }

  find(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions
  ): Promise<unknown[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions
  ): Promise<[unknown[], number]> {
    throw new Error("Method not implemented.")
  }
}
