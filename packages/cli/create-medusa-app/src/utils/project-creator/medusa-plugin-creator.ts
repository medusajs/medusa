import { note, outro } from "@clack/prompts"
import { track } from "@medusajs/telemetry"
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
import { promptClaudeCodePlugin } from "../claude-code-plugin.js"

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
    await promptClaudeCodePlugin()

    logMessage({
      message: "Starting plugin setup, this may take a few minutes.",
    })

    displayFactBox({
      ...this.factBoxOptions,
      title: "Setting up plugin",
    })

    try {
      await this.cloneAndPreparePlugin()
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

    displayFactBox({
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
    note(
      `Change to the \`${this.projectName}\` directory to explore your Medusa plugin.`,
      "Next steps"
    )
    outro(
      `Check out the ${terminalLink(
        "Medusa plugin documentation",
        "https://docs.medusajs.com/learn/fundamentals/plugins"
      )} to start your development. Star us on ${terminalLink(
        "GitHub",
        "https://github.com/medusajs/medusa/stargazers"
      )} if you like what we're building.`
    )
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
