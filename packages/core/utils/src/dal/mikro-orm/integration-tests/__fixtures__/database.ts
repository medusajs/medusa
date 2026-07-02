import { MikroORM } from "@medusajs/deps/mikro-orm/core"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""

export const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

export function getDatabaseURL(dbName): string {
  return `postgres://${DB_USERNAME}${
    DB_PASSWORD ? `:${DB_PASSWORD}` : ""
  }@${DB_HOST}/${dbName}`
}

export type CapturedQuery = {
  sql: string
  params: unknown[]
}

export type SqlCapture = {
  queries: CapturedQuery[]
  onQuery: (sql: string, params: unknown[]) => string
  clear: () => void
}

export function createSqlCapture(): SqlCapture {
  const queries: CapturedQuery[] = []

  return {
    queries,
    onQuery: (sql, params) => {
      queries.push({ sql, params: [...params] })
      return sql
    },
    clear: () => {
      queries.length = 0
    },
  }
}

export function normalizeSql(sql: string): string {
  return sql
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim()
}

export function formatCapturedQuery(
  orm: MikroORM,
  query: CapturedQuery
): string {
  return orm.em.getDriver().getPlatform().formatQuery(query.sql, query.params)
}

export function formatCapturedQueries(
  orm: MikroORM,
  capture: SqlCapture
): string[] {
  return capture.queries.map((query) => formatCapturedQuery(orm, query))
}

export function expectCapturedQueries(
  orm: MikroORM,
  capture: SqlCapture,
  expected: string | string[]
): void {
  const actual = formatCapturedQueries(orm, capture).map(normalizeSql)
  const expectedQueries = (Array.isArray(expected) ? expected : [expected]).map(
    normalizeSql
  )

  expect(actual).toEqual(expectedQueries)
}
