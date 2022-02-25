import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"
import { track } from "medusa-telemetry"

import loaders from "../loaders"
import Logger from "../loaders/logger"
import { getConfigFile } from "medusa-core-utils/dist"
import ExpressAdapter from "medusa-platform-express"

export default async function({ port, directory }) {
  async function start() {
    track("CLI_START")

    const { configModule } = getConfigFile(directory, 'medusa-config');

    let app;
    if (!configModule.projectConfig?.platform?.resolve) {
      app = new ExpressAdapter();
    } else {
      const Platform = await import(configModule.projectConfig.platform.resolve);
      app = new Platform();
    }

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
