import { track } from "@medusajs/telemetry"
import boxen from "boxen"
import chalk from "chalk"
import { emojify } from "node-emoji"
import open from "open"
import { EOL } from "os"
import slugifyType from "slugify"
import waitOn from "wait-on"
import { runCloneRepo } from "../clone-repo.js"
import { isAbortError } from "../create-abort-controller.js"
import { getDbClientAndCredentials, runCreateDb } from "../create-db.js"
import { displayFactBox } from "../facts.js"
import logMessage from "../log-message.js"
import {
  askForNextjsStarter,
  installNextjsStarter,
  startNextjsStarter,
} from "../nextjs-utils.js"
import prepareProject from "../prepare-project.js"
import startMedusa from "../start-medusa.js"
import {
  BaseProjectCreator,
  ProjectCreator,
  ProjectOptions,
} from "./creator.js"
import terminalLink from "terminal-link"

const slugify = slugifyType.default

// Medusa Project Creator
export class MedusaProjectCreator
  extends BaseProjectCreator
  implements ProjectCreator
{
  private client: any = null
  private dbConnectionString: string = ""
  private isDbInitialized: boolean = false
  private nextjsDirectory: string = ""
  private inviteToken?: string

  constructor(projectName: string, options: ProjectOptions, args: string[]) {
    super(projectName, options, args)
    this.setupProcessManager()
  }

  async create(): Promise<void> {
    track("CREATE_CLI_CMA")

    try {
      await this.initializeProject()
      await this.setupProject()
      await this.startServices()
    } catch (e: any) {
      this.handleError(e)
    }
  }

  private async initializeProject(): Promise<void> {
    const installNextjs =
      this.options.withNextjsStarter || (await askForNextjsStarter())

    if (!this.options.skipDb) {
      await this.setupDatabase()
    }

    logMessage({
      message: `${emojify(
        ":rocket:"
      )} Starting project setup, this may take a few minutes.`,
    })

    this.spinner.start()

    this.factBoxOptions.interval = displayFactBox({
      ...this.factBoxOptions,
      title: "Setting up project...",
    })

    await runCloneRepo({
      projectName: this.projectPath,
      repoUrl: this.options.repoUrl ?? "",
      abortController: this.abortController,
      spinner: this.spinner,
      verbose: this.options.verbose,
    })

    this.factBoxOptions.interval = displayFactBox({
      ...this.factBoxOptions,
      message: "Created project directory",
    })

    if (installNextjs) {
      this.nextjsDirectory = await installNextjsStarter({
        directoryName: this.projectPath,
        abortController: this.abortController,
        factBoxOptions: this.factBoxOptions,
        verbose: this.options.verbose,
        packageManager: this.packageManager,
        version: this.options.version,
      })
    }
  }

  private async setupDatabase(): Promise<void> {
    let dbName = `medusa-${slugify(this.projectName)}`
    const { client, dbConnectionString, ...rest } =
      await getDbClientAndCredentials({
        dbName,
        dbUrl: this.options.dbUrl,
        verbose: this.options.verbose,
      })

    this.client = client
    this.dbConnectionString = dbConnectionString
    this.isDbInitialized = true
    dbName = rest.dbName || dbName

    if (!this.options.dbUrl) {
      this.factBoxOptions.interval = displayFactBox({
        ...this.factBoxOptions,
        message: "Creating database...",
      })

      this.client = await runCreateDb({
        client: this.client,
        dbName,
        spinner: this.spinner,
      })

      this.factBoxOptions.interval = displayFactBox({
        ...this.factBoxOptions,
        message: `Database ${dbName} created`,
      })
    }
  }

  private async setupProject(): Promise<void> {
    try {
      this.inviteToken = await prepareProject({
        isPlugin: false,
        projectName: this.projectName,
        directory: this.projectPath,
        dbConnectionString: this.dbConnectionString,
        seed: this.options.seed,
        spinner: this.spinner,
        processManager: this.processManager,
        abortController: this.abortController,
        skipDb: this.options.skipDb,
        migrations: this.options.migrations,
        onboardingType: this.nextjsDirectory ? "nextjs" : "default",
        nextjsDirectory: this.nextjsDirectory,
        client: this.client,
        verbose: this.options.verbose,
        packageManager: this.packageManager,
        version: this.options.version,
      })
    } finally {
      await this.client?.end()
    }

    this.spinner.succeed(chalk.green("Project Prepared"))
  }

  private async startServices(): Promise<void> {
    if (this.options.skipDb || !this.options.browser) {
      this.showSuccessMessage()
      process.exit()
    }

    logMessage({
      message: "Starting Medusa...",
    })

    startMedusa({
      directory: this.projectPath,
      abortController: this.abortController,
      packageManager: this.packageManager,
    })

    if (this.nextjsDirectory) {
      startNextjsStarter({
        directory: this.nextjsDirectory,
        abortController: this.abortController,
        verbose: this.options.verbose,
        packageManager: this.packageManager,
      })
    }

    this.isProjectCreated = true

    await this.openBrowser()
  }

  private async openBrowser(): Promise<void> {
    await waitOn({
      resources: ["http://localhost:9000/health"],
    }).then(async () =>
      open(
        this.inviteToken
          ? `http://localhost:9000/app/invite?token=${this.inviteToken}&first_run=true`
          : "http://localhost:9000/app"
      )
    )
  }

  private handleError(e: Error): void {
    if (isAbortError(e)) {
      process.exit()
    }

    const showStack = e.message.includes("npm") || e.message.includes("yarn")

    this.spinner.stop()
    logMessage({
      message: `An error occurred: ${e}`,
      type: "error",
      stack: showStack ? e.stack?.replace(e.toString(), "") : "",
    })
  }

  protected showSuccessMessage(): void {
    const commandStr = this.packageManager.getCommandStr(`dev`)
    logMessage({
      message: boxen(
        chalk.green(
          `Change to the \`${
            this.projectName
          }\` directory to explore your Medusa project.${EOL}${EOL}Start your Medusa application again with the following command:${EOL}${EOL}${commandStr}${EOL}${EOL}${
            this.inviteToken
              ? `After you start the Medusa application, you can create an admin user with the URL http://localhost:9000/app/invite?token=${this.inviteToken}&first_run=true${EOL}${EOL}`
              : ""
          }${
            this.nextjsDirectory?.length
              ? `The Next.js Starter Storefront was installed in the \`${this.nextjsDirectory}\` directory. Change to that directory and start it with the following command:${EOL}${EOL}${commandStr}${EOL}${EOL}`
              : ""
          }Check out the Medusa ${terminalLink(
            "documentation",
            "https://docs.medusajs.com/"
          )} to start your development:${EOL}${EOL}Star us on ${terminalLink(
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

      // prevent an error from occurring if
      // client hasn't been declared yet
      if (this.isDbInitialized && this.client) {
        await this.client.end()
      }

      if (!this.printedMessage && this.isProjectCreated) {
        this.printedMessage = true
        this.showSuccessMessage()
      }
      return
    })
  }
}
