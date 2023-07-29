import { Context, DAL, RepositoryTransformOptions } from "@medusajs/types"
import { SoftDeletableFilterKey } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  buildQuery,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import { serialize } from "@mikro-orm/core"

// TODO: move to utils package

async function transactionWrapper<TManager = unknown>(
  this: any,
  task: (transactionManager: unknown) => Promise<any>,
  {
    transaction,
    isolationLevel,
    enableNestedTransactions = false,
  }: {
    isolationLevel?: string
    transaction?: TManager
    enableNestedTransactions?: boolean
  } = {}
): Promise<any> {
  // Reuse the same transaction if it is already provided and nested transactions are disabled
  if (!enableNestedTransactions && transaction) {
    return await task(transaction)
  }

  const options = {}

  if (transaction) {
    Object.assign(options, { ctx: transaction })
  }

  if (isolationLevel) {
    Object.assign(options, { isolationLevel })
  }

  return await (this.manager_ as SqlEntityManager).transactional(task, options)
}

// TODO: move to utils package
const mikroOrmUpdateDeletedAtRecursively = async <T extends object = any>(
  manager: any,
  entities: T[],
  value: Date | null
) => {
  for (const entity of entities) {
    if (!("deleted_at" in entity)) continue

    ;(entity as any).deleted_at = value

    const relations = manager
      .getDriver()
      .getMetadata()
      .get(entity.constructor.name).relations

    const relationsToCascade = relations.filter((relation) =>
      relation.cascade.includes("soft-remove" as any)
    )

    for (const relation of relationsToCascade) {
      let collectionRelation = entity[relation.name]

      if (!collectionRelation.isInitialized()) {
        await collectionRelation.init()
      }

      const relationEntities = await collectionRelation.getItems({
        filters: {
          [SoftDeletableFilterKey]: {
            withDeleted: true,
          },
        },
      })

      await mikroOrmUpdateDeletedAtRecursively(manager, relationEntities, value)
    }

    await manager.persist(entity)
  }
}

const serializer = <TOutput extends object>(
  data: any,
  options?: any
): Promise<TOutput> => {
  options ??= {}
  const result = serialize(data, options)
  return result as unknown as Promise<TOutput>
}

// TODO: move to utils package
class AbstractBase<T = any> {
  protected readonly manager_: SqlEntityManager

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
    return await transactionWrapper.apply(this, arguments)
  }

  async serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput> {
    return await serializer<TOutput>(data, options)
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

  abstract delete(ids: string[], context?: Context): Promise<void>

  @InjectTransactionManager()
  async softDelete(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<T[]> {
    const entities = await this.find({ where: { id: { $in: ids } } as any })
    const date = new Date()

    await mikroOrmUpdateDeletedAtRecursively(
      manager as SqlEntityManager,
      entities,
      date
    )

    return entities
  }

  @InjectTransactionManager()
  async restore(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context<SqlEntityManager> = {}
  ): Promise<T[]> {
    const query = buildQuery(
      { id: { $in: ids } },
      {
        withDeleted: true,
      }
    )

    const entities = await this.find(query)

    await mikroOrmUpdateDeletedAtRecursively(
      manager as SqlEntityManager,
      entities,
      null
    )

    return entities
  }
}

// TODO: move to utils package
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
}

// TODO: move to utils package
/**
 * Only used internally in order to be able to wrap in transaction from a
 * non identified repository
 */

export class BaseRepository extends AbstractBaseRepository {
  constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }

  create(data: unknown[], context?: Context): Promise<any[]> {
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


export class BaseTreeRepository extends AbstractTreeRepositoryBase {
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
