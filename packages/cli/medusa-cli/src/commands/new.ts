/*
 * Adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-cli/src/init-starter.ts
 */

import { track } from "@medusajs/telemetry"
import { execSync } from "child_process"
import execa from "execa"
import { sync as existsSync } from "fs-exists-cached"
import fs from "fs-extra"
import hostedGitInfo from "hosted-git-info"
import isValid from "is-valid-path"
import { default as path, default as sysPath } from "path"
import { Pool } from "pg"
import prompts from "prompts"
import url from "url"
// @ts-ignore
import inquirer from "inquirer"
import { createDatabase } from "pg-god"

import { getNodeVersion, MIN_SUPPORTED_NODE_VERSION } from "@medusajs/utils"
import reporter from "../reporter"
import { PanicId } from "../reporter/panic-handler"
import { clearProject } from "../util/clear-project"
import { getPackageManager, setPackageManager } from "../util/package-manager"

const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeUndefined(v) : v])
  )
}

const spawnWithArgs = (file, args, options) =>
  execa(file, args, { stdio: `inherit`, preferLocal: false, ...options })

const spawn = (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/)
  return spawnWithArgs(file, args, options)
}
// Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
const checkForYarn = () => {
  try {
    execSync(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (e) {
    return false
  }
}

const isAlreadyGitRepository = async () => {
  try {
    return await spawn(`git rev-parse --is-inside-work-tree`, {
      stdio: `pipe`,
    }).then((output) => output.stdout === `true`)
  } catch (err) {
    return false
  }
}

// Initialize newly cloned directory as a git repo
const gitInit = async (rootPath) => {
  reporter.info(`Initialising git in ${rootPath}`)

  return await spawn(`git init`, { cwd: rootPath })
}

// Create a .gitignore file if it is missing in the new directory
const maybeCreateGitIgnore = async (rootPath) => {
  if (existsSync(sysPath.join(rootPath, `.gitignore`))) {
    return
  }

  const gignore = reporter.activity(
    `Creating minimal .gitignore in ${rootPath}`
  )
  await fs.writeFile(
    sysPath.join(rootPath, `.gitignore`),
    `.cache\nnode_modules\npublic\n`
  )
  reporter.success(gignore, `Created .gitignore in ${rootPath}`)
}

// Create an initial git commit in the new directory
const createInitialGitCommit = async (rootPath, starterUrl) => {
  reporter.info(`Create initial git commit in ${rootPath}`)

  await spawn(`git add -A`, { cwd: rootPath })
  // use execSync instead of spawn to handle git clients using
  // pgp signatures (with password)
  try {
    execSync(`git commit -m "Initial commit from medusa: (${starterUrl})"`, {
      cwd: rootPath,
    })
  } catch {
    // Remove git support if initial commit fails
    reporter.warn(`Initial git commit failed - removing git support\n`)
    fs.removeSync(sysPath.join(rootPath, `.git`))
  }
}

// Executes `npm install` or `yarn install` in rootPath.
const install = async (rootPath) => {
  const prevDir = process.cwd()

  reporter.info(`Installing packages...`)
  console.log() // Add some space

  process.chdir(rootPath)

  const npmConfigUserAgent = process.env.npm_config_user_agent

  try {
    if (!getPackageManager()) {
      if (npmConfigUserAgent?.includes(`yarn`)) {
        setPackageManager(`yarn`)
      } else {
        setPackageManager(`npm`)
      }
    }
    if (getPackageManager() === `yarn` && checkForYarn()) {
      await fs.remove(`package-lock.json`)
      await spawn(`yarnpkg`, {})
    } else {
      await fs.remove(`yarn.lock`)
      await spawn(`npm install`, {})
    }
  } finally {
    process.chdir(prevDir)
  }
}

const ignored = (path) => !/^\.(git|hg)$/.test(sysPath.basename(path))

// Copy starter from file system.
const copy = async (starterPath, rootPath) => {
  // Chmod with 755.
  // 493 = parseInt('755', 8)
  await fs.ensureDir(rootPath, { mode: 493 })

  if (!existsSync(starterPath)) {
    throw new Error(`starter ${starterPath} doesn't exist`)
  }

  if (starterPath === `.`) {
    throw new Error(
      `You can't create a starter from the existing directory. If you want to
      create a new project in the current directory, the trailing dot isn't
      necessary. If you want to create a project from a local starter, run
      something like "medusa new my-medusa-store ../local-medusa-starter"`
    )
  }

  reporter.info(`Creating new site from local starter: ${starterPath}`)

  const copyActivity = reporter.activity(
    `Copying local starter to ${rootPath} ...`
  )

  await fs.copy(starterPath, rootPath, { filter: ignored })

  reporter.success(copyActivity, `Created starter directory layout`)
  console.log() // Add some space

  await install(rootPath)

  return true
}

// Clones starter from URI.
const clone = async (hostInfo, rootPath, v2 = false, inputBranch) => {
  let url
  // Let people use private repos accessed over SSH.
  if (hostInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostInfo.ssh({ noCommittish: true })
    // Otherwise default to normal git syntax.
  } else {
    url = hostInfo.https({ noCommittish: true, noGitPlus: true })
  }

  let branch =
    inputBranch || hostInfo.committish
      ? [`-b`, inputBranch || hostInfo.committish]
      : []

  if (v2) {
    branch = [`-b`, inputBranch || "master"]
  }

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

  await install(rootPath)
  const isGit = await isAlreadyGitRepository()
  if (!isGit) await gitInit(rootPath)
  await maybeCreateGitIgnore(rootPath)
  if (!isGit) await createInitialGitCommit(rootPath, url)
}

const getPaths = async (starterPath, rootPath, v2 = false) => {
  let selectedOtherStarter = false

  // if no args are passed, prompt user for path and starter
  if (!starterPath && !rootPath) {
    const response = await prompts.prompt([
      {
        type: `text`,
        name: `path`,
        message: `What is your project called?`,
        initial: `my-medusa-store`,
      },
      !v2 && {
        type: `select`,
        name: `starter`,
        message: `What starter would you like to use?`,
        choices: [
          { title: `medusa-starter-default`, value: `medusa-starter-default` },
          { title: `(Use a different starter)`, value: `different` },
        ],
        initial: 0,
      },
    ])

    // exit gracefully if responses aren't provided
    if ((!v2 && !response.starter) || !response.path.trim()) {
      throw new Error(
        `Please mention both starter package and project name along with path(if its not in the root)`
      )
    }

    selectedOtherStarter = response.starter === `different`
    starterPath = `medusajs/${v2 ? "medusa-starter-default" : response.starter}`
    rootPath = response.path
  }

  // set defaults if no root or starter has been set yet
  rootPath = rootPath || process.cwd()
  starterPath = starterPath || `medusajs/medusa-starter-default`

  return { starterPath, rootPath, selectedOtherStarter }
}

const successMessage = (path) => {
  reporter.info(`Your new Medusa project is ready for you! To start developing run:

  cd ${path}
  medusa develop
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
    pool.query("SELECT NOW()", (err, res) => {
      pool.end()
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
    `cli`,
    `cli.js`
  )

  return await execa(cliPath, [`db:migrate`], {
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

/**
 * Main function that clones or copies the starter.
 */
export const newStarter = async (args) => {
  const nodeVersion = getNodeVersion()
  if (nodeVersion < MIN_SUPPORTED_NODE_VERSION) {
    reporter.error(
      `Medusa requires at least v20 of Node.js. You're using v${nodeVersion}. Please install at least v20 and try again: https://nodejs.org/en/download`
    )
    process.exit(1)
  }
  track("CLI_NEW")

  const {
    starter,
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
    v2,
    branch,
  } = args

  const dbCredentials = removeUndefined({
    user: dbUser,
    database: dbDatabase,
    password: dbPass,
    port: dbPort,
    host: dbHost,
  })

  const { starterPath, rootPath, selectedOtherStarter } = await getPaths(
    starter,
    root,
    v2
  )

  const urlObject = url.parse(rootPath)

  if (selectedOtherStarter) {
    reporter.info(
      `Find the url of the Medusa starter you wish to create and run:

medusa new ${rootPath} [url-to-starter]

`
    )
    return
  }

  if (urlObject.protocol && urlObject.host) {
    const isStarterAUrl =
      starter && !url.parse(starter).hostname && !url.parse(starter).protocol

    if (/medusa-starter/gi.test(rootPath) && isStarterAUrl) {
      reporter.panic({
        id: PanicId.InvalidProjectName,
        context: {
          starter,
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

  const hostedInfo = hostedGitInfo.fromUrl(starterPath)
  if (hostedInfo) {
    await clone(hostedInfo, rootPath, v2, branch)
  } else {
    await copy(starterPath, rootPath)
  }

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

  if (!selectedOtherStarter) {
    reporter.info("Final project preparations...")
    // remove demo files
    clearProject(rootPath)
    // remove .git directory
    fs.rmSync(path.join(rootPath, ".git"), {
      recursive: true,
      force: true,
    })
  }

  successMessage(rootPath)
  track("CLI_NEW_SUCCEEDED")
}
