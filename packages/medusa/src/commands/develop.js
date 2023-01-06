import { EOL } from "os"
import boxen from "boxen"
import path from "path"
import { execSync } from "child_process"
import spawn from "cross-spawn"
import chokidar from "chokidar"
import Store from "medusa-telemetry/dist/store"

import Logger from "../loaders/logger"

const defaultConfig = {
  padding: 5,
  borderColor: `blue`,
  borderStyle: `double`,
}

export default async function ({ port, directory }) {
  const args = process.argv
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

  const cliPath = path.join(directory, "node_modules", ".bin", "medusa")
  let child = spawn(cliPath, [`start`, ...args], {
    cwd: directory,
    env: process.env,
    stdio: ["pipe", process.stdout, process.stderr],
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

    child = spawn(cliPath, [`start`, ...args], {
      cwd: directory,
      env: process.env,
      stdio: ["pipe", process.stdout, process.stderr],
    })
  })
}
