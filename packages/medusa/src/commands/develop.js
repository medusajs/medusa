import { spawn, execSync } from "child_process"
import chokidar from "chokidar"

import Logger from "../loaders/logger"

export default async function({ port, directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  execSync("babel src -d dist", {
    cwd: directory,
    stdio: ["ignore", process.stdout, process.stderr],
  })

  const cliPath = "./node_modules/@medusajs/medusa/cli.js"
  let child = spawn(cliPath, [`start`, ...args], {
    cwd: directory,
    env: process.env,
    stdio: ["pipe", process.stdout, process.stderr],
  })

  chokidar.watch(`${directory}/src`).on("change", file => {
    const f = file.split("src")[1]
    Logger.info(`${f} changed: restarting...`)
    child.kill("SIGINT")

    execSync(`babel src -d dist`, {
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
