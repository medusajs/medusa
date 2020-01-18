import "core-js/stable"
import "regenerator-runtime/runtime"
import express from "express"
import loaders from "./loaders"
import Logger from "./loaders/logger"
import { MedusaErrorTypes } from "./utils/errors"

const PORT = process.env.PORT || 80

const startServer = async () => {
  const app = express()

  await loaders({ expressApp: app })

  app.use((err, req, res, next) => {
    const logger = req.scope.resolve("logger")
    logger.error(err.message)

    let statusCode = 500
    switch (err.name) {
      case "ValidationError":
        statusCode = 400
        break
      case MedusaErrorTypes.INVALID_DATA:
        statusCode = 400
        break
      case MedusaErrorTypes.DB_ERROR:
        statusCode = 500
        break
      default:
        break
    }

    res.json(err).status(statusCode)
  })

  app.listen(PORT, err => {
    if (err) {
      console.log(err)
      return
    }
    Logger.info(`Server is ready on port: ${PORT}!`)
  })
}

startServer()
