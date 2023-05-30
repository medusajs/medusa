import inquirer from "inquirer"
import slugifyType from "slugify"
import chalk from "chalk"
import pg from "pg"
import createDb from "../utils/create-db.js"
import postgresClient from "../utils/postgres-client.js"
import cloneRepo from "../utils/clone-repo.js"
import prepareProject from "../utils/prepare-project.js"
import startMedusa from "../utils/start-medusa.js"
import open from "open"
import waitOn from "wait-on"
import formatConnectionString from "../utils/format-connection-string.js"
import ora from "ora"
import fs from "fs"
import { nanoid } from "nanoid"
import isEmailImported from "validator/lib/isEmail.js"
import logMessage from "../utils/log-message.js"
import onProcessTerminated from "../utils/on-process-terminated.js"
import createAbortController, {
  isAbortError,
} from "../utils/create-abort-controller.js"
import { track } from "../utils/track.js"

const slugify = slugifyType.default
const isEmail = isEmailImported.default

type CreateOptions = {
  repoUrl?: string
  seed?: boolean
}

export default async ({ repoUrl = "", seed }: CreateOptions) => {
  track("CREATE_CLI")
  if (repoUrl) {
    track("STARTER_SELECTED", { starter: repoUrl })
  }
  if (seed) {
    track("SEED_SELECTED", { seed })
  }
  const abortController = createAbortController()

  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What's the name of your project?",
      default: "my-medusa-store",
      filter: (input) => {
        return slugify(input)
      },
      validate: (input) => {
        if (!input.length) {
          return "Please enter a project name"
        }
        return fs.existsSync(input) && fs.lstatSync(input).isDirectory()
          ? "A directory already exists with the same name. Please enter a different project name."
          : true
      },
    },
  ])

  let client: pg.Client | undefined
  let dbConnectionString = ""
  let postgresUsername = "postgres"
  let postgresPassword = ""

  // try to log in with default db username and password
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
        message:
          "Couldn't connect to PostgreSQL. Make sure you have PostgreSQL installed and the credentials you provided are correct.\n\n" +
          "You can learn how to install PostgreSQL here: https://docs.medusajs.com/development/backend/prepare-environment#postgresql",
        type: "error",
      })
    }
  }

  const { adminEmail } = await inquirer.prompt([
    {
      type: "input",
      name: "adminEmail",
      message: "Enter an email for your admin dashboard user",
      default: !seed ? "admin@medusa-test.com" : undefined,
      validate: (input) => {
        return typeof input === "string" && input.length > 0 && isEmail(input)
          ? true
          : "Please enter a valid email"
      },
    },
  ])

  const spinner = ora(chalk.white("Setting up project")).start()

  onProcessTerminated(() => spinner.stop())

  // clone repository
  try {
    await cloneRepo({
      directoryName: projectName,
      repoUrl,
      abortController,
    })
  } catch (e) {
    if (isAbortError(e)) {
      process.exit()
    }

    logMessage({
      message: `An error occurred while setting up your project: ${e}`,
      type: "error",
    })
  }

  spinner.succeed(chalk.green("Created project directory")).start()

  if (client) {
    spinner.text = chalk.white("Creating database...")
    const dbName = `medusa-${nanoid(4)}`
    // create postgres database
    try {
      await createDb({
        client,
        db: dbName,
      })
    } catch (e) {
      logMessage({
        message: `An error occurred while trying to create your database: ${e}`,
        type: "error",
      })
    }

    // format connection string
    dbConnectionString = formatConnectionString({
      user: postgresUsername,
      password: postgresPassword,
      host: client.host,
      db: dbName,
    })

    spinner.succeed(chalk.green(`Database ${dbName} created`)).start()
  }

  spinner.text = chalk.white("Preparing project...")

  // prepare project
  let inviteToken: string | undefined = undefined
  try {
    inviteToken = await prepareProject({
      directory: projectName,
      dbConnectionString,
      admin: {
        email: adminEmail,
      },
      seed,
      spinner,
      abortController,
    })
  } catch (e: any) {
    if (isAbortError(e)) {
      process.exit()
    }

    logMessage({
      message: `An error occurred while preparing project: ${e}`,
      type: "error",
    })
  }

  spinner.succeed(chalk.green("Project Prepared"))

  // close db connection
  await client?.end()

  // start backend
  logMessage({
    message: "Starting Medusa...",
  })

  try {
    startMedusa({
      directory: projectName,
      abortController,
    })
  } catch (e) {
    if (isAbortError(e)) {
      process.exit()
    }

    logMessage({
      message: `An error occurred while starting Medusa`,
      type: "error",
    })
  }

  await waitOn({
    resources: ["http://localhost:9000/health"],
  }).then(async () =>
    open(
      inviteToken
        ? `http://localhost:9000/app/invite?token=${inviteToken}`
        : "http://localhost:9000/app"
    )
  )
}
