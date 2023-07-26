import { Context, DAL, RepositoryTransformOptions } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  buildQuery,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import { serialize } from "@mikro-orm/core"

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

  const options = {}

  if (transaction) {
    Object.assign(options, { ctx: transaction })
  }

  if (isolationLevel) {
    Object.assign(options, { isolationLevel })
  }

  return await (this.manager_ as SqlEntityManager).transactional(task, options)
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
      const relationEntities = (await entity[relation.name].init()).getItems({
        filters: {
          [DAL.SoftDeletableFilterKey]: {
            withDeleted: true,
          },
        },
      })

      await updateDeletedAtRecursively(manager, relationEntities, value)
    }

    await manager.persist(entities)
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
      enableNestedTransactions?: boolean
      transaction?: unknown
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
    await updateDeletedAtRecursively(
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

    await updateDeletedAtRecursively(
      manager as SqlEntityManager,
      entities,
      null
    )

    return entities
  }
}

export abstract class AbstractTreeRepositoryBase<T = any>
  extends AbstractBaseRepository<T>
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
