import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/swaps", route)

  /**
   * List swaps
   */
  route.get("/", middlewares.wrap(require("./list-swaps").default))

  /**
   * Get a swap
   */
  route.get("/:id", middlewares.wrap(require("./get-swap").default))

  return app
}
