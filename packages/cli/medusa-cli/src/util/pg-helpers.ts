import { Client, ClientConfig } from "@medusajs/deps/pg"

type Credentials = {
  user: string
  password?: string
  host: string
  port: number
}

export async function createDatabase(
  opts: { databaseName: string; errorIfExist?: boolean },
  creds: Credentials
): Promise<void> {
  const client = new Client({
    ...creds,
    database: "postgres",
  } as ClientConfig)
  try {
    await client.connect()
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)`,
      [opts.databaseName]
    )
    if (res.rowCount! > 0) {
      if (opts.errorIfExist) {
        const err: any = new Error("Database already exists")
        err.name = "PDG_ERR::DuplicateDatabase"
        err.code = "42P04"
        throw err
      }
      return
    }
    await client.query(`CREATE DATABASE "${opts.databaseName}"`)
  } finally {
    await client.end()
  }
}

export async function dropDatabase(
  opts: {
    databaseName: string
    errorIfNonExist?: boolean
    dropConnections?: boolean
  },
  creds: Credentials
): Promise<void> {
  const client = new Client({
    ...creds,
    database: "postgres",
  } as ClientConfig)
  try {
    await client.connect()
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)`,
      [opts.databaseName]
    )
    if (res.rowCount === 0) {
      if (opts.errorIfNonExist) {
        const err: any = new Error("Database does not exist")
        err.name = "PDG_ERR::InvalidCatalogName"
        err.code = "3D000"
        throw err
      }
      return
    }
    if (opts.dropConnections !== false) {
      await client.query(
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
        [opts.databaseName]
      )
    }
    await client.query(`DROP DATABASE "${opts.databaseName}"`)
  } finally {
    await client.end()
  }
}
