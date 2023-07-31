import { Context, DAL, RepositoryTransformOptions } from "@medusajs/types"
import { MedusaContext } from "../../decorators"
import { buildQuery, InjectTransactionManager } from "../../modules-sdk"
import {
  mikroOrmSerializer,
  mikroOrmUpdateDeletedAtRecursively,
  transactionWrapper,
} from "../utils"

class MikroOrmBase<T = any> {
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

export abstract class MikroOrmAbstractBaseRepository<T = any>
  extends MikroOrmBase
  implements DAL.RepositoryService<T>
{
  abstract find(options?: DAL.FindOptions<T>, context?: Context)

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
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<T[]> {
    const entities = await this.find({ where: { id: { $in: ids } } as any })
    const date = new Date()

    await mikroOrmUpdateDeletedAtRecursively(manager, entities, date)

    return entities
  }

  @InjectTransactionManager()
  async restore(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<T[]> {
    const query = buildQuery(
      { id: { $in: ids } },
      {
        withDeleted: true,
      }
    )

    const entities = await this.find(query)

    await mikroOrmUpdateDeletedAtRecursively(manager, entities, null)

    return entities
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
 * Priviliged extends of the abstract classes unless most of the methods can't be implemented
 * in your repository. This base repository is also used to provide a base repository
 * injection if needed to be able to use the common methods without being related to an entity.
 * In this case, none of the method will be implemented except the manager and transaction
 * related ones.
 */

export class MikroOrmBaseRepository extends MikroOrmAbstractBaseRepository {
  constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }

  create(data: unknown[], context?: Context): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  update(data: unknown[], context?: Context): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  delete(ids: string[], context?: Context): Promise<void> {
    throw new Error("Method not implemented.")
  }

  find(options?: DAL.FindOptions, context?: Context): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions,
    context?: Context
  ): Promise<[any[], number]> {
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
