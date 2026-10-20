import { Client, Pool } from "pg"
import { applySchema } from "./schema"

const connection = (database: string) => ({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "",
  database,
})

async function admin<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client(connection("postgres"))
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

/**
 * A fresh database with the engine's schema, dropped by `drop`.
 */
export async function createTestDatabase() {
  const name = `wf_engine_${
    process.env.JEST_WORKER_ID ?? 1
  }_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
  await admin((client) => client.query(`CREATE DATABASE "${name}"`))

  const pool = new Pool({ ...connection(name), max: 10 })
  await applySchema(pool)

  return {
    name,
    pool,
    url: `postgres://${connection(name).user}@${connection(name).host}:${
      connection(name).port
    }/${name}`,
    async drop() {
      await pool.end()
      await admin((client) =>
        client.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`)
      )
    },
  }
}
