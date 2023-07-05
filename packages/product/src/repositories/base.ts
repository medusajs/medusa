import { Context, DAL, RepositoryTransformOptions } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

// TODO: Should we create a mikro orm specific package for this and the soft deletable decorator util?

async function transactionWrapper(
  this: any,
  task: (transactionManager: unknown) => Promise<any>,
  {
    transaction,
    isolationLevel,
    enableNestedTransactions = false,
  }: {
    isolationLevel?: string
    transaction?: unknown
    enableNestedTransactions?: boolean
  } = {}
): Promise<any> {
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

const updateDeletedAtRecursively = async <T extends object = any>(
  manager: SqlEntityManager,
  entities: T[],
  value: Date | null
) => {
  for await (const entity of entities) {
    if (!("deleted_at" in entity)) continue
    ;(entity as any).deleted_at = value

    const relations = manager
      .getDriver()
      .getMetadata()
      .get(entities[0].constructor.name).relations
    const relationsToCascade = relations.filter((relation) =>
      relation.cascade.includes("soft-remove" as any)
    )

    for (const relation of relationsToCascade) {
      const relationEntities = (await entity[relation.name].init()).getItems()
      await updateDeletedAtRecursively(manager, relationEntities, value)
    }

    await manager.persist(entities)
  }
}

export abstract class AbstractBaseRepository<T = any>
  implements DAL.RepositoryService<T>
{
  protected readonly manager_: SqlEntityManager

  protected constructor({ manager }) {
    this.manager_ = manager
  }

  async transaction(
    task: (transactionManager: unknown) => Promise<any>,
    {
      transaction,
      isolationLevel,
      enableNestedTransactions = false,
    }: {
      isolationLevel?: string
      transaction?: unknown
      enableNestedTransactions?: boolean
    } = {}
  ): Promise<any> {
    return await transactionWrapper.apply(this, arguments)
  }

  abstract find(options?: DAL.FindOptions<T>, context?: Context)

  abstract findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  abstract delete(ids: string[], context?: Context): Promise<void>

  async softDelete(ids: string[], context?: Context): Promise<T[]> {
    const manager = (context?.transactionManager ??
      this.manager_) as SqlEntityManager
    const entities = await this.find({ where: { id: { $in: ids } } as any })

    const date = new Date()
    await updateDeletedAtRecursively(manager, entities, date)

    return entities
  }

  async restore(ids: string[], context?: Context): Promise<T[]> {
    const manager = (context?.transactionManager ??
      this.manager_) as SqlEntityManager
    const entities = await this.find({ where: { id: { $in: ids } } as any })

    await updateDeletedAtRecursively(manager, entities, null)

    return entities
  }
}

export abstract class AbstractTreeRepositoryBase<T = any>
  extends AbstractBaseRepository<T>
  implements DAL.TreeRepositoryService<T>
{
  protected readonly manager_: SqlEntityManager

  protected constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
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

/**
 * Only used internally in order to be able to wrap in transaction from a
 * non identified repository
 */
export class BaseRepository extends AbstractBaseRepository {
  constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }

  delete(ids: string[], context?: Context): Promise<void> {
    return Promise.resolve(undefined)
  }

  find(options?: DAL.FindOptions, context?: Context): Promise<any[]> {
    return Promise.resolve([])
  }

  findAndCount(
    options?: DAL.FindOptions,
    context?: Context
  ): Promise<[any[], number]> {
    return Promise.resolve([[], 0])
  }
}
