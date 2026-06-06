import input from "@inquirer/input"
import type { Logger } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  createClient,
  createDb,
  dbExists,
  EnvEditor,
  parseConnectionString,
} from "@zjedene-medusa/framework/utils"
import { basename } from "path"
import slugify from "slugify"
import { initializeContainer } from "../../loaders"

async function connectClient(client: ReturnType<typeof createClient>) {
  try {
    await client.connect()
    return { connected: true, error: null }
  } catch (error) {
    return { connected: false, error }
  }
}

/**
 * A low-level utility to create the database. This util should
 * never exit the process implicitly.
 */
export async function dbCreate({
  db,
  directory,
  interactive,
  logger,
}: {
  db: string | undefined
  directory: string
  interactive: boolean
  logger: Logger
}): Promise<boolean> {
  let dbName = db

  /**
   * Loading the ".env" file in editor mode so that
   * we can read values from it and update its
   * contents.
   */
  const envEditor = new EnvEditor(directory)
  await envEditor.load()

  /**
   * Ensure the "DATABASE_URL" is defined before we attempt to
   * create the database.
   *
   * Also we will discard the database name from the connection
   * string because the mentioned database might not exist
   */
  const dbConnectionString = envEditor.get("DATABASE_URL")
  if (!dbConnectionString) {
    logger.error(
      `Missing "DATABASE_URL" inside the .env file. The value is required to connect to the PostgreSQL server`
    )
    return false
  }

  /**
   * Use default value + prompt only when the dbName is not
   * provided via a flag
   */
  if (!dbName) {
    const defaultValue =
      envEditor.get("DB_NAME") ?? `medusa-${slugify(basename(directory))}`
    if (interactive) {
      dbName = await input({
        message: "Enter the database name",
        default: defaultValue,
        required: true,
      })
    } else {
      dbName = defaultValue
    }
  }

  /**
   * Parse connection string specified as "DATABASE_URL" inside the
   * .env file and create a client instance from it.
   */
  const connectionOptions = parseConnectionString(dbConnectionString)

  /**
   * The following client config is without any database name. This is because
   * we want to connect to the default database (whatever it is) and create
   * a new database that we expect not to exist.
   */
  const clientConfig = {
    host: connectionOptions.host!,
    port: connectionOptions.port ? Number(connectionOptions.port) : undefined,
    user: connectionOptions.user,
    password: connectionOptions.password,
    ...(connectionOptions.ssl ? { ssl: connectionOptions.ssl as any } : {}),
  }

  /**
   * In some case the default database (which is same as the username) does
   * not exist. For example: With Neon, there is no database name after
   * the connection username. Hence, we will have to connect with the
   * postgres database.
   */
  const clientConfigWithPostgresDB = {
    host: connectionOptions.host!,
    port: connectionOptions.port ? Number(connectionOptions.port) : undefined,
    user: connectionOptions.user,
    database: "postgres",
    password: connectionOptions.password,
    ...(connectionOptions.ssl ? { ssl: connectionOptions.ssl as any } : {}),
  }

  /**
   * First connect with the default DB
   */
  let client = createClient(clientConfig)
  let connectionState = await connectClient(client)

  /**
   * In case of an error, connect with the postgres DB
   */
  if (!connectionState.connected) {
    client = createClient(clientConfigWithPostgresDB)
    connectionState = await connectClient(client)
  }

  /**
   * Notify user about the connection state
   */
  if (!connectionState.connected) {
    logger.error(
      "Unable to establish database connection because of the following error"
    )
    logger.error(connectionState.error)
    return false
  }

  logger.info(`Connection established with the database "${dbName}"`)
  if (await dbExists(client, dbName)) {
    logger.info(`Database "${dbName}" already exists`)

    envEditor.set("DB_NAME", dbName, { withEmptyTemplateValue: true })
    await envEditor.save()
    logger.info(`Updated .env file with "DB_NAME=${dbName}"`)

    return true
  }

  await createDb(client, dbName)
  logger.info(`Created database "${dbName}"`)

  envEditor.set("DB_NAME", dbName)
  await envEditor.save()
  logger.info(`Updated .env file with "DB_NAME=${dbName}"`)
  return true
}

const main = async function ({ directory, interactive, db }) {
  const container = await initializeContainer(directory, {
    skipDbConnection: true,
  })
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const created = await dbCreate({ directory, interactive, db, logger })
    process.exit(created ? 0 : 1)
  } catch (error) {
    if (error.name === "ExitPromptError") {
      process.exit()
    }
    logger.error(error)
    process.exit(1)
  }
}

export default main
