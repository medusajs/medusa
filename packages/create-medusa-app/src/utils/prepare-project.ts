import chalk from "chalk"
import fs from "fs"
import path from "path"
import { Ora } from "ora"
import promiseExec from "./promise-exec.js"
import { EOL } from "os"
import runProcess from "./run-process.js"
import getFact from "./get-fact.js"
import onProcessTerminated from "./on-process-terminated.js"
import boxen from "boxen"

type PrepareOptions = {
  directory: string
  dbConnectionString: string
  admin?: {
    email: string
  }
  seed?: boolean
  spinner?: Ora
  abortController?: AbortController
}

const showFact = (lastFact: string, spinner: Ora): string => {
  const fact = getFact(lastFact)
  spinner.text = `${boxen(fact, {
    title: chalk.cyan("Installing Dependencies..."),
    titleAlignment: "center",
    textAlignment: "center",
    padding: 1,
    margin: 1,
    float: "center",
  })}`
  return fact
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

  let interval: NodeJS.Timer | undefined = undefined
  let fact = ""
  if (spinner) {
    spinner.spinner = {
      frames: [""],
    }
    fact = showFact(fact, spinner)
    interval = setInterval(() => {
      fact = showFact(fact, spinner)
    }, 6000)

    onProcessTerminated(() => clearInterval(interval))
  }

  await runProcess({
    process: async () => {
      try {
        await promiseExec(`yarn`, execOptions)
      } catch (e) {
        // yarn isn't available
        // use npm
        await promiseExec(`npm install`, execOptions)
      }
    },
    ignoreERESOLVE: true,
  })

  if (interval) {
    clearInterval(interval)
  }

  if (spinner) {
    spinner.spinner = "dots"
    spinner.succeed(chalk.green("Installed Dependencies"))
    spinner.start(chalk.white("Running Migrations..."))
  }

  // run migrations
  await runProcess({
    process: async () => {
      await promiseExec(
        "npx -y @medusajs/medusa-cli@latest migrations run",
        execOptions
      )
    },
  })

  spinner?.succeed(chalk.green("Ran Migrations")).start()

  if (admin) {
    // create admin user
    if (spinner) {
      spinner.text = chalk.white("Creating an admin user...")
    }

    await runProcess({
      process: async () => {
        const proc = await promiseExec(
          // TODO replace with latest version
          `npx -y @medusajs/medusa-cli@1.3.16-snapshot-20230530160902 user -e ${admin.email} --invite`,
          execOptions
        )
        // get invite token from stdout
        const match = proc.stdout.match(/Invite token: (?<token>.+)/)
        inviteToken = match?.groups?.token
      },
    })

    spinner?.succeed(chalk.green("Created admin user")).start()
  }

  if (seed) {
    if (spinner) {
      spinner.text = chalk.white("Seeding database...")
    }

    // check if a seed file exists in the project
    if (!fs.existsSync(path.join(directory, "data", "seed.jsons"))) {
      spinner
        ?.warn(
          chalk.yellow(
            "Seed file was not found in the project. Skipping seeding..."
          )
        )
        .start()
      return
    }

    if (spinner) {
      spinner.text = chalk.white("Seeding database with demo data...")
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

    spinner?.succeed(chalk.green("Seeded database with demo data")).start()
  }

  return inviteToken
}
