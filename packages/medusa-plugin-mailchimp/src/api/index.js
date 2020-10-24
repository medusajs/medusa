import { Router } from "express"
import routes from "./routes"

export default (rootDirectory) => {
  const app = Router()

  routes(app, rootDirectory)

  return app
}
