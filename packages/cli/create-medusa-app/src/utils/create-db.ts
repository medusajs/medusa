import { EOL } from "os"
import pg from "pg"
import postgresClient, { DEFAULT_HOST, DEFAULT_PORT } from "./postgres-client.js"
import inquirer from "inquirer"
import logMessage from "./log-message.js"
import formatConnectionString from "./format-connection-string.js"
import { Ora } from "ora"
import { getCurrentOs } from "./get-current-os.js"

type CreateDbOptions = {
  client: pg.Client
  db: string
}

export default async function createDb({ client, db }: CreateDbOptions) {
  await client.query(`CREATE DATABASE "${db}"`)
}

export async function runCreateDb({
  client,
  dbName,
  spinner,
}: {
  client: pg.Client
  dbName: string
  spinner: Ora
}): Promise<pg.Client> {
  let newClient = client

  try {
    // create postgres database
    await createDb({
      client,
      db: dbName,
    })

    // create a new connection with database selected
    await client.end()
    newClient = await postgresClient({
      user: client.user,
      password: client.password,
      database: dbName,
    })
  } catch (e) {
    spinner.stop()
    logMessage({
      message: `An error occurred while trying to create your database: ${e}`,
      type: "error",
    })
  }

  return newClient
}

async function getForDbName({
  dbName,
  verbose = false,
}: {
  dbName: string
  verbose?: boolean
}): Promise<{
  client: pg.Client
  dbConnectionString: string
}> {
  let client!: pg.Client
  let postgresUsername = "postgres"
  let postgresPassword = ""

  const defaultConnectionOptions = {
    host: DEFAULT_HOST,
    port: DEFAULT_PORT
  }

  try {
    client = await postgresClient({
      user: postgresUsername,
      password: postgresPassword,
      ...defaultConnectionOptions
    })
  } catch (e) {
    if (verbose) {
      logMessage({
        message: `The following error occured when connecting to the database: ${e}`,
        type: "verbose",
      })
    }
    // ask for the user's postgres credentials
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "postgresUsername",
        message: "Enter your Postgres username",
        default: "postgres",
        validate: (input) => {
          return typeof input === "string" && input.length > 0
        },
      },
      {
        type: "password",
        name: "postgresPassword",
        message: "Enter your Postgres password",
      },
    ])

    postgresUsername = answers.postgresUsername
    postgresPassword = answers.postgresPassword

    try {
      client = await postgresClient({
        user: postgresUsername,
        password: postgresPassword,
        ...defaultConnectionOptions
      })
    } catch (e) {
      logMessage({
        message: `Couldn't connect to PostgreSQL because of the following error: ${e}.${EOL}${EOL}Make sure you have PostgreSQL installed and the credentials you provided are correct.${EOL}${EOL}You can learn how to install PostgreSQL here: https://docs.medusajs.com/development/backend/prepare-environment?os=${getCurrentOs()}#postgresql${EOL}${EOL}If you keep running into this issue despite having PostgreSQL installed, please check out our troubleshooting guidelines: https://docs.medusajs.com/troubleshooting/database-error`,
        type: "error",
      })
    }
  }

  // format connection string
  const dbConnectionString = formatConnectionString({
    user: postgresUsername,
    password: postgresPassword,
    host: client!.host,
    db: dbName,
  })

  return {
    client,
    dbConnectionString,
  }
}

async function getForDbUrl({
  dbUrl,
  verbose = false,
}: {
  dbUrl: string
  verbose?: boolean
}): Promise<{
  client: pg.Client
  dbConnectionString: string
}> {
  let client!: pg.Client

  try {
    client = await postgresClient({
      connectionString: dbUrl,
    })
  } catch (e) {
    if (verbose) {
      logMessage({
        message: `The following error occured when connecting to the database: ${e}`,
        type: "verbose",
      })
    }
    logMessage({
      message: `Couldn't connect to PostgreSQL using the database URL you passed. Make sure it's correct and try again.`,
      type: "error",
    })
  }

  return {
    client,
    dbConnectionString: dbUrl,
  }
}

export async function getDbClientAndCredentials({
  dbName = "",
  dbUrl = "",
  verbose = false,
}): Promise<{
  client: pg.Client
  dbConnectionString: string
  verbose?: boolean
}> {
  if (dbName) {
    return await getForDbName({
      dbName,
      verbose,
    })
  } else {
    return await getForDbUrl({
      dbUrl,
      verbose,
    })
  }
}
