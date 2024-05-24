import boxen from "boxen"
import { execSync, fork } from "child_process"
import chokidar from "chokidar"
import Store from "medusa-telemetry/dist/store"
import { EOL } from "os"
import path from "path"

import Logger from "../loaders/logger"

const defaultConfig = {
  padding: 5,
  borderColor: `blue`,
  borderStyle: `double`,
}

export default async function ({ port, directory }) {
  const args = process.argv
  const argv =
    process.argv.indexOf("--") !== -1
      ? process.argv.slice(process.argv.indexOf("--") + 1)
      : []
  args.shift()
  args.shift()
  args.shift()

  /**
   * Re-constructing the path to Medusa CLI to execute the
   * start command.
   */
  const cliPath = path.resolve(
    require.resolve("@medusajs/medusa-cli"),
    "..",
    "..",
    "cli.js"
  )

  const devServer = {
    childProcess: null,
    watcher: null,

    /**
     * Start the development server by forking a new process.
     *
     * We do not kill the parent process when child process dies. This is
     * because sometimes the dev server can die because of programming
     * or logical errors and we can still watch the file system and
     * restart the dev server instead of asking the user to re-run
     * the command.
     */
    start() {
      this.childProcess = fork(cliPath, ["start", ...args], {
        cwd: directory,
        env: {
          ...process.env,
          NODE_ENV: "development",
        },
        execArgv: argv,
      })
      this.childProcess.on("error", (error) => {
        Logger.error("Dev server failed to start", error)
        Logger.info("The server will restart automatically after your changes")
      })
    },

    /**
     * Restarts the development server by cleaning up the existing
     * child process and forking a new one
     */
    restart() {
      if (this.childProcess) {
        this.childProcess.removeAllListeners()
        if (process.platform === "win32") {
          execSync(`taskkill /PID ${this.childProcess.pid} /F /T`)
        }
        this.childProcess.kill("SIGINT")
      }
      this.start()
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
      this.watcher = chokidar.watch(["."], {
        ignoreInitial: true,
        cwd: process.cwd(),
        ignored: [/(^|[\\/\\])\../, "node_modules", "dist", "src/admin/**/*"],
      })

      this.watcher.on("add", (file) => {
        Logger.info(
          `${path.relative(directory, file)} created: Restarting dev server`
        )
        this.restart()
      })
      this.watcher.on("change", (file) => {
        Logger.info(
          `${path.relative(directory, file)} modified: Restarting dev server`
        )
        this.restart()
      })
      this.watcher.on("unlink", (file) => {
        Logger.info(
          `${path.relative(directory, file)} removed: Restarting dev server`
        )
        this.restart()
      })

      this.watcher.on("ready", function () {
        Logger.info(`Watching filesystem to reload dev server on file change`)
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

  devServer.start()
  devServer.watch()
}
