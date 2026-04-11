import { exec } from "child_process"
import fs from "fs"
import inquirer from "inquirer"
import path from "path"
import { displayFactBox, FactBoxOptions } from "./facts.js"
import { updatePackageVersions } from "./update-package-versions.js"
import PackageManager from "./package-manager.js"
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
  storefrontDirectory: string
  abortController?: AbortController
  factBoxOptions: FactBoxOptions
  verbose?: boolean
  packageManager: PackageManager
  version?: string
}

export async function installNextjsStarter({
  storefrontDirectory,
  factBoxOptions,
  packageManager,
  version,
}: InstallOptions): Promise<void> {
  factBoxOptions.interval = displayFactBox({
    ...factBoxOptions,
    title: "Setting up Next.js Starter Storefront...",
  })

  const packageJsonPath = path.join(storefrontDirectory, "package.json")
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

  const envTemplatePath = path.join(storefrontDirectory, ".env.template")
  if (fs.existsSync(envTemplatePath)) {
    fs.renameSync(envTemplatePath, path.join(storefrontDirectory, ".env.local"))
  }

  displayFactBox({
    ...factBoxOptions,
    message: `Next.js Starter Storefront is set up in the ${storefrontDirectory} directory.`,
  })
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
