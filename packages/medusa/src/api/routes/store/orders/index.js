import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/orders", route)

  route.get("/:id", middlewares.wrap(require("./get-order").default))

  route.post("/", middlewares.wrap(require("./create-order").default))

  return app
}
