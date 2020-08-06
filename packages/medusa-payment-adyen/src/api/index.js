import { Router } from "express"
import store from "./routes/store"
import hooks from "./routes/hooks"

export default (rootDirectory) => {
  const app = Router()
  store(app, rootDirectory)
  hooks(app, rootDirectory)
  return app
}
