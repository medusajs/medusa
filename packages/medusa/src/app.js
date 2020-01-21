import "core-js/stable"
import "regenerator-runtime/runtime"
import express from "express"
import loaders from "./loaders"
import Logger from "./loaders/logger"

const PORT = process.env.PORT || 80

const startServer = async () => {
  const app = express()

  await loaders({ expressApp: app })

  app.listen(PORT, err => {
    if (err) {
      console.log(err)
      return
    }
    Logger.info(`Server is ready on port: ${PORT}!`)
  })
}

startServer()
