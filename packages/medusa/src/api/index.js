import { Router } from "express"
import admin from "./routes/admin"
import store from "./routes/store"
import errorHandler from "./middlewares/error-handler"

// guaranteed to get dependencies
export default (container, config) => {
  const app = Router()

  admin(app, container, config)
  store(app, container, config)

  app.use(errorHandler())

  return app
}
