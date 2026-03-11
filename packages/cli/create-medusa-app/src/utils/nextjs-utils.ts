import { exec } from "child_process"
import fs from "fs"
import inquirer from "inquirer"
import { customAlphabet } from "nanoid"
import path from "path"
import { isAbortError } from "./create-abort-controller.js"
import execute from "./execute.js"
import { displayFactBox, FactBoxOptions } from "./facts.js"
import logMessage from "./log-message.js"
import { updatePackageVersions } from "./update-package-versions.js"
import PackageManager from "./package-manager.js"

const NEXTJS_REPO = "https://github.com/medusajs/nextjs-starter-medusa"
const NEXTJS_BRANCH = "main"

export async function askForNextjsStarter(): Promise<boolean> {
  const { installNextjs } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installNextjs",
      message: `Would you like to install the Next.js Starter Storefront? You can also install it later.`,
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
  packageManager: PackageManager
  version?: string
}

export async function installNextjsStarter({
  directoryName,
  abortController,
  factBoxOptions,
  verbose = false,
  packageManager,
  version,
}: InstallOptions): Promise<string> {
  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Installing Next.js Starter Storefront...",
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
    await execute(
      [
        `git clone ${NEXTJS_REPO} -b ${NEXTJS_BRANCH} ${nextjsDirectory} --depth 1`,
        {
          signal: abortController?.signal,
          env: process.env,
        },
      ],
      { verbose }
    )

    const packageJsonPath = path.join(nextjsDirectory, "package.json")
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

    if (version) {
      packageJson = updatePackageVersions(packageJsonPath, version, {
        applyChanges: false,
      })
    }

    // Update packageManager field to match user's chosen package manager
    const packageManagerString = await packageManager.getPackageManagerString()
    if (packageManagerString) {
      packageJson.packageManager = packageManagerString
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    const execOptions = {
      signal: abortController?.signal,
      cwd: nextjsDirectory,
    }
    await packageManager.installDependencies(execOptions)
  } catch (e) {
    if (isAbortError(e)) {
      process.exit()
    }

    logMessage({
      message: `An error occurred while installing Next.js Starter Storefront: ${e}`,
      type: "error",
    })
  }

  fs.rmSync(path.join(nextjsDirectory, ".git"), {
    recursive: true,
    force: true,
  })

  fs.renameSync(
    path.join(nextjsDirectory, ".env.template"),
    path.join(nextjsDirectory, ".env.local")
  )

  displayFactBox({
    ...factBoxOptions,
    message: `Installed Next.js Starter Storefront successfully in the ${nextjsDirectory} directory.`,
  })

  return nextjsDirectory
}

type StartOptions = {
  directory: string
  abortController?: AbortController
  verbose?: boolean
  packageManager: PackageManager
}

export function startNextjsStarter({
  directory,
  abortController,
  verbose = false,
  packageManager,
}: StartOptions) {
  const command = packageManager.getCommandStr(`dev`)
  const childProcess = exec(command, {
    cwd: directory,
    signal: abortController?.signal,
  })

  if (verbose) {
    childProcess.stdout?.pipe(process.stdout)
    childProcess.stderr?.pipe(process.stderr)
  }
}
