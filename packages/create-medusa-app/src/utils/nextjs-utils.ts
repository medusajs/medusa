import inquirer from "inquirer"
import { exec } from "child_process"
import execute from "./execute.js"
import { FactBoxOptions, displayFactBox } from "./facts.js"
import fs from "fs"
import path from "path"
import { customAlphabet } from "nanoid"
import { isAbortError } from "./create-abort-controller.js"
import logMessage from "./log-message.js"

const NEXTJS_REPO = "https://github.com/medusajs/nextjs-starter-medusa"

export async function askForNextjsStarter(): Promise<boolean> {
  const { installNextjs } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installNextjs",
      message: `Would you like to create the Next.js storefront? You can also create it later`,
      default: false,
    },
  ])

  return installNextjs
}

type InstallOptions = {
  directoryName: string
  abortController?: AbortController
  factBoxOptions: FactBoxOptions
  verbose?: boolean
}

export async function installNextjsStarter({
  directoryName,
  abortController,
  factBoxOptions,
  verbose = false,
}: InstallOptions): Promise<string> {
  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Installing Next.js Storefront...",
  })

  let nextjsDirectory = `${directoryName}-storefront`

  if (directoryName === ".") {
    nextjsDirectory = nextjsDirectory.slice(2, nextjsDirectory.length)
  }

  if (
    fs.existsSync(nextjsDirectory) &&
    fs.lstatSync(nextjsDirectory).isDirectory()
  ) {
    // append a random number to the directory name
    nextjsDirectory += `-${customAlphabet(
      // npm throws an error if the directory name has an uppercase letter
      "123456789abcdefghijklmnopqrstuvwxyz",
      4
    )()}`
  }

  try {
    await execute(
      [
        `npx create-next-app@latest -e ${NEXTJS_REPO} ${nextjsDirectory}`,
        {
          signal: abortController?.signal,
          env: {
            ...process.env,
            npm_config_yes: "yes",
          },
        },
      ],
      { verbose }
    )
  } catch (e) {
    if (isAbortError(e)) {
      process.exit()
    }

    logMessage({
      message: `An error occurred while installing Next.js storefront: ${e}`,
      type: "error",
    })
  }

  fs.renameSync(
    path.join(nextjsDirectory, ".env.template"),
    path.join(nextjsDirectory, ".env.local")
  )

  displayFactBox({
    ...factBoxOptions,
    message: `Installed Next.js Starter successfully in the ${nextjsDirectory} directory.`,
  })

  return nextjsDirectory
}

type StartOptions = {
  directory: string
  abortController?: AbortController
  verbose?: boolean
}

export function startNextjsStarter({
  directory,
  abortController,
  verbose = false,
}: StartOptions) {
  const childProcess = exec(`npm run dev`, {
    cwd: directory,
    signal: abortController?.signal,
  })

  if (verbose) {
    childProcess.stdout?.pipe(process.stdout)
    childProcess.stderr?.pipe(process.stderr)
  }
}
