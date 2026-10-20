export interface QueryResult<Row = Record<string, any>> {
  rows: Row[]
  rowCount: number
}

/**
 * The only thing the Postgres store needs from a database driver.
 */
export interface SqlClient {
  query<Row = Record<string, any>>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<Row>>
}

type PgLike = {
  query(
    sql: string,
    params?: unknown[]
  ): Promise<{ rows: any[]; rowCount: number | null }>
}

type KnexLike = {
  raw(sql: string, bindings?: unknown[]): Promise<any>
}

/**
 * Wraps a `pg` Pool or Client.
 */
export function fromPg(pool: PgLike): SqlClient {
  return {
    async query(sql, params = []) {
      const result = await pool.query(sql, params)
      return { rows: result.rows, rowCount: result.rowCount ?? 0 }
    },
  }
}

/**
 * Wraps a knex instance. Placeholders are written `$1`, `$2`, ... and turned
 * into knex's `?` bindings.
 */
export function fromKnex(knex: KnexLike): SqlClient {
  return {
    async query(sql, params = []) {
      const bindings: unknown[] = []
      const text = sql.replace(/\$(\d+)/g, (_match, index) => {
        bindings.push(params[Number(index) - 1])
        return "?"
      })
      const result = await knex.raw(text, bindings)
      return { rows: result.rows ?? [], rowCount: result.rowCount ?? 0 }
    },
  }
}
