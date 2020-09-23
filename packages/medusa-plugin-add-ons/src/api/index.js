import { Router } from "express"
import admin from "./routes/admin"
import store from "./routes/store"

export default (rootDirectory) => {
  const app = Router()

  store(app, rootDirectory)
  admin(app, rootDirectory)

  return app
}
