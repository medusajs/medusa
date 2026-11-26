import { TestDatabaseUtils } from "@medusajs/test-utils"

type TestDatabase = TestDatabaseUtils.TestDatabase

/**
 * Runs `sql` in a transaction that stays open, starts `call`, waits until
 * `call` is blocked on the rows that transaction holds, then commits it. This
 * makes `call` run as if another request changed those rows while it was
 * running.
 */
export async function runWhileRowsAreHeld<T>(
  MikroOrmWrapper: TestDatabase,
  sql: string,
  bindings: unknown[],
  call: () => Promise<T>
): Promise<PromiseSettledResult<T>> {
  const knex = MikroOrmWrapper.getOrm().em.getConnection().getKnex()
  const transaction = await knex.transaction()

  try {
    await transaction.raw(sql, bindings as any[])

    const result = Promise.allSettled([call()])

    await waitForBlockedQuery(MikroOrmWrapper)
    await transaction.commit()

    return (await result)[0]
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

async function waitForBlockedQuery(MikroOrmWrapper: TestDatabase) {
  for (let attempt = 0; attempt < 250; attempt++) {
    const [{ count }] = await MikroOrmWrapper.forkManager().execute(
      "select count(*)::int as count from pg_stat_activity where wait_event_type = 'Lock' and datname = current_database()"
    )

    if (count > 0) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 20))
  }

  throw new Error("The call never waited for the held rows")
}
