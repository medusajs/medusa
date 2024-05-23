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

  // Force NODE_ENV to development
  process.env.NODE_ENV = "development"

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

  /**
   * Environment variable to indicate that the `start` command was initiated by the `develop`.
   * Used to determine if Admin should build if it is installed and has `autoBuild` enabled.
   */
  const COMMAND_INITIATED_BY = {
    COMMAND_INITIATED_BY: "develop",
  }

  const cliPath = path.resolve(
    require.resolve("@medusajs/medusa-cli"),
    "..",
    "..",
    "cli.js"
  )

  const start = () => {
    const child = fork(`${cliPath}`, [`start`, ...args], {
      execArgv: argv,
      cwd: directory,
      env: { ...process.env, ...COMMAND_INITIATED_BY },
    })

    child.on("error", function (err) {
      console.log("Error ", err)
      process.exit(1)
    })

    return child
  }

  let child = start()

  chokidar
    .watch(`${directory}/src`, {
      ignored: `${directory}/src/admin`,
    })
    .on("change", (file) => {
      const f = file.split("src")[1]
      Logger.info(`${f} changed: restarting...`)

      if (process.platform === "win32") {
        execSync(`taskkill /PID ${child.pid} /F /T`)
      }

      child.kill("SIGINT")

      child = start()
    })
}
