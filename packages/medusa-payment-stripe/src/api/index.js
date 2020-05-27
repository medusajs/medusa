import { Router } from "express"
import hooks from "./routes/hooks"

export default (container) => {
  const app = Router()

  hooks(app)

  return app
}
