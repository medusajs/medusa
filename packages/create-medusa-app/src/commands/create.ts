import inquirer from "inquirer"
import slugifyType from "slugify"
import chalk from "chalk"
import { getDbClientAndCredentials, runCreateDb } from "../utils/create-db.js"
import prepareProject from "../utils/prepare-project.js"
import startMedusa from "../utils/start-medusa.js"
import open from "open"
import waitOn from "wait-on"
import ora, { Ora } from "ora"
import fs from "fs"
import isEmailImported from "validator/lib/isEmail.js"
import logMessage from "../utils/log-message.js"
import createAbortController, {
  isAbortError,
} from "../utils/create-abort-controller.js"
import { track } from "medusa-telemetry"
import boxen from "boxen"
import { emojify } from "node-emoji"
import ProcessManager from "../utils/process-manager.js"
import { nanoid } from "nanoid"
import { displayFactBox, FactBoxOptions } from "../utils/facts.js"
import { EOL } from "os"
import { runCloneRepo } from "../utils/clone-repo.js"

const slugify = slugifyType.default
const isEmail = isEmailImported.default

export type CreateOptions = {
  repoUrl?: string
  seed?: boolean
  // commander passed --no-boilerplate as boilerplate
  boilerplate?: boolean
}

export default async ({ repoUrl = "", seed, boilerplate }: CreateOptions) => {
  track("CREATE_CLI")
  if (repoUrl) {
    track("STARTER_SELECTED", { starter: repoUrl })
  }
  if (seed) {
    track("SEED_SELECTED", { seed })
  }

  const spinner: Ora = ora()
  const processManager = new ProcessManager()
  const abortController = createAbortController(processManager)
  const factBoxOptions: FactBoxOptions = {
    interval: null,
    spinner,
    processManager,
    message: "",
    title: "",
  }
  const dbName = `medusa-${nanoid(4)}`
  let isProjectCreated = false
  let printedMessage = false

  processManager.onTerminated(async () => {
    spinner.stop()
    if (client) {
      await client.end()
    }

    // the SIGINT event is triggered twice once the backend runs
    // this ensures that the message isn't printed twice to the user
    if (!printedMessage && isProjectCreated) {
      printedMessage = true
      logMessage({
        message: boxen(
          chalk.green(
            `Change to the \`${projectName}\` directory to explore your Medusa project.${EOL}${EOL}Start your Medusa app again with the following command:${EOL}${EOL}npx @medusajs/medusa-cli develop${EOL}${EOL}Check out the Medusa documentation to start your development:${EOL}${EOL}https://docs.medusajs.com/${EOL}${EOL}Star us on GitHub if you like what we're building:${EOL}${EOL}https://github.com/medusajs/medusa/stargazers`
          ),
          {
            titleAlignment: "center",
            textAlignment: "center",
            padding: 1,
            margin: 1,
            float: "center",
          }
        ),
      })
    }

    return
  })

  const projectName = await askForProjectName()
  const { client, dbConnectionString } = await getDbClientAndCredentials(dbName)
  const adminEmail = await askForAdminEmail(seed, boilerplate)

  logMessage({
    message: `${emojify(
      ":rocket:"
    )} Starting project setup, this may take a few minutes.`,
  })

  spinner.start()

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Setting up project...",
  })

  try {
    await runCloneRepo({
      projectName,
      repoUrl,
      abortController,
      spinner,
    })
  } catch {
    return
  }

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    message: "Created project directory",
    title: "Creating database...",
  })

  await runCreateDb({ client, dbName, spinner })

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    message: `Database ${dbName} created`,
  })

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
      boilerplate,
      spinner,
      processManager,
      abortController,
    })
  } catch (e: any) {
    if (isAbortError(e)) {
      process.exit()
    }

    spinner.stop()
    logMessage({
      message: `An error occurred while preparing project: ${e}`,
      type: "error",
    })

    return
  } finally {
    // close db connection
    await client?.end()
  }

  spinner.succeed(chalk.green("Project Prepared"))

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

    return
  }

  isProjectCreated = true

  await waitOn({
    resources: ["http://localhost:9000/health"],
  }).then(async () =>
    open(
      inviteToken
        ? `http://localhost:7001/invite?token=${inviteToken}&first_run=true`
        : "http://localhost:7001"
    )
  )
}

async function askForProjectName(): Promise<string> {
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
  return projectName
}

async function askForAdminEmail(
  seed?: boolean,
  boilerplate?: boolean
): Promise<string> {
  const { adminEmail } = await inquirer.prompt([
    {
      type: "input",
      name: "adminEmail",
      message: "Enter an email for your admin dashboard user",
      default: !seed && boilerplate ? "admin@medusa-test.com" : undefined,
      validate: (input) => {
        return typeof input === "string" && input.length > 0 && isEmail(input)
          ? true
          : "Please enter a valid email"
      },
    },
  ])

  return adminEmail
}
