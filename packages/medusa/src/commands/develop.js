import path from "path"
import { execSync, fork } from "child_process"
import boxen from "boxen"
import chokidar from "chokidar"
import Store from "medusa-telemetry/dist/store"
import { EOL } from "os"

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

  const babelPath = path.join(directory, "node_modules", ".bin", "babel")

  execSync(`"${babelPath}" src -d dist`, {
    cwd: directory,
    stdio: ["ignore", process.stdout, process.stderr],
  })

  const cliPath = path.join(
    directory,
    "node_modules",
    "@medusajs",
    "medusa",
    "dist",
    "bin",
    "medusa.js"
  )
  let child = fork(cliPath, [`start`, ...args], {
    execArgv: argv,
    cwd: directory,
  })

  child.on("error", function (err) {
    console.log("Error ", err)
    process.exit(1)
  })

  chokidar.watch(`${directory}/src`).on("change", (file) => {
    const f = file.split("src")[1]
    Logger.info(`${f} changed: restarting...`)

    if (process.platform === "win32") {
      execSync(`taskkill /PID ${child.pid} /F /T`)
    }

    child.kill("SIGINT")

    execSync(`${babelPath} src -d dist --extensions ".ts,.js"`, {
      cwd: directory,
      stdio: ["pipe", process.stdout, process.stderr],
    })

    Logger.info("Rebuilt")

    child = fork(cliPath, [`start`, ...args], {
      execArgv: argv,
      cwd: directory,
    })

    child.on("error", function (err) {
      console.log("Error ", err)
      process.exit(1)
    })
  })
}
