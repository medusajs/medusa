import {
  Constructor,
  Context,
  DAL,
  RepositoryTransformOptions,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  buildQuery,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import {
  EntityName,
  FilterQuery,
  LoadStrategy,
  serialize,
} from "@mikro-orm/core"

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
  console.log("forked this.manager_", this.manager_)

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
    if (!("deleted_at" in entity)) {
      continue
    }
    (entity as any).deleted_at = value

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

const serializer = async <
  T extends object | object[],
  TResult extends object | object[]
>(
  data: T,
  options?: any
): Promise<TResult> => {
  options ??= {}
  const result = serialize(data, options)
  return Array.isArray(data) ? result : result[0]
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
    console.log("this.manager_", this.manager_)

    // eslint-disable-next-line prefer-rest-params
    return await transactionWrapper.apply(this, arguments)
  }

  async serialize<
    TData extends object | object[] = object[],
    TResult extends object | object[] = object[]
  >(data: TData, options?: any): Promise<TResult> {
    return serializer<TData, TResult>(data, options)
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
    // eslint-disable-next-line prefer-rest-params
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
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
  }

  async serialize<
    TData extends object | object[] = object[],
    TResult extends object | object[] = object[]
  >(data: TData, options?: any): Promise<TResult> {
    return serializer<TData, TResult>(data, options)
  }

  async create(data: unknown[], context?: Context): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  async delete(ids: string[], context?: Context): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async find(options?: DAL.FindOptions, context?: Context): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  async findAndCount(
    options?: DAL.FindOptions,
    context?: Context
  ): Promise<[any[], number]> {
    throw new Error("Method not implemented.")
  }
}
