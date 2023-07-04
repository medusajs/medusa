import { Router } from "express"
import routes from "./routes"

export default (container) => {
  const app = Router()

  routes(app)

  return app
}
