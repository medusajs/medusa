import chalk from "chalk"
import fs from "fs"
import path from "path"
import { Ora } from "ora"
import promiseExec from "./promise-exec.js"
import { EOL } from "os"
import runProcess from "./run-process.js"
import { createFactBox, resetFactBox } from "./facts.js"

type PrepareOptions = {
  directory: string
  dbConnectionString: string
  admin?: {
    email: string
  }
  seed?: boolean
  spinner: Ora
  abortController?: AbortController
}

export default async ({
  directory,
  dbConnectionString,
  admin,
  seed,
  spinner,
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
    "Installing dependencies..."
  )

  await runProcess({
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
    "Running Migrations...."
  )

  // run migrations
  await runProcess({
    process: async () => {
      await promiseExec(
        "npx -y @medusajs/medusa-cli@latest migrations run",
        execOptions
      )
    },
  })

  interval = resetFactBox(interval, spinner, "Ran Migrations")

  if (admin) {
    // create admin user
    interval = createFactBox(spinner, "Creating an admin user...")

    await runProcess({
      process: async () => {
        const proc = await promiseExec(
          // TODO replace with latest version
          `npx -y @medusajs/medusa-cli@1.3.16-snapshot-20230605093446 user -e ${admin.email} --invite`,
          execOptions
        )
        // get invite token from stdout
        const match = proc.stdout.match(/Invite token: (?<token>.+)/)
        inviteToken = match?.groups?.token
      },
    })

    interval = resetFactBox(interval, spinner, "Created admin user")
  }

  if (seed) {
    interval = createFactBox(spinner, "Seeding database...")

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

    await runProcess({
      process: async () => {
        await promiseExec(
          `npx -y @medusajs/medusa-cli@latest seed --seed-file=${path.join(
            "data",
            "seed.json"
          )}`,
          execOptions
        )
      },
    })
    resetFactBox(interval, spinner, "Seeded database with demo data")
  } else if (
    fs.existsSync(path.join(directory, "data", "seed-onboarding.json"))
  ) {
    // seed the database with onboarding seed
    interval = createFactBox(spinner, "Finish preparation...")

    await runProcess({
      process: async () => {
        await promiseExec(
          `npx -y @medusajs/medusa-cli@latest seed --seed-file=${path.join(
            "data",
            "seed-onboarding.json"
          )}`,
          execOptions
        )
      },
    })
    resetFactBox(interval, spinner, "Finished Preparation")
  }

  return inviteToken
}
