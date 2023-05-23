import { Router } from "express"
import routes from "./routes"

export default function (rootDirectory: string): Router | Router[] {
  const app = Router()

  routes(app, rootDirectory)

  return app
}
