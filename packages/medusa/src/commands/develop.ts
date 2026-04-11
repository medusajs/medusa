import { MEDUSA_CLI_PATH } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
} from "@medusajs/framework/utils"
import { Store } from "@medusajs/telemetry"
import boxen from "boxen"
import { ChildProcess, execSync, fork } from "child_process"
import chokidar, { FSWatcher } from "chokidar"
import { EOL } from "os"
import path from "path"
import BackendHmrFeatureFlag from "../feature-flags/backend-hmr"
import { initializeContainer } from "../loaders"

const defaultConfig = {
  padding: 5,
  borderColor: `blue`,
  borderStyle: `double`,
} as boxen.Options

export default async function ({ types, directory }) {
  const container = await initializeContainer(directory)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const isBackendHmrEnabled = FeatureFlag.isFeatureEnabled(
    BackendHmrFeatureFlag.key
  )

  const reloadActionVerb = isBackendHmrEnabled ? "reloading" : "restarting"
  const logSource = isBackendHmrEnabled ? "[HMR]" : "[Watcher]"

  if (isBackendHmrEnabled) {
    logger.info(
      `${logSource} Using backend HMR dev server (reload on file change)`
    )
  } else {
    logger.info(
      `${logSource} Using standard dev server (restart on file change)`
    )
  }

  const args = process.argv

  const argv =
    process.argv.indexOf("--") !== -1
      ? process.argv.slice(process.argv.indexOf("--") + 1)
      : []

  args.shift()
  args.shift()
  args.shift()

  if (types) {
    args.push("--types")
  }

  /**
   * Re-constructing the path to Medusa CLI to execute the
   * start command.
   */

  const cliPath = path.resolve(MEDUSA_CLI_PATH, "..", "..", "cli.js")

  const devServer = {
    childProcess: null as ChildProcess | null,
    watcher: null as FSWatcher | null,

    /**
     * Start the development server by forking a new process.
     *
     * We do not kill the parent process when child process dies. This is
     * because sometimes the dev server can die because of programming
     * or logical errors and we can still watch the file system and
     * restart the dev server instead of asking the user to re-run
     * the command.
     */
    async start() {
      const forkOptions: any = {
        cwd: directory,
        env: {
          ...process.env,
          NODE_ENV: "development",
          ...(isBackendHmrEnabled && { MEDUSA_HMR_ENABLED: "true" }),
        },
        execArgv: argv,
      }

      // Enable IPC for HMR mode to communicate reload requests
      if (isBackendHmrEnabled) {
        forkOptions.stdio = ["inherit", "inherit", "inherit", "ipc"]
      }

      this.childProcess = fork(cliPath, ["start", ...args], forkOptions)

      this.childProcess.on("error", (error) => {
        // @ts-ignore
        logger.error(`${logSource} Dev server failed to start`, error)
        logger.info(
          `${logSource} The server will restart automatically after your changes`
        )
      })
    },

    /**
     * Sends an HMR reload request to the child process and waits for result.
     * Returns true if reload succeeded, false if it failed.
     */
    async sendHmrReload(
      action: "add" | "change" | "unlink",
      file: string
    ): Promise<boolean> {
      return new Promise((resolve) => {
        if (!this.childProcess) {
          resolve(false)
          return
        }

        const timeout = setTimeout(() => {
          resolve(false)
        }, 30000) // 30s timeout

        const messageHandler = (msg: any) => {
          if (msg?.type === "hmr-result") {
            clearTimeout(timeout)
            this.childProcess?.off("message", messageHandler)
            resolve(msg.success === true)
          }
        }

        this.childProcess.on("message", messageHandler)
        this.childProcess.send({
          type: "hmr-reload",
          action,
          file: path.resolve(directory, file),
          rootDirectory: directory,
        })
      })
    },

    /**
     * Restarts the development server by cleaning up the existing
     * child process and forking a new one
     */
    async restart(action: "add" | "change" | "unlink", file: string) {
      if (isBackendHmrEnabled && this.childProcess) {
        const success = await this.sendHmrReload(action, file)

        if (success) {
          return
        }

        // HMR reload failed, kill the process and restart
        logger.info(`${logSource} HMR reload failed, restarting server...`)
      }

      if (this.childProcess) {
        this.childProcess.removeAllListeners()
        if (process.platform === "win32") {
          execSync(`taskkill /PID ${this.childProcess.pid} /F /T`)
        } else {
          this.childProcess.kill("SIGINT")
        }
      }
      await this.start()
    },

    /**
     * Watches the entire file system and ignores the following files
     *
     * - Dot files
     * - node_modules
     * - dist
     * - src/admin/**
     */
    watch() {
      this.watcher = chokidar.watch(".", {
        ignoreInitial: true,
        cwd: directory,
        ignored: [
          /(^|[\\/\\])\../,
          "node_modules",
          "dist",
          "static",
          "private",
          "src/admin",
          ".medusa",
        ],
      })

      async function handleFileChange(
        this: typeof devServer,
        action: "add" | "change" | "unlink",
        file: string
      ) {
        const actionVerb =
          action === "add"
            ? "created"
            : action === "change"
            ? "modified"
            : "removed"

        const now = performance.now()
        logger.info(
          `${logSource} ${actionVerb} ${path.relative(
            directory,
            file
          )} ${actionVerb}: ${reloadActionVerb} dev server`
        )

        await this.restart(action, file)

        const duration = performance.now() - now
        logger.info(`${logSource} Reloaded in ${duration.toFixed(2)}ms`)
      }

      this.watcher.on("add", async (file) => {
        handleFileChange.call(this, "add", file)
      })
      this.watcher.on("change", async (file) => {
        handleFileChange.call(this, "change", file)
      })
      this.watcher.on("unlink", async (file) => {
        handleFileChange.call(this, "unlink", file)
      })

      this.watcher.on("ready", function () {
        logger.info(
          `${logSource} Watching filesystem to reload dev server on file change`
        )
      })
    },
  }

  process.on("SIGINT", () => {
    const configStore = new Store()
    const hasPrompted = configStore.getConfig("star.prompted") ?? false
    if (!hasPrompted) {
      const defaultMessage =
        `✨ Thanks for using Medusa. ✨${EOL}${EOL}` +
        `If you liked it, please consider starring us on GitHub${EOL}` +
        `https://medusajs.com/star${EOL}` +
        `${EOL}` +
        `Note: you will not see this message again.`

      console.log()
      console.log(boxen(defaultMessage, defaultConfig))

      configStore.setConfig("star.prompted", true)
    }
    process.exit(0)
  })

  await devServer.start()
  devServer.watch()
}
