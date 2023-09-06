import inquirer from "inquirer"
import promiseExec from "./promise-exec.js"
import { FactBoxOptions, displayFactBox } from "./facts.js"

const NEXTJS_REPO = "https://github.com/medusajs/nextjs-starter-medusa"

export async function askForNextjsStarter(): Promise<boolean> {
  const { installNextjs } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installNextjs",
      message:
        "The Medusa backend is installed without a storefront. Would you like to install the Next.js storefront as well? You can always install it later.",
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

  const nextjsDirectory = `${directoryName}-storefront`

  await promiseExec(
    `npx create-next-app -e ${NEXTJS_REPO} ${nextjsDirectory}`,
    {
      signal: abortController?.signal,
    }
  )

  await promiseExec(`mv .env.template .env.local`, {
    cwd: nextjsDirectory,
    signal: abortController?.signal,
  })

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
