import { Context, DAL, RepositoryTransformOptions } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

async function transactionWrapper<T>(
  this: any,
  task: (transactionManager: unknown) => Promise<T[]>,
  {
    transaction,
    isolationLevel,
    enableNestedTransactions = false,
  }: {
    isolationLevel?: string
    transaction?: unknown
    enableNestedTransactions?: boolean
  }
): Promise<T[]> {
  // Reuse the same transaction if it is already provided and nested transactions are disabled
  if (!enableNestedTransactions && transaction) {
    return await task(transaction)
  }

  const forkedManager = this.manager_.fork()

  const options = {}
  if (isolationLevel) {
    Object.assign(options, { isolationLevel })
  }

  if (transaction) {
    Object.assign(options, { ctx: transaction })
    await forkedManager.begin(options)
  } else {
    await forkedManager.begin(options)
  }

  try {
    const result = await task(forkedManager)
    await forkedManager.commit()
    return result
  } catch (e) {
    await forkedManager.rollback()
    throw e
  }
}

export abstract class AbstractRepositoryBase<T = any>
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
      enableNestedTransactions = false,
    }: {
      isolationLevel?: string
      transaction?: unknown
      enableNestedTransactions?: boolean
    }
  ): Promise<T[]> {
    // @ts-ignore
    return await transactionWrapper.apply<T>(this, arguments)
  }

  abstract find(options?: DAL.FindOptions<T>, context?: Context)

  abstract findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  abstract upsert(data: any, context?: Context): Promise<T[]>
}

export abstract class AbstractTreeRepositoryBase<T = any>
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
      enableNestedTransactions = false,
    }: {
      isolationLevel?: string
      transaction?: unknown
      enableNestedTransactions?: boolean
    }
  ): Promise<T[]> {
    // @ts-ignore
    return await transactionWrapper.apply<T>(this, arguments)
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

export class BaseRepository<T> extends AbstractRepositoryBase<T> {
  constructor() {
    // @ts-ignore
    super(...arguments)
  }

  find(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions
  ): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions
  ): Promise<[T[], number]> {
    throw new Error("Method not implemented.")
  }

  upsert(data: any, context?: Context): Promise<any[]> {
    throw new Error("Method not implemented.")
  }
}
