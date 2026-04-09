/*
 * Adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-cli/src/init-starter.ts
 */

import execa from "execa"
import { sync as existsSync } from "fs-exists-cached"
import fs from "fs-extra"
import hostedGitInfo from "hosted-git-info"
import isValid from "is-valid-path"
import sysPath from "path"
import prompts from "prompts"
import { Pool } from "@medusajs/deps/pg"
import url from "url"
import { track } from "@medusajs/telemetry"
// @ts-ignore
import inquirer from "inquirer"
import { createDatabase } from "pg-god"

import { getNodeVersion, MIN_SUPPORTED_NODE_VERSION } from "@medusajs/utils"
import reporter from "../reporter"
import { PanicId } from "../reporter/panic-handler"
import { getPackageManager } from "../util/package-manager"

const STARTER_PATH = `medusajs/dtc-starter`

const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeUndefined(v) : v])
  )
}

const spawnWithArgs = async (file, args, options) =>
  execa(file, args, { stdio: `inherit`, preferLocal: false, ...options })

const spawn = async (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/)
  return spawnWithArgs(file, args, options)
}

// Executes `pnpm install`, `yarn install`, or `npm install` in rootPath.
const install = async (rootPath: string) => {
  const prevDir = process.cwd()

  reporter.info(`Installing packages...`)
  console.log() // Add some space

  process.chdir(rootPath)

  try {
    await spawn(`pnpm install`, {})
  } finally {
    process.chdir(prevDir)
  }
}

// Clones starter from URI.
const clone = async (rootPath: string, inputBranch?: string) => {
  const hostedInfo = hostedGitInfo.fromUrl(STARTER_PATH)
  let url
  // Let people use private repos accessed over SSH.
  if (hostedInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostedInfo.ssh({ noCommittish: true })
    // Otherwise default to normal git syntax.
  } else {
    url = hostedInfo.https({ noCommittish: true, noGitPlus: true })
  }

  const branch = [`-b`, inputBranch || "main"]

  const createAct = reporter.activity(`Creating new project from git: ${url}`)

  const args = [
    `clone`,
    ...branch,
    url,
    rootPath,
    `--recursive`,
    `--depth=1`,
  ].filter((arg) => Boolean(arg))

  await execa(`git`, args, {})
    .then(() => {
      reporter.success(createAct, `Created starter directory layout`)
    })
    .catch((err) => {
      reporter.failure(createAct, `Failed to clone repository`)
      throw err
    })

  await fs.remove(sysPath.join(rootPath, `.git`))
  await fs.remove(sysPath.join(rootPath, `.github`))

  // remove storefront from monorepo
  await fs.remove(sysPath.join(rootPath, `apps`, `storefront`))

  await install(rootPath)
}

const getPaths = async (rootPath?: string) => {
  // if no args are passed, prompt user for path and starter
  if (!rootPath) {
    const response = await prompts.prompt([
      {
        type: `text`,
        name: `path`,
        message: `What is your project called?`,
        initial: `my-medusa-store`,
      },
    ])

    // exit gracefully if responses aren't provided
    if (!response.path.trim()) {
      throw new Error(
        `Please mention both starter package and project name along with path(if its not in the root)`
      )
    }

    rootPath = response.path
  }

  // set defaults if no root or starter has been set yet
  rootPath = rootPath || process.cwd()

  return { rootPath }
}

const successMessage = (path) => {
  reporter.info(`Your new Medusa project is ready for you! To start developing run:

  cd ${path}
  pnpm dev
`)
}

const defaultDBCreds = {
  user: process.env.USER || "postgres",
  database: "postgres",
  password: "",
  port: 5432,
  host: "localhost",
}

const verifyPgCreds = async (creds) => {
  const pool = new Pool(creds)
  return new Promise((resolve, reject) => {
    pool.query("SELECT NOW()", async (err, res) => {
      await pool.end()
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

const interactiveDbCreds = async (dbName, dbCreds = {}) => {
  const credentials = Object.assign({}, defaultDBCreds, dbCreds)

  const collecting = true

  while (collecting) {
    const result = await inquirer
      .prompt([
        {
          type: "list",
          name: "continueWithDefault",
          message: `

Will attempt to setup Postgres database "${dbName}" with credentials:
  user: ${credentials.user}
  password: ***
  port: ${credentials.port}
  host: ${credentials.host}
Do you wish to continue with these credentials?

          `,
          choices: [`Continue`, `Change credentials`, `Skip database setup`],
        },
        {
          type: "input",
          when: ({ continueWithDefault }) =>
            continueWithDefault === `Change credentials`,
          name: "user",
          default: credentials.user,
          message: `DB user`,
        },
        {
          type: "password",
          when: ({ continueWithDefault }) =>
            continueWithDefault === `Change credentials`,
          name: "password",
          default: credentials.password,
          message: `DB password`,
        },
        {
          type: "number",
          when: ({ continueWithDefault }) =>
            continueWithDefault === `Change credentials`,
          name: "port",
          default: credentials.port,
          message: `DB port`,
        },
        {
          type: "input",
          when: ({ continueWithDefault }) =>
            continueWithDefault === `Change credentials`,
          name: "host",
          default: credentials.host,
          message: `DB host`,
        },
      ])
      .then(async (answers) => {
        const collectedCreds = Object.assign({}, credentials, {
          user: answers.user,
          password: answers.password,
          host: answers.host,
          port: answers.port,
        })

        switch (answers.continueWithDefault) {
          case "Continue": {
            const done = await verifyPgCreds(credentials).catch((_) => false)
            if (done) {
              return credentials
            }
            return false
          }
          case "Change credentials": {
            const done = await verifyPgCreds(collectedCreds).catch((_) => false)
            if (done) {
              return collectedCreds
            }
            return false
          }
          default:
            return null
        }
      })

    if (result !== false) {
      return result
    }

    console.log("\n\nCould not verify DB credentials - please try again\n\n")
  }

  return
}

const setupDB = async (dbName, dbCreds = {}) => {
  const credentials = Object.assign({}, defaultDBCreds, dbCreds)

  const dbActivity = reporter.activity(`Setting up database "${dbName}"...`)
  await createDatabase(
    {
      databaseName: dbName,
      errorIfExist: true,
    },
    credentials
  )
    .then(() => {
      reporter.success(dbActivity, `Created database "${dbName}"`)
    })
    .catch((err) => {
      if (err.name === "PDG_ERR::DuplicateDatabase") {
        reporter.success(
          dbActivity,
          `Database ${dbName} already exists; skipping setup`
        )
      } else {
        reporter.failure(dbActivity, `Skipping database setup.`)
        reporter.warn(
          `Failed to setup database; install PostgresQL or make sure to manage your database connection manually`
        )
        console.error(err)
      }
    })
}

const setupEnvVars = async (rootPath, dbName, dbCreds = {}) => {
  const templatePath = sysPath.join(rootPath, ".env.template")
  const destination = sysPath.join(rootPath, ".env")
  if (existsSync(templatePath)) {
    fs.renameSync(templatePath, destination)
  }

  const credentials = Object.assign({}, defaultDBCreds, dbCreds)
  let dbUrl = ""
  if (
    credentials.user !== defaultDBCreds.user ||
    credentials.password !== defaultDBCreds.password
  ) {
    dbUrl = `postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${dbName}`
  } else {
    dbUrl = `postgres://${credentials.host}:${credentials.port}/${dbName}`
  }

  fs.appendFileSync(destination, `DATABASE_URL=${dbUrl}\n`)
}

const runMigrations = async (rootPath) => {
  const migrationActivity = reporter.activity("Applying database migrations...")

  const cliPath = sysPath.join(
    `node_modules`,
    `@medusajs`,
    `medusa-cli`,
    `cli.js`
  )

  return await execa(cliPath, [`migrations`, `run`], {
    cwd: rootPath,
  })
    .then(() => {
      reporter.success(migrationActivity, "Database migrations completed.")
    })
    .catch((err) => {
      reporter.failure(
        migrationActivity,
        "Failed to migrate database you must complete migration manually before starting your server."
      )
      console.error(err)
    })
}

const attemptSeed = async (rootPath) => {
  const seedActivity = reporter.activity("Seeding database")

  const pkgPath = sysPath.resolve(rootPath, "package.json")
  if (existsSync(pkgPath)) {
    const pkg = require(pkgPath)
    if (pkg.scripts && pkg.scripts.seed) {
      const proc = execa(getPackageManager(), [`run`, `seed`], {
        cwd: rootPath,
      })

      // Useful for development
      // proc.stdout.pipe(process.stdout)

      await proc
        .then(() => {
          reporter.success(seedActivity, "Seed completed")
        })
        .catch((err) => {
          reporter.failure(seedActivity, "Failed to complete seed; skipping")
          console.error(err)
        })
    } else {
      reporter.failure(
        seedActivity,
        "Starter doesn't provide a seed command; skipping."
      )
    }
  } else {
    reporter.failure(seedActivity, "Could not find package.json")
  }
}

type NewCommandArgs = {
  root?: string
  skipDb?: boolean
  skipMigrations?: boolean
  skipEnv?: boolean
  seed?: boolean
  useDefaults?: boolean
  dbUser?: string
  dbDatabase?: string
  dbPass?: string
  dbPort?: number
  dbHost?: string
  branch?: string
}

/**
 * Main function that clones or copies the starter.
 */
export const newStarter = async (args: NewCommandArgs) => {
  const nodeVersion = getNodeVersion()
  if (nodeVersion < MIN_SUPPORTED_NODE_VERSION) {
    reporter.error(
      `Medusa requires at least v20 of Node.js. You're using v${nodeVersion}. Please install at least v20 and try again: https://nodejs.org/en/download`
    )
    process.exit(1)
  }
  track("CLI_NEW")

  const {
    root,
    skipDb,
    skipMigrations,
    skipEnv,
    seed,
    useDefaults,
    dbUser,
    dbDatabase,
    dbPass,
    dbPort,
    dbHost,
    branch,
  } = args

  const dbCredentials = removeUndefined({
    user: dbUser,
    database: dbDatabase,
    password: dbPass,
    port: dbPort,
    host: dbHost,
  })

  const { rootPath } = await getPaths(root)

  const urlObject = url.parse(rootPath)

  if (urlObject.protocol && urlObject.host) {
    if (/medusa-starter/gi.test(rootPath)) {
      reporter.panic({
        id: PanicId.InvalidProjectName,
        context: {
          starter: STARTER_PATH,
          rootPath,
        },
      })
      return
    }

    reporter.panic({
      id: PanicId.InvalidProjectName,
      context: {
        rootPath,
      },
    })
    return
  }

  if (!isValid(rootPath)) {
    reporter.panic({
      id: PanicId.InvalidPath,
      context: {
        path: sysPath.resolve(rootPath),
      },
    })
    return
  }

  if (existsSync(sysPath.join(rootPath, `package.json`))) {
    reporter.panic({
      id: PanicId.AlreadyNodeProject,
      context: {
        rootPath,
      },
    })
    return
  }

  await clone(rootPath, branch)

  track("CLI_NEW_LAYOUT_COMPLETED")

  let creds = dbCredentials

  const dbName = `medusa-db-${Math.random().toString(36).substring(2, 7)}` // generate random 5 character string

  if (!useDefaults && !skipDb && !skipEnv) {
    creds = await interactiveDbCreds(dbName, dbCredentials)
  }

  if (creds === null) {
    reporter.info(
      "Skipping automatic database setup. Please note that you need to create a database and run migrations before you can run your Medusa backend"
    )
  } else {
    if (!skipDb) {
      track("CLI_NEW_SETUP_DB")
      await setupDB(dbName, creds)
    }

    if (!skipEnv) {
      track("CLI_NEW_SETUP_ENV")
      await setupEnvVars(rootPath, dbName, creds)
    }

    if (!skipMigrations) {
      track("CLI_NEW_RUN_MIGRATIONS")
      await runMigrations(rootPath)
    }

    if (seed) {
      track("CLI_NEW_SEED_DB")
      await attemptSeed(rootPath)
    }
  }

  successMessage(rootPath)
  track("CLI_NEW_SUCCEEDED")
}
