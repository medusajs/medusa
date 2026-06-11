/**
 * Wraps a database operation in a transaction with optional isolation level.
 * 
 * This utility provides transaction management for database operations,
 * supporting nested transactions, isolation levels, and automatic rollback
 * on errors. It can reuse existing transactions when nested transactions
 * are disabled for performance optimization.
 * 
 * @param manager - The database manager or entity manager that supports transactions
 * @param task - The async function to execute within the transaction context
 * @param options - Transaction configuration options
 * @param options.isolationLevel - Database isolation level for the transaction (e.g., 'READ_COMMITTED', 'SERIALIZABLE')
 * @param options.transaction - Existing transaction to reuse if nested transactions are disabled
 * @param options.enableNestedTransactions - Whether to allow nested transactions (default: false)
 * @returns Promise resolving to the result of the task function
 * 
 * @example
 * ```typescript
 * const result = await transactionWrapper(
 *   entityManager,
 *   async (transactionManager) => {
 *     await service1.create(data1, { manager: transactionManager })
 *     await service2.update(id, data2, { manager: transactionManager })
 *     return "success"
 *   },
 *   { 
 *     isolationLevel: 'READ_COMMITTED',
 *     enableNestedTransactions: true
 *   }
 * )
 * ```
 * 
 * @throws {Error} When the task function throws an error (triggers automatic rollback)
 */
export async function transactionWrapper<TManager = unknown>(
  manager: any,
  task: (transactionManager: any) => Promise<any>,
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

  const transactionMethod = manager.transaction ?? manager.transactional
  return await transactionMethod.bind(manager)(task, options)
}

export function normalizeMigrationSQL(sql: string) {
  sql = sql.replace(
    /create table (?!if not exists)/g,
    "create table if not exists "
  )
  sql = sql.replace(/alter table (?!if exists)/g, "alter table if exists ")
  sql = sql.replace(
    /create index (?!if not exists)/g,
    "create index if not exists "
  )
  sql = sql.replace(/alter index (?!if exists)/g, "alter index if exists ")
  sql = sql.replace(/drop index (?!if exists)/g, "drop index if exists ")
  sql = sql.replace(
    /create unique index (?!if not exists)/g,
    "create unique index if not exists "
  )
  sql = sql.replace(
    /drop unique index (?!if exists)/g,
    "drop unique index if exists "
  )
  sql = sql.replace(
    /add column (?!if not exists)/g,
    "add column if not exists "
  )
  sql = sql.replace(/drop column (?!if exists)/g, "drop column if exists ")
  sql = sql.replace(
    /drop constraint (?!if exists)/g,
    "drop constraint if exists "
  )

  return sql
}
