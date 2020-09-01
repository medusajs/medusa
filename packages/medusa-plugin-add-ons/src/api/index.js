import { Router } from "express"
import store from "./routes/store"

export default (container) => {
  const app = Router()

  store(app)

  return app
}
