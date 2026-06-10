import { Client } from "@medusajs/framework/pg"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""
const DB_PORT = process.env.DB_PORT ?? "5432"
const DB_WAITINGROOM_DATABASE =
  process.env.DB_WAITINGROOM_DATABASE ?? "postgres"

type DatabaseTemplateOptions = {
  databaseName: string
  templateName: string
}

function quoteIdentifier(identifier: string) {
  if (!identifier) {
    throw new Error("Database identifier cannot be empty")
  }

  return `"${identifier.replace(/"/g, '""')}"`
}

// We need to connect to a different database while creating and restoring a template.
// The client is created lazily and reused across calls, since restores run before every
// test and reconnecting each time adds 10-30ms per test.
let waitingroomClientPromise: Promise<Client> | null = null

function resetWaitingroomClient() {
  waitingroomClientPromise = null
}

async function getWaitingroomClient(): Promise<Client> {
  if (!waitingroomClientPromise) {
    waitingroomClientPromise = (async () => {
      const client = new Client({
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD || undefined,
        port: parseInt(DB_PORT),
        database: DB_WAITINGROOM_DATABASE,
      })

      try {
        await client.connect()
      } catch (error) {
        resetWaitingroomClient()
        throw error
      }

      // If the connection drops, make sure the next call reconnects.
      client.on("error", resetWaitingroomClient)
      client.on("end", resetWaitingroomClient)

      return client
    })()
  }

  return waitingroomClientPromise
}

export async function closeWaitingroomClient() {
  if (!waitingroomClientPromise) {
    return
  }

  const clientPromise = waitingroomClientPromise
  resetWaitingroomClient()

  const client = await clientPromise.catch(() => null)
  await client?.end().catch(() => void 0)
}

async function withWaitingroomClient<T>(
  action: (client: Client) => Promise<T>
) {
  const client = await getWaitingroomClient()

  return await action(client)
}

async function terminateDatabaseConnections(
  client: Client,
  databaseName: string
) {
  await client.query(
    `SELECT pg_terminate_backend(pid)
     FROM pg_stat_activity
     WHERE datname = $1
     AND pid <> pg_backend_pid();`,
    [databaseName]
  )
}

async function setAllowConnections(
  client: Client,
  databaseName: string,
  allowConnections: boolean
) {
  await client.query(
    `ALTER DATABASE ${quoteIdentifier(
      databaseName
    )} WITH ALLOW_CONNECTIONS ${allowConnections};`
  )
}

async function dropDatabaseIfExists(client: Client, databaseName: string) {
  // Instead of checking for existence first, we just ignore a does not exist error so we don't have to query the DB all the time
  try {
    await terminateDatabaseConnections(client, databaseName)
    await client.query(`DROP DATABASE ${quoteIdentifier(databaseName)};`)
  } catch (error) {
    if (String((error as Error).message).includes("does not exist")) {
      return
    }

    throw error
  }
}

export async function createPostgresDatabaseTemplate({
  databaseName,
  templateName,
}: DatabaseTemplateOptions) {
  if (databaseName === templateName) {
    throw new Error("Template database name must differ from source database")
  }

  await withWaitingroomClient(async (client) => {
    await dropDatabaseIfExists(client, templateName)
    await setAllowConnections(client, databaseName, false)
    await terminateDatabaseConnections(client, databaseName)

    try {
      await client.query(
        `CREATE DATABASE ${quoteIdentifier(
          templateName
        )} WITH TEMPLATE ${quoteIdentifier(databaseName)};`
      )
    } finally {
      await setAllowConnections(client, databaseName, true)
    }
  })
}

export async function restorePostgresDatabaseFromTemplate({
  databaseName,
  templateName,
}: DatabaseTemplateOptions) {
  if (databaseName === templateName) {
    throw new Error("Template database name must differ from target database")
  }

  await withWaitingroomClient(async (client) => {
    await setAllowConnections(client, databaseName, false)
    await dropDatabaseIfExists(client, databaseName)
    await terminateDatabaseConnections(client, templateName)
    await client.query(
      `CREATE DATABASE ${quoteIdentifier(
        databaseName
      )} WITH TEMPLATE ${quoteIdentifier(templateName)};`
    )
    await setAllowConnections(client, databaseName, true)
  })
}

export async function dropPostgresDatabaseTemplate(templateName: string) {
  await withWaitingroomClient(async (client) => {
    await dropDatabaseIfExists(client, templateName)
  })
}
