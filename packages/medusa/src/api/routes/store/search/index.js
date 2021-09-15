import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/search", route)

  route.post("/", middlewares.wrap(require("./search").default))

  return app
}
