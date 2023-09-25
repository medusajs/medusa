import { EOL } from "os"
import pg from "pg"
import postgresClient from "./postgres-client.js"
import inquirer from "inquirer"
import logMessage from "./log-message.js"
import formatConnectionString from "./format-connection-string.js"
import { Ora } from "ora"
import { getCurrentOs } from "./get-current-os.js"
import ProcessManager from "./process-manager.js"
import promiseExec from "./promise-exec.js"

type CreateDbOptions = {
  client: pg.Client
  db: string
}

type DbResponse = {
  client: pg.Client
  dbConnectionString: string
  isRemote?: boolean
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
}) {
  // create postgres database
  try {
    await createDb({
      client,
      db: dbName,
    })
  } catch (e) {
    spinner.stop()
    logMessage({
      message: `An error occurred while trying to create your database: ${e}`,
      type: "error",
    })
  }
}

async function getForDbName(
  dbName: string,
  processManager: ProcessManager,
  abortController: AbortController,
  spinner: Ora,
  neonDb = false
): Promise<DbResponse> {
  return !neonDb
    ? getLocalForDbName(dbName)
    : getNeonForDbName(dbName, processManager, abortController, spinner)
}

async function getNeonForDbName(
  dbName: string,
  processManager: ProcessManager,
  abortController: AbortController,
  spinner: Ora
): Promise<DbResponse> {
  let client!: pg.Client
  let dbConnectionString = ""

  const npxOptions = {
    signal: abortController?.signal,
    env: {
      ...process.env,
      npm_config_yes: "yes",
    },
  }

  spinner.start(
    "Authenticating with Neon. A browser window will open in a moment..."
  )

  await processManager.runProcess({
    process: async () => {
      const proc = await promiseExec("npx neonctl auth", npxOptions)

      // the message is outputted by neonctl as an error for some reason
      if (
        !proc.stderr.toLowerCase().includes("auth complete") &&
        !proc.stdout.toLowerCase().includes("auth complete")
      ) {
        logMessage({
          message: `An error occurred while authenticating with Neon: ${proc.stderr}`,
          type: "error",
        })
        process.exit()
      }
    },
  })

  spinner.succeed("Authenticated with Neon").start("Creating a Neon project...")

  await processManager.runProcess({
    process: async () => {
      try {
        const proc = await promiseExec(
          `npx neonctl projects create --name ${dbName} --output json`,
          npxOptions
        )

        // the response by neonctl is outputted as an error for some reason
        const response = JSON.parse(proc.stdout || proc.stderr)
        if (!response?.connection_uris) {
          // some error or other issue was uncaught,
          // throw an error with it
          throw new Error(response)
        }
        dbConnectionString = `${response?.connection_uris[0]?.connection_uri}?sslmode=require`

        client = (await getForDbUrl(dbConnectionString)).client

        spinner.succeed(`Created project ${dbName} in Neon.`).stop()
      } catch (e) {
        if (
          typeof e === "object" &&
          e !== null &&
          "stderr" in e &&
          typeof e.stderr === "string" &&
          e.stderr.toLowerCase().includes("projects limit exceeded")
        ) {
          logMessage({
            message: `Your Neon plan does not allow creating a new project. Either upgrade your plan or delete an existing project, then try again.`,
            type: "error",
          })
        } else {
          logMessage({
            message: `An error occurred while creating a project in Neon: ${e}`,
            type: "error",
          })
        }
        process.exit()
      }
    },
  })

  return {
    client,
    dbConnectionString,
    isRemote: true,
  }
}

async function getLocalForDbName(dbName: string): Promise<DbResponse> {
  let client!: pg.Client
  let postgresUsername = "postgres"
  let postgresPassword = ""

  try {
    client = await postgresClient({
      user: postgresUsername,
      password: postgresPassword,
    })
  } catch (e) {
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
      })
    } catch (e) {
      logMessage({
        message: `Couldn't connect to PostgreSQL. Make sure you have PostgreSQL installed and the credentials you provided are correct.${EOL}${EOL}You can learn how to install PostgreSQL here: https://docs.medusajs.com/development/backend/prepare-environment?os=${getCurrentOs()}#postgresql${EOL}${EOL}If you keep running into this issue despite having PostgreSQL installed, please check out our troubleshooting guidelines: https://docs.medusajs.com/troubleshooting/database-error`,
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

async function getForDbUrl(dbUrl: string): Promise<DbResponse> {
  let client!: pg.Client

  try {
    client = await postgresClient({
      connectionString: dbUrl,
    })
  } catch (e) {
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
  processManager,
  abortController,
  spinner,
  neonDb = false,
}: {
  dbName?: string
  dbUrl?: string
  processManager: ProcessManager
  abortController: AbortController
  spinner: Ora
  neonDb?: boolean
}): Promise<DbResponse> {
  if (dbName) {
    return await getForDbName(
      dbName,
      processManager,
      abortController,
      spinner,
      neonDb
    )
  } else {
    return await getForDbUrl(dbUrl)
  }
}
