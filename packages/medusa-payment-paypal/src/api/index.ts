import { Router } from "express"
import hooks from "./routes/hooks"

export default () => {
  const app = Router()

  hooks(app)

  return app
}
