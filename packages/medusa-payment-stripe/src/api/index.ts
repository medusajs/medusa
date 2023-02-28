import { Router } from "express"
import hooks from "./hooks"

export default (container) => {
  const app = Router()

  hooks(app)

  return app
}
