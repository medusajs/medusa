import path from "path"
import execute, { VerboseOptions } from "./execute.js"
import logMessage from "./log-message.js"
import ProcessManager from "./process-manager.js"
import { existsSync, readFileSync, rmSync, writeFileSync } from "fs"
import { parse as parseYaml } from "yaml"

export type PackageManagerType = "npm" | "yarn" | "pnpm" | "nub"

type PackageManagerOptions = {
  verbose?: boolean
  useNpm?: boolean
  usePnpm?: boolean
  useYarn?: boolean
}

export default class PackageManager {
  protected packageManager?: PackageManagerType
  protected packageManagerVersion?: string
  protected processManager: ProcessManager
  protected verbose
  protected chosenPackageManager?: PackageManagerType

  constructor(
    processManager: ProcessManager,
    options: PackageManagerOptions = {}
  ) {
    this.processManager = processManager
    this.verbose = options.verbose || false

    if (options.useNpm) {
      this.chosenPackageManager = "npm"
    } else if (options.usePnpm) {
      this.chosenPackageManager = "pnpm"
    } else if (options.useYarn) {
      this.chosenPackageManager = "yarn"
    }
  }

  private detectFromUserAgent(): {
    manager: PackageManagerType
    version?: string
  } {
    const userAgent = process.env.npm_config_user_agent

    if (!userAgent) {
      return { manager: "npm" }
    }

    // Extract package manager and version (e.g., "yarn/4.9.0" -> ["yarn", "4.9.0"])
    const match = userAgent.match(/(pnpm|pnpx|yarn|npm|nub)\/(\d+\.\d+\.\d+)/)
    if (match) {
      const [, manager, version] = match

      if (this.verbose) {
        logMessage({
          type: "info",
          message: `Detected from user agent: ${manager}@${version}`,
        })
      }

      // pnpx is an alias for pnpm
      if (manager === "pnpx") {
        return { manager: "pnpm", version }
      }

      return { manager: manager as PackageManagerType, version }
    }

    // Fallback detection without version
    if (userAgent.includes("pnpm") || userAgent.includes("pnpx")) {
      return { manager: "pnpm" }
    }
    if (userAgent.includes("yarn")) {
      return { manager: "yarn" }
    }
    if (userAgent.includes("nub")) {
      return { manager: "nub" }
    }

    return { manager: "npm" }
  }

  private async getVersion(
    pm: PackageManagerType,
    execOptions: Record<string, unknown>
  ): Promise<string | undefined> {
    const commands: Record<PackageManagerType, string> = {
      yarn: "yarn -v",
      pnpm: "pnpm -v",
      npm: "npm -v",
      nub: "nub -v",
    }

    try {
      const result = await execute([commands[pm], execOptions], {
        verbose: false,
      })
      const version = result.stdout?.trim()
      if (this.verbose) {
        logMessage({
          type: "info",
          message: `Detected ${pm} version: ${version}`,
        })
      }
      return version
    } catch {
      if (this.verbose) {
        logMessage({
          type: "info",
          message: `Failed to get version for package manager: ${pm}`,
        })
      }
      return undefined
    }
  }

  async setPackageManager(execOptions: Record<string, unknown>): Promise<void> {
    if (this.packageManager) {
      return
    }

    // check whether package manager is available and get version
    await this.processManager.runProcess({
      process: async () => {
        if (this.chosenPackageManager) {
          const version = await this.getVersion(
            this.chosenPackageManager,
            execOptions
          )

          if (version) {
            this.packageManager = this.chosenPackageManager
            // Store version if we don't have it from user agent
            if (!this.packageManagerVersion) {
              this.packageManagerVersion = version
            }
            return
          }

          // Error logs exit the process, so command execution will stop here
          logMessage({
            type: "error",
            message: `The specified package manager "${this.chosenPackageManager}" is not available. Please install it or choose another package manager.`,
          })
        }

        const detectedResult = this.detectFromUserAgent()
        // fallback to npm if detection fails
        this.packageManager = detectedResult.manager || "npm"
        this.packageManagerVersion = detectedResult.version
        if (!this.packageManagerVersion) {
          // get version for the detected package manager (or npm fallback)
          this.packageManagerVersion = await this.getVersion(
            this.packageManager,
            execOptions
          )

          if (this.verbose) {
            logMessage({
              type: "info",
              message: `Falling back to ${this.packageManager} as the package manager.`,
            })
          }
        } else {
          if (this.verbose) {
            logMessage({
              type: "info",
              message: `Using detected package manager "${this.packageManager}".`,
            })
          }
        }
      },
      ignoreERESOLVE: true,
    })
  }

  private applyYarnWorkspaceChanges(directory: string): void {
    writeFileSync(path.join(directory, "yarn.lock"), "")
    writeFileSync(
      path.join(directory, ".yarnrc.yml"),
      "nodeLinker: node-modules\n"
    )
  }

  private applyNpmWorkspaceChanges(packageJson: Record<string, unknown>): void {
    // npm's flat hoisting can only keep a single ajv major at the workspace
    // root, but Medusa's stack needs two: the backend's migration tooling
    // (@mikro-orm/migrations -> umzug -> @rushstack/node-core-library ->
    // ajv-draft-04) does `require('ajv/dist/core')`, which only exists in ajv
    // v8+, while ESLint (`eslint` core and `@eslint/eslintrc`) needs ajv v6.
    // Both `ajv-draft-04` and `eslint` hoist to the root and resolve `ajv`
    // from there, so whichever major loses the root slot breaks. We pin v8 to
    // the root with a direct devDependency (this is what the hoisted
    // `ajv-draft-04` resolves against) and scope v6 back under ESLint via
    // overrides, which npm then nests. This lets both the backend
    // (`medusa db:migrate`/`build`) and the storefront (`next lint`) resolve a
    // compatible ajv from a single npm install.
    packageJson.devDependencies = {
      ...(packageJson.devDependencies as Record<string, unknown>),
      ajv: "^8.13.0",
    }
    packageJson.overrides = {
      ...(packageJson.overrides as Record<string, unknown>),
      eslint: {
        ...((packageJson.overrides as Record<string, any>)?.eslint ?? {}),
        ajv: "^6.12.4",
      },
      "@eslint/eslintrc": {
        ...((packageJson.overrides as Record<string, any>)?.[
          "@eslint/eslintrc"
        ] ?? {}),
        ajv: "^6.12.4",
      },
    }
  }

  async transformWorkspaceConfig(directory: string): Promise<void> {
    if (this.packageManager === "pnpm") {
      return
    }

    const workspaceYamlPath = path.join(directory, "pnpm-workspace.yaml")
    if (!existsSync(workspaceYamlPath)) {
      return
    }

    const yamlContent = readFileSync(workspaceYamlPath, "utf-8")
    const workspacePackages: string[] = parseYaml(yamlContent)?.packages ?? []

    const packageJsonPath = path.join(directory, "package.json")
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
    packageJson.workspaces = workspacePackages

    if (packageJson.scripts) {
      const pm = this.packageManager!
      packageJson.scripts = Object.fromEntries(
        Object.entries(packageJson.scripts as Record<string, string>).map(
          ([key, value]) => [
            key,
            value
              .replace(/\bpnpm\s+-r\s+(\S+)/g, "turbo $1")
              .replace(/\bpnpm\b/g, pm),
          ]
        )
      )
    }

    if (this.packageManager === "yarn") {
      this.applyYarnWorkspaceChanges(directory)
    } else if (this.packageManager === "npm") {
      this.applyNpmWorkspaceChanges(packageJson)
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    rmSync(workspaceYamlPath, { force: true })
  }

  async removeLockFiles(directory: string): Promise<void> {
    const lockFiles: Record<PackageManagerType, string[]> = {
      npm: ["yarn.lock", "pnpm-lock.yaml", ".yarn"],
      yarn: ["package-lock.json", "pnpm-lock.yaml"],
      pnpm: ["yarn.lock", "package-lock.json", ".yarn"],
      nub: ["yarn.lock", "package-lock.json", "pnpm-lock.yaml", ".yarn"],
    }

    if (!this.packageManager) {
      return
    }

    const filesToRemove = lockFiles[this.packageManager] || []
    for (const file of filesToRemove) {
      const filePath = path.join(directory, file)
      if (existsSync(filePath)) {
        rmSync(filePath, {
          force: true,
          recursive: true,
        })
      }
    }
  }

  async installDependencies(
    execOptions: Record<string, unknown>,
    installOptions?: {
      installLegacyPeerDeps?: boolean
    }
  ) {
    if (!this.packageManager) {
      await this.setPackageManager(execOptions)
    }

    if (execOptions.cwd && typeof execOptions.cwd === "string") {
      await this.transformWorkspaceConfig(execOptions.cwd)
      await this.removeLockFiles(execOptions.cwd)
    }

    const commands: Record<PackageManagerType, string> = {
      yarn: "yarn",
      pnpm: "pnpm install",
      npm: `npm install${
        installOptions?.installLegacyPeerDeps ? " --legacy-peer-deps" : ""
      }`,
      nub: "nub install",
    }

    const command = commands[this.packageManager || "npm"]

    await this.processManager.runProcess({
      process: async () => {
        try {
          await execute([command, execOptions], {
            verbose: this.verbose,
          })
        } catch (error) {
          const errorStr =
            typeof error === "string"
              ? error
              : (error as any)?.stderr ||
                (error as any)?.message ||
                String(error)
          const packageManagerConflictMatch = errorStr.match(
            /This project is configured to use (\w+) because (.+) has a "packageManager" field/
          )
          if (this.packageManager === "pnpm" && packageManagerConflictMatch) {
            const conflictingFile = packageManagerConflictMatch[2]
            throw new Error(
              `Cannot install with pnpm because ${conflictingFile} has a "packageManager" field that specifies a different package manager. Consider removing that field from ${conflictingFile}, or create your Medusa project in a different directory.`
            )
          }
          throw error
        }

        // For npm, run npm ci after npm install to validate installation
        if (this.packageManager === "npm") {
          try {
            await execute(["npm ci", execOptions], {
              verbose: this.verbose,
            })
          } catch (error) {
            // If npm ci fails, re-run npm install
            if (this.verbose) {
              logMessage({
                type: "info",
                message: "npm ci validation failed, re-running npm install...",
              })
            }
            await execute(["npm install", execOptions], {
              verbose: this.verbose,
            })
          }
        }
      },
      ignoreERESOLVE: true,
    })
  }

  async runCommand(
    command: string,
    execOptions: Record<string, unknown>,
    verboseOptions: VerboseOptions = {}
  ) {
    if (!this.packageManager) {
      await this.setPackageManager(execOptions)
    }

    const commandStr = this.getCommandStr(command)

    return await this.processManager.runProcess({
      process: async () => {
        return await execute([commandStr, execOptions], {
          verbose: this.verbose,
          ...verboseOptions,
        })
      },
      ignoreERESOLVE: true,
    })
  }

  async runMedusaCommand(
    command: string,
    execOptions: Record<string, unknown>,
    verboseOptions: VerboseOptions = {}
  ) {
    if (!this.packageManager) {
      await this.setPackageManager(execOptions)
    }

    const formats: Record<PackageManagerType, string> = {
      yarn: `yarn medusa ${command}`,
      pnpm: `pnpm medusa ${command}`,
      npm: `npx medusa ${command}`,
      nub: `nubx medusa ${command}`,
    }

    const commandStr = formats[this.packageManager || "npm"]

    return await this.processManager.runProcess({
      process: async () => {
        return await execute([commandStr, execOptions], {
          verbose: this.verbose,
          ...verboseOptions,
        })
      },
      ignoreERESOLVE: true,
    })
  }

  getCommandStr(command: string): string {
    if (!this.packageManager) {
      throw new Error("Package manager not set")
    }

    const formats: Record<PackageManagerType, string> = {
      yarn: `yarn ${command}`,
      pnpm: `pnpm ${command}`,
      npm: `npm run ${command}`,
      nub: `nub run ${command}`,
    }

    return formats[this.packageManager]
  }

  getPackageManager(): PackageManagerType | undefined {
    return this.packageManager
  }

  async getPackageManagerString(): Promise<string | undefined> {
    if (!this.packageManager) {
      await this.setPackageManager({})
    }
    if (!this.packageManagerVersion) {
      if (this.verbose) {
        logMessage({
          type: "info",
          message: `No version detected for package manager: ${this.packageManager}`,
        })
      }
      return undefined
    }
    const result = `${this.packageManager}@${this.packageManagerVersion}`
    if (this.verbose) {
      logMessage({
        type: "info",
        message: `Package manager string: ${result}`,
      })
    }
    return result
  }
}
