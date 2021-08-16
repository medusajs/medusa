import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"
import { track } from "medusa-telemetry"

import loaders from "../loaders"
import Logger from "../loaders/logger"

export default async function({ port, directory }) {
  async function start() {
    track("CLI_START")

    const app = express()

    const { dbConnection } = await loaders({ directory, expressApp: app })
    const serverActivity = Logger.activity(`Creating server`)
    const server = app.listen(port, err => {
      if (err) {
        return
      }
      Logger.success(serverActivity, `Server is ready on port: ${port}`)
      track("CLI_START_COMPLETED")
    })

    return { dbConnection, server }
  }

  let { dbConnection, server } = await start()
}
