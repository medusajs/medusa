import inquirer from "inquirer"
import promiseExec from "./promise-exec.js"
import { FactBoxOptions, displayFactBox } from "./facts.js"
import fs from "fs"
import path from "path"
import { customAlphabet, nanoid } from "nanoid"
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
}

export async function installNextjsStarter({
  directoryName,
  abortController,
  factBoxOptions,
}: InstallOptions): Promise<string> {
  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Installing Next.js Storefront...",
  })

  let nextjsDirectory = `${directoryName}-storefront`

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
    await promiseExec(
      `npx create-next-app -e ${NEXTJS_REPO} ${nextjsDirectory}`,
      {
        signal: abortController?.signal,
        env: {
          ...process.env,
          npm_config_yes: "yes",
        },
      }
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
}

export async function startNextjsStarter({
  directory,
  abortController,
}: StartOptions) {
  try {
    await promiseExec(`npm run dev`, {
      cwd: directory,
      signal: abortController?.signal,
    })
  } catch {
    // ignore abort errors
  }
}
