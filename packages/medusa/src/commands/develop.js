import "core-js/stable"
import "regenerator-runtime/runtime"
import express from "express"
import loaders from "../loaders"
import Logger from "../loaders/logger"

export default async function({ port, directory }) {
  const app = express()

  await loaders({ directory, expressApp: app })

  app.listen(port, err => {
    if (err) {
      console.log(err)
      return
    }
    Logger.info(`Server is ready on port: ${port}!`)
  })
}
