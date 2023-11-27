import { Context, DAL, RepositoryTransformOptions } from "@medusajs/types"
import { MedusaContext } from "../decorators"

class AbstractBase<T = any> {
  protected readonly manager_: any

  protected constructor({ manager }) {
    this.manager_ = manager
  }

  getActiveManager<TManager = unknown>(
    @MedusaContext()
    { transactionManager, manager }: Context = {}
  ): TManager {
    return (transactionManager ?? manager ?? this.manager_) as TManager
  }

  async transaction<TManager = unknown>(
    task: (transactionManager: TManager) => Promise<any>,
    {
      transaction,
      isolationLevel,
      enableNestedTransactions = false,
    }: {
      isolationLevel?: string
      enableNestedTransactions?: boolean
      transaction?: TManager
    } = {}
  ): Promise<any> {
    // @ts-ignore
    return await transactionWrapper.apply(this, arguments)
  }
}

export abstract class AbstractBaseRepository<T = any>
  extends AbstractBase
  implements DAL.RepositoryService<T>
{
  abstract find(options?: DAL.FindOptions<T>, context?: Context)

  abstract findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  abstract create(data: unknown[], context?: Context): Promise<T[]>

  abstract update(data: unknown[], context?: Context): Promise<T[]>

  abstract delete(ids: string[], context?: Context): Promise<void>

  abstract softDelete(
    ids: string[],
    context?: Context
  ): Promise<[T[], Record<string, unknown[]>]>

  abstract restore(
    ids: string[],
    context?: Context
  ): Promise<[T[], Record<string, unknown[]>]>

  abstract getFreshManager<TManager = unknown>(): TManager

  abstract serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput>
}

export abstract class AbstractTreeRepositoryBase<T = any>
  extends AbstractBase<T>
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

  abstract getFreshManager<TManager = unknown>(): TManager

  abstract serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput>
}
