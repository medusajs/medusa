import chalk from "chalk"
import fs from "fs"
import path from "path"
import { Ora } from "ora"
import promiseExec from "./promise-exec.js"
import { EOL } from "os"
import { createFactBox, resetFactBox } from "./facts.js"
import clearProject from "./clear-project.js"
import ProcessManager from "./process-manager.js"

type PrepareOptions = {
  directory: string
  dbConnectionString: string
  admin?: {
    email: string
  }
  seed?: boolean
  noBoilerplate?: boolean
  spinner: Ora
  processManager: ProcessManager
  abortController?: AbortController
}

export default async ({
  directory,
  dbConnectionString,
  admin,
  seed,
  noBoilerplate,
  spinner,
  processManager,
  abortController,
}: PrepareOptions) => {
  // initialize execution options
  const execOptions = {
    cwd: directory,
    signal: abortController?.signal,
  }

  // initialize the invite token to return
  let inviteToken: string | undefined = undefined

  // add connection string to project
  fs.appendFileSync(
    path.join(directory, `.env`),
    `DATABASE_TYPE=postgres${EOL}DATABASE_URL=${dbConnectionString}`
  )

  let interval: NodeJS.Timer | null = createFactBox(
    spinner,
    "Installing dependencies...",
    processManager
  )

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

  interval = resetFactBox(
    interval,
    spinner,
    "Installed Dependencies",
    processManager
  )

  if (noBoilerplate) {
    interval = createFactBox(
      spinner,
      "Preparing Project Directory...",
      processManager
    )
    // delete files and directories related to onboarding
    clearProject(directory)
    interval = resetFactBox(
      interval,
      spinner,
      "Prepared Project Directory",
      processManager
    )
  }

  interval = createFactBox(spinner, "Building Project...", processManager)
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

  interval = resetFactBox(interval, spinner, "Project Built", processManager)

  interval = createFactBox(spinner, "Running Migrations...", processManager)

  // run migrations
  await processManager.runProcess({
    process: async () => {
      const proc = await promiseExec(
        "npx -y @medusajs/medusa-cli@1.3.16-snapshot-20230613154819 migrations run",
        execOptions
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

  interval = resetFactBox(interval, spinner, "Ran Migrations", processManager)

  if (admin) {
    // create admin user
    interval = createFactBox(
      spinner,
      "Creating an admin user...",
      processManager
    )

    await processManager.runProcess({
      process: async () => {
        const proc = await promiseExec(
          `npx -y @medusajs/medusa-cli@1.3.16-snapshot-20230613154819 user -e ${admin.email} --invite`,
          execOptions
        )
        // get invite token from stdout
        const match = proc.stdout.match(/Invite token: (?<token>.+)/)
        inviteToken = match?.groups?.token
      },
    })

    interval = resetFactBox(
      interval,
      spinner,
      "Created admin user",
      processManager
    )
  }

  if (seed) {
    interval = createFactBox(spinner, "Seeding database...", processManager)

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
          `npx -y @medusajs/medusa-cli@1.3.16-snapshot-20230613154819 seed --seed-file=${path.join(
            "data",
            "seed.json"
          )}`,
          execOptions
        )
      },
    })
    resetFactBox(
      interval,
      spinner,
      "Seeded database with demo data",
      processManager
    )
  } else if (
    fs.existsSync(path.join(directory, "data", "seed-onboarding.json"))
  ) {
    // seed the database with onboarding seed
    interval = createFactBox(spinner, "Finish preparation...", processManager)

    await processManager.runProcess({
      process: async () => {
        await promiseExec(
          `npx -y @medusajs/medusa-cli@1.3.16-snapshot-20230613154819 seed --seed-file=${path.join(
            "data",
            "seed-onboarding.json"
          )}`,
          execOptions
        )
      },
    })
    resetFactBox(interval, spinner, "Finished Preparation", processManager)
  }

  return inviteToken
}
