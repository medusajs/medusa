import { Router } from "express"
import store from "./routes/store"
import admin from "./routes/admin"

export default (container) => {
  const app = Router()

  store(app)
  admin(app)

  return app
}
