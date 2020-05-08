import "core-js/stable"
import "regenerator-runtime/runtime"

import mongoose from "mongoose"
import chokidar from "chokidar"
import express from "express"
import cwdResolve from "resolve-cwd"

import loaders from "../loaders"
import Logger from "../loaders/logger"

export default async function({ port, directory }) {
  async function start() {
    const app = express()

    const { dbConnection } = await loaders({ directory, expressApp: app })
    const server = app.listen(port, err => {
      if (err) {
        return
      }
      Logger.info(`Server is ready on port: ${port}!`)
    })

    return { dbConnection, server }
  }

  let { dbConnection, server } = await start()
}
