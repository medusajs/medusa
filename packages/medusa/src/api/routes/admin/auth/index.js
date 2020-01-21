import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/auth", route)

  route.post("/", middlewares.wrap(require("./create-session").default))

  return app
}
