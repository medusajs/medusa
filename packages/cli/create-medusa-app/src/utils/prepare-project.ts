import fs from "fs"
import path from "path"
import { Ora } from "ora"
import execute from "./execute.js"
import { EOL } from "os"
import { displayFactBox, FactBoxOptions } from "./facts.js"
import ProcessManager from "./process-manager.js"
import { clearProject } from "./clear-project.js"
import type { Client } from "pg"

const ADMIN_EMAIL = "admin@medusa-test.com"
// TODO remove preview links once we move to main docs
const STORE_CORS = "http://localhost:8000,https://docs.medusajs.com,https://medusa-docs-v2-git-docs-v2-medusajs.vercel.app,https://medusa-resources-git-docs-v2-medusajs.vercel.app"
const ADMIN_CORS = "http://localhost:7000,http://localhost:7001,https://docs.medusajs.com,https://medusa-docs-v2-git-docs-v2-medusajs.vercel.app,https://medusa-resources-git-docs-v2-medusajs.vercel.app"
const DEFAULT_REDIS_URL = "redis://localhost:6379"

type PrepareOptions = {
  directory: string
  dbConnectionString: string
  seed?: boolean
  boilerplate?: boolean
  spinner: Ora
  processManager: ProcessManager
  abortController?: AbortController
  skipDb?: boolean
  migrations?: boolean
  onboardingType?: "default" | "nextjs"
  nextjsDirectory?: string
  client: Client | null
  verbose?: boolean
}

export default async ({
  directory,
  dbConnectionString,
  seed,
  boilerplate,
  spinner,
  processManager,
  abortController,
  skipDb,
  migrations,
  onboardingType = "default",
  nextjsDirectory = "",
  client,
  verbose = false,
}: PrepareOptions) => {
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

  // initialize the invite token to return
  let inviteToken: string | undefined = undefined

  // add environment variables
  let env = `MEDUSA_ADMIN_ONBOARDING_TYPE=${onboardingType}${EOL}STORE_CORS=${STORE_CORS}${EOL}ADMIN_CORS=${ADMIN_CORS}${EOL}REDIS_URL=${DEFAULT_REDIS_URL}${EOL}JWT_SECRET=supersecret${EOL}COOKIE_SECRET=supersecret`

  if (!skipDb) {
    env += `${EOL}DATABASE_URL=${dbConnectionString}${EOL}POSTGRES_URL=${dbConnectionString}`
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

  await processManager.runProcess({
    process: async () => {
      try {
        await execute([`yarn`, execOptions], { verbose })
      } catch (e) {
        // yarn isn't available
        // use npm
        await execute([`npm install --legacy-peer-deps`, execOptions], {
          verbose,
        })
      }
    },
    ignoreERESOLVE: true,
  })

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    message: "Installed Dependencies",
  })

  if (!boilerplate) {
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Preparing Project Directory...",
    })
    // delete files and directories related to onboarding
    clearProject(directory)
    displayFactBox({
      ...factBoxOptions,
      message: "Prepared Project Directory",
    })
  }

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Building Project...",
  })

  await processManager.runProcess({
    process: async () => {
      try {
        await execute([`yarn build`, execOptions], { verbose })
      } catch (e) {
        // yarn isn't available
        // use npm
        await execute([`npm run build`, execOptions], { verbose })
      }
    },
    ignoreERESOLVE: true,
  })

  displayFactBox({ ...factBoxOptions, message: "Project Built" })

  if (!skipDb && migrations) {
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Running Migrations...",
    })

    // run migrations
    await processManager.runProcess({
      process: async () => {
        const proc = await execute(
          ["npx medusa migrations run", npxOptions],
          { verbose, needOutput: true }
        )

        if (client) {
          // check the migrations table is in the database
          // to ensure that migrations ran
          let errorOccurred = false
          try {
            const migrations = await client.query(
              `SELECT * FROM "mikro_orm_migrations"`
            )
            errorOccurred = migrations.rowCount == 0
          } catch (e) {
            // avoid error thrown if the migrations table
            // doesn't exist
            errorOccurred = true
          }

          // ensure that migrations actually ran in case of an uncaught error
          if (errorOccurred && (proc.stderr || proc.stdout)) {
            throw new Error(
              `An error occurred while running migrations: ${
                proc.stderr || proc.stdout
              }`
            )
          }
        }
      },
    })

    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      message: "Ran Migrations",
    })
  }

  if (!skipDb && migrations) {
    // create admin user
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Creating an admin user...",
    })

    await processManager.runProcess({
      process: async () => {
        const proc = await execute(
          [
            `npx medusa user -e ${ADMIN_EMAIL} --invite`,
            npxOptions,
          ],
          { verbose, needOutput: true }
        )

        // get invite token from stdout
        const match = (proc.stdout as string).match(
          /Invite token: (?<token>.+)/
        )
        inviteToken = match?.groups?.token
      },
    })

    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      message: "Created admin user",
    })
  }

  if (!skipDb && migrations) {
    // TODO for now we just seed the default data
    // we should add onboarding seeding again if it makes
    // since once we re-introduce the onboarding flow.
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Seeding database...",
    })

    await processManager.runProcess({
      process: async () => {
        try {
          await execute([`yarn seed`, execOptions], { verbose })
        } catch (e) {
          // yarn isn't available
          // use npm
          await execute([`npm run seed`, execOptions], { verbose })
        }
      },
      ignoreERESOLVE: true,
    })

    displayFactBox({
      ...factBoxOptions,
      message: "Seeded database with demo data",
    })
  }

  displayFactBox({ ...factBoxOptions, message: "Finished Preparation" })

  return inviteToken
}
