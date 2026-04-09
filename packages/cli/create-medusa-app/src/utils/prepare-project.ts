import fs from "fs"
import path from "path"
import { Ora } from "ora"
import { ExecuteResult } from "./execute.js"
import { EOL } from "os"
import { displayFactBox, FactBoxOptions } from "./facts.js"
import ProcessManager from "./process-manager.js"
import type { Client } from "@medusajs/deps/pg"
import PackageManager from "./package-manager.js"
import { updatePackageVersions } from "./update-package-versions.js"

const ADMIN_EMAIL = "admin@medusa-test.com"
let STORE_CORS = "http://localhost:8000"
let ADMIN_CORS = "http://localhost:5173,http://localhost:9000"
const DOCS_CORS = "https://docs.medusajs.com"
const AUTH_CORS = [ADMIN_CORS, STORE_CORS, DOCS_CORS].join(",")
STORE_CORS += `,${DOCS_CORS}`
ADMIN_CORS += `,${DOCS_CORS}`
const DEFAULT_REDIS_URL = "redis://localhost:6379"

type PreparePluginOptions = {
  isPlugin: true
  directory: string
  projectName: string
  spinner: Ora
  processManager: ProcessManager
  abortController?: AbortController
  verbose?: boolean
  packageManager: PackageManager
}

type PrepareProjectOptions = {
  isPlugin: false
  directory: string
  dbName?: string
  dbConnectionString: string
  projectName: string
  seed?: boolean
  spinner: Ora
  processManager: ProcessManager
  abortController?: AbortController
  skipDb?: boolean
  migrations?: boolean
  onboardingType?: "default" | "nextjs"
  nextjsDirectory?: string
  client: Client | null
  verbose?: boolean
  packageManager: PackageManager
  version?: string
}

type PrepareOptions = PreparePluginOptions | PrepareProjectOptions

export default async <
  T extends PrepareOptions,
  Output = T extends { isPlugin: true } ? void : string | undefined
>(
  prepareOptions: T
): Promise<Output> => {
  if (prepareOptions.isPlugin) {
    return preparePlugin(prepareOptions) as Output
  }

  return prepareProject(prepareOptions) as Output
}

async function preparePlugin({
  directory,
  projectName,
  spinner,
  processManager,
  abortController,
  verbose = false,
  packageManager,
}: PreparePluginOptions) {
  // initialize execution options
  const execOptions = {
    cwd: directory,
    signal: abortController?.signal,
  }

  const factBoxOptions: FactBoxOptions = {
    interval: null,
    spinner,
    processManager,
    message: "",
    title: "",
    verbose,
  }

  // Update package.json
  const packageJsonPath = path.join(directory, "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

  // Update name
  packageJson.name = projectName

  // Add packageManager field to ensure consistent version usage
  const packageManagerString = await packageManager.getPackageManagerString()
  if (packageManagerString) {
    packageJson.packageManager = packageManagerString
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    spinner,
    title: "Installing dependencies...",
    processManager,
  })

  await packageManager.installDependencies(execOptions)

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    message: "Installed Dependencies",
  })

  displayFactBox({ ...factBoxOptions, message: "Finished Preparation" })
}

async function prepareProject({
  directory,
  projectName,
  dbName,
  dbConnectionString,
  seed,
  spinner,
  processManager,
  abortController,
  skipDb,
  migrations,
  onboardingType = "default",
  nextjsDirectory = "",
  client,
  verbose = false,
  packageManager,
  version,
}: PrepareProjectOptions) {
  // initialize execution options
  const execOptions = {
    cwd: directory,
    signal: abortController?.signal,
  }

  const npxOptions = {
    ...execOptions,
    env: {
      ...process.env,
      npm_config_yes: "yes",
    },
  }

  const factBoxOptions: FactBoxOptions = {
    interval: null,
    spinner,
    processManager,
    message: "",
    title: "",
    verbose,
  }

  // Update package.json
  const packageJsonPath = path.join(directory, "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

  // Update name
  packageJson.name = projectName

  // Add packageManager field to ensure consistent version usage
  const packageManagerString = await packageManager.getPackageManagerString()
  if (packageManagerString) {
    packageJson.packageManager = packageManagerString
  }

  // Update medusa dependencies versions
  if (version) {
    updatePackageVersions(packageJson, version)
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  // initialize the invite token to return
  let inviteToken: string | undefined = undefined

  // add environment variables
  let env = `MEDUSA_ADMIN_ONBOARDING_TYPE=${onboardingType}${EOL}STORE_CORS=${STORE_CORS}${EOL}ADMIN_CORS=${ADMIN_CORS}${EOL}AUTH_CORS=${AUTH_CORS}${EOL}REDIS_URL=${DEFAULT_REDIS_URL}${EOL}JWT_SECRET=supersecret${EOL}COOKIE_SECRET=supersecret`

  if (!skipDb) {
    if (dbName) {
      env += `${EOL}DB_NAME=${dbName}`
      dbConnectionString = dbConnectionString!.replace(dbName, "$DB_NAME")
    }
    env += `${EOL}DATABASE_URL=${dbConnectionString}`
  }

  if (nextjsDirectory) {
    env += `${EOL}MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=${nextjsDirectory}`
  }

  fs.appendFileSync(path.join(directory, `.env`), env)

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    spinner,
    title: "Installing dependencies...",
    processManager,
  })

  await packageManager.installDependencies(execOptions)

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    message: "Installed Dependencies",
  })

  if (!skipDb && migrations) {
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Running Migrations...",
    })

    // run migrations
    const migrationExecResult = await packageManager.runMedusaCommand(
      "db:migrate",
      npxOptions,
      {
        verbose,
        needOutput: true,
      }
    )

    if (client) {
      // check the migrations table is in the database
      // to ensure that migrations ran
      let errorOccurred = false
      try {
        const migrations = await client.query(
          `SELECT count(tablename) from pg_tables WHERE tablename = 'mikro_orm_migrations'`
        )
        errorOccurred = migrations.rowCount == 0
      } catch (e) {
        // avoid error thrown if the migrations table
        // doesn't exist
        errorOccurred = true
      }

      // ensure that migrations actually ran in case of an uncaught error
      if (
        errorOccurred &&
        (migrationExecResult.stderr || migrationExecResult.stdout)
      ) {
        throw new Error(
          `An error occurred while running migrations: ${
            migrationExecResult.stderr || migrationExecResult.stdout
          }`
        )
      }
    }

    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      message: "Ran Migrations",
    })

    const userExecResult = (await packageManager.runMedusaCommand(
      `user -e ${ADMIN_EMAIL} --invite`,
      npxOptions,
      { verbose, needOutput: true }
    )) as ExecuteResult

    // get invite token from stdout
    const match = (userExecResult.stdout as string).match(
      /Invite token: (?<token>.+)/
    )
    inviteToken = match?.groups?.token

    // TODO for now we just seed the default data
    // we should add onboarding seeding again if it makes
    // since once we re-introduce the onboarding flow.
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Seeding database...",
    })

    await packageManager.runCommand("seed", execOptions)

    displayFactBox({
      ...factBoxOptions,
      message: "Seeded database with demo data",
    })
  }

  // if installation includes Next.js, retrieve the publishable API key
  // from the backend and add it as an enviornment variable
  if (nextjsDirectory && client) {
    const apiKeys = await client.query(
      `SELECT * FROM "api_key" WHERE type = 'publishable'`
    )

    if (apiKeys.rowCount) {
      const nextjsEnvPath = path.join(
        nextjsDirectory,
        fs.existsSync(path.join(nextjsDirectory, ".env.local"))
          ? ".env.local"
          : ".env.template"
      )

      const originalContent = fs.readFileSync(nextjsEnvPath, "utf-8")

      fs.writeFileSync(
        nextjsEnvPath,
        originalContent.replace(
          "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test",
          `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKeys.rows[0].token}`
        )
      )
    }
  }

  displayFactBox({ ...factBoxOptions, message: "Finished Preparation" })

  return inviteToken
}
