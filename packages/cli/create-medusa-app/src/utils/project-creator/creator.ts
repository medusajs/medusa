import ora, { Ora } from "ora"
import path from "path"
import createAbortController from "../create-abort-controller.js"
import { FactBoxOptions } from "../facts.js"
import ProcessManager from "../process-manager.js"
import PackageManager from "../package-manager.js"

export interface ProjectOptions {
  repoUrl?: string
  seed?: boolean
  skipDb?: boolean
  dbUrl?: string
  browser?: boolean
  migrations?: boolean
  directoryPath?: string
  withNextjsStarter?: boolean
  verbose?: boolean
  plugin?: boolean
  version?: string
  useNpm?: boolean
  usePnpm?: boolean
  useYarn?: boolean
}

export interface ProjectCreator {
  create(): Promise<void>
}

// Base class for common project functionality
export abstract class BaseProjectCreator {
  protected spinner: Ora
  protected processManager: ProcessManager
  protected packageManager: PackageManager
  protected abortController: AbortController
  protected factBoxOptions: FactBoxOptions
  protected projectName: string
  protected projectPath: string
  protected isProjectCreated: boolean = false
  protected printedMessage: boolean = false

  constructor(
    projectName: string,
    protected options: ProjectOptions,
    protected args: string[]
  ) {
    this.spinner = ora()
    this.processManager = new ProcessManager()
    this.packageManager = new PackageManager(this.processManager, {
      verbose: options.verbose,
      useNpm: options.useNpm,
      usePnpm: options.usePnpm,
      useYarn: options.useYarn,
    })
    this.abortController = createAbortController(this.processManager)
    this.projectName = projectName
    const basePath =
      typeof options.directoryPath === "string" ? options.directoryPath : ""
    this.projectPath = path.join(basePath, projectName)

    this.factBoxOptions = {
      interval: null,
      spinner: this.spinner,
      processManager: this.processManager,
      message: "",
      title: "",
      verbose: options.verbose || false,
    }
  }

  protected getProjectPath(projectName: string): string {
    return path.join(this.options.directoryPath ?? "", projectName)
  }

  protected abstract showSuccessMessage(): void

  protected abstract setupProcessManager(): void
}
