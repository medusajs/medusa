import slugify from "slugify"
import { basename } from "path"
import input from "@inquirer/input"
import { logger } from "@medusajs/framework/logger"
import {
  createClient,
  createDb,
  dbExists,
  EnvEditor,
  parseConnectionString,
} from "@medusajs/framework/utils"

/**
 * A low-level utility to create the database. This util should
 * never exit the process implicitly.
 */
export async function dbCreate({
  db,
  directory,
  interactive,
}: {
  db: string | undefined
  directory: string
  interactive: boolean
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
   *
   * Remember we should not specify the database name from the
   * connection string, because this database might not
   * exist
   */
  const connectionOptions = parseConnectionString(dbConnectionString)
  const client = createClient({
    host: connectionOptions.host!,
    port: connectionOptions.port ? Number(connectionOptions.port) : undefined,
    user: connectionOptions.user,
    password: connectionOptions.password,
  })

  try {
    await client.connect()
    logger.info(`Connection established with the database "${dbName}"`)
  } catch (error) {
    logger.error(
      "Unable to establish database connection because of the following error"
    )
    logger.error(error)
    return false
  }

  if (await dbExists(client, dbName)) {
    logger.info(`Database "${dbName}" already exists`)

    envEditor.set("DB_NAME", dbName)
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
  try {
    const created = await dbCreate({ directory, interactive, db })
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
