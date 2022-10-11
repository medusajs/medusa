import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"
import { track } from "medusa-telemetry"
import { scheduleJob } from "node-schedule"

import loaders from "../loaders"
import Logger from "../loaders/logger"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR

export default async function ({ port, directory }) {
  async function start() {
    track("CLI_START")

    const app = express()

    const { dbConnection } = await loaders({ directory, expressApp: app })
    const serverActivity = Logger.activity(`Creating server`)
    const server = app.listen(port, (err) => {
      if (err) {
        return
      }
      Logger.success(serverActivity, `Server is ready on port: ${port}`)
      track("CLI_START_COMPLETED")
    })

    scheduleJob(CRON_SCHEDULE, () => {
      track("PING")
    })

    return { dbConnection, server }
  }

  const { dbConnection, server } = await start()
}
