import { Router } from "express"
import admin from "./routes/admin"
import store from "./routes/store"
import users from "./routes/users"
import errorHandler from "./middlewares/error-handler"

// guaranteed to get dependencies
export default () => {
  const app = Router()

  users(app)
  admin(app)
  store(app)

  app.use(errorHandler())

  return app
}
