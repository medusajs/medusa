import { Context, DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  buildQuery,
} from "@medusajs/utils"
import { serialize } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"

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

const mikroOrmUpdateDeletedAt = async <T extends object = any>(
  manager: any,
  entities: T[],
  value: Date | null
) => {
  for (const entity of entities) {
    if (!("deleted_at" in entity)) continue
    ;(entity as any).deleted_at = value

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

export abstract class AbstractBaseRepository<T = any> extends AbstractBase {
  abstract find(options?: DAL.FindOptions<T>, context?: Context)

  abstract findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  @InjectTransactionManager()
  async softDelete(
    data: any,
    returnLinkableKeys?: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const filter = {}
    for (const key in data) {
      filter[key] = { $in: data[key] }
    }

    const entities = await this.find({ where: data })
    const date = new Date()

    await mikroOrmUpdateDeletedAt(manager as SqlEntityManager, entities, date)

    return entities
  }

  @InjectTransactionManager()
  async restore(
    data: any,
    returnLinkableKeys?: string[],
    @MedusaContext()
    { transactionManager: manager }: Context<SqlEntityManager> = {}
  ): Promise<Record<string, string[]> | void> {
    const filter = {}
    for (const key in data) {
      filter[key] = { $in: data[key] }
    }

    const query = buildQuery(data, {
      withDeleted: true,
    })

    const entities = await this.find(query)

    await mikroOrmUpdateDeletedAt(manager as SqlEntityManager, entities, null)

    return entities
  }
}

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
