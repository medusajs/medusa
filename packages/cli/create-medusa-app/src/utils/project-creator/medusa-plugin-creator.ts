import { track } from "@medusajs/telemetry"
import boxen from "boxen"
import chalk from "chalk"
import { emojify } from "node-emoji"
import { EOL } from "os"
import { runCloneRepo } from "../clone-repo.js"
import { isAbortError } from "../create-abort-controller.js"
import { displayFactBox } from "../facts.js"
import logMessage from "../log-message.js"
import prepareProject from "../prepare-project.js"
import {
  BaseProjectCreator,
  ProjectCreator,
  ProjectOptions,
} from "./creator.js"
import terminalLink from "terminal-link"

// Plugin Project Creator
export class PluginProjectCreator
  extends BaseProjectCreator
  implements ProjectCreator
{
  constructor(projectName: string, options: ProjectOptions, args: string[]) {
    super(projectName, options, args)
    this.setupProcessManager()
  }

  async create(): Promise<void> {
    track("CREATE_CLI_CMP")

    logMessage({
      message: `${emojify(
        ":rocket:"
      )} Starting plugin setup, this may take a few minutes.`,
    })

    this.spinner.start()
    this.factBoxOptions.interval = displayFactBox({
      ...this.factBoxOptions,
      title: "Setting up plugin...",
    })

    try {
      await this.cloneAndPreparePlugin()
      this.spinner.succeed(chalk.green("Plugin Prepared"))
      this.showSuccessMessage()
    } catch (e: any) {
      this.handleError(e)
    }
  }

  private async cloneAndPreparePlugin(): Promise<void> {
    await runCloneRepo({
      projectName: this.projectPath,
      repoUrl: this.options.repoUrl ?? "",
      abortController: this.abortController,
      spinner: this.spinner,
      verbose: this.options.verbose,
      isPlugin: true,
    })

    this.factBoxOptions.interval = displayFactBox({
      ...this.factBoxOptions,
      message: "Created plugin directory",
    })

    await prepareProject({
      isPlugin: true,
      directory: this.projectPath,
      projectName: this.projectName,
      spinner: this.spinner,
      processManager: this.processManager,
      abortController: this.abortController,
      verbose: this.options.verbose,
      packageManager: this.packageManager,
    })
  }

  private handleError(e: any): void {
    if (isAbortError(e)) {
      process.exit()
    }

    this.spinner.stop()
    logMessage({
      message: `An error occurred while preparing plugin: ${e}`,
      type: "error",
    })
  }

  protected showSuccessMessage(): void {
    logMessage({
      message: boxen(
        chalk.green(
          `Change to the \`${
            this.projectName
          }\` directory to explore your Medusa plugin.${EOL}${EOL}Check out the ${terminalLink(
            "Medusa plugin documentation",
            "https://docs.medusajs.com/learn/fundamentals/plugins"
          )} to start your development.${EOL}${EOL}Star us on ${terminalLink(
            "GitHub",
            "https://github.com/medusajs/medusa/stargazers"
          )} if you like what we're building.`
        ),
        {
          titleAlignment: "center",
          textAlignment: "center",
          padding: 1,
          margin: 1,
          float: "center",
        }
      ),
    })
  }

  protected setupProcessManager(): void {
    this.processManager.onTerminated(async () => {
      this.spinner.stop()

      if (!this.printedMessage && this.isProjectCreated) {
        this.printedMessage = true
        this.showSuccessMessage()
      }
      return
    })
  }
}
