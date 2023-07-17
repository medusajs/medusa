import chalk from "chalk"
import fs from "fs"
import path from "path"
import { Ora } from "ora"
import promiseExec from "./promise-exec.js"
import { EOL } from "os"
import { displayFactBox, FactBoxOptions } from "./facts.js"
import { clearProject } from "@medusajs/utils"
import ProcessManager from "./process-manager.js"

type PrepareOptions = {
  directory: string
  dbConnectionString: string
  admin?: {
    email: string
  }
  seed?: boolean
  boilerplate?: boolean
  spinner: Ora
  processManager: ProcessManager
  abortController?: AbortController
}

export default async ({
  directory,
  dbConnectionString,
  admin,
  seed,
  boilerplate,
  spinner,
  processManager,
  abortController,
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
  }

  // initialize the invite token to return
  let inviteToken: string | undefined = undefined

  // add connection string to project
  fs.appendFileSync(
    path.join(directory, `.env`),
    `DATABASE_TYPE=postgres${EOL}DATABASE_URL=${dbConnectionString}`
  )

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    spinner,
    title: "Installing dependencies...",
    processManager,
  })

  await processManager.runProcess({
    process: async () => {
      try {
        await promiseExec(`yarn`, execOptions)
      } catch (e) {
        // yarn isn't available
        // use npm
        await promiseExec(`npm install --legacy-peer-deps`, execOptions)
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
        await promiseExec(`yarn build`, execOptions)
      } catch (e) {
        // yarn isn't available
        // use npm
        await promiseExec(`npm run build`, execOptions)
      }
    },
    ignoreERESOLVE: true,
  })

  displayFactBox({ ...factBoxOptions, message: "Project Built" })
  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Running Migrations...",
  })

  // run migrations
  await processManager.runProcess({
    process: async () => {
      const proc = await promiseExec(
        "npx @medusajs/medusa-cli@latest migrations run",
        npxOptions
      )

      // ensure that migrations actually ran in case of an uncaught error
      if (!proc.stdout.includes("Migrations completed")) {
        throw new Error(
          `An error occurred while running migrations: ${
            proc.stderr || proc.stdout
          }`
        )
      }
    },
  })

  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    message: "Ran Migrations",
  })

  if (admin) {
    // create admin user
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Creating an admin user...",
    })

    await processManager.runProcess({
      process: async () => {
        const proc = await promiseExec(
          `npx @medusajs/medusa-cli@latest user -e ${admin.email} --invite`,
          npxOptions
        )
        // get invite token from stdout
        const match = proc.stdout.match(/Invite token: (?<token>.+)/)
        inviteToken = match?.groups?.token
      },
    })

    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      message: "Created admin user",
    })
  }

  if (seed || !boilerplate) {
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Seeding database...",
    })

    // check if a seed file exists in the project
    if (!fs.existsSync(path.join(directory, "data", "seed.json"))) {
      spinner
        ?.warn(
          chalk.yellow(
            "Seed file was not found in the project. Skipping seeding..."
          )
        )
        .start()
      return inviteToken
    }

    await processManager.runProcess({
      process: async () => {
        await promiseExec(
          `npx @medusajs/medusa-cli@latest seed --seed-file=${path.join(
            "data",
            "seed.json"
          )}`,
          npxOptions
        )
      },
    })

    displayFactBox({
      ...factBoxOptions,
      message: "Seeded database with demo data",
    })
  } else if (
    fs.existsSync(path.join(directory, "data", "seed-onboarding.json"))
  ) {
    // seed the database with onboarding seed
    factBoxOptions.interval = displayFactBox({
      ...factBoxOptions,
      title: "Finish preparation...",
    })

    await processManager.runProcess({
      process: async () => {
        await promiseExec(
          `npx @medusajs/medusa-cli@latest seed --seed-file=${path.join(
            "data",
            "seed-onboarding.json"
          )}`,
          npxOptions
        )
      },
    })

    displayFactBox({ ...factBoxOptions, message: "Finished Preparation" })
  }

  return inviteToken
}
