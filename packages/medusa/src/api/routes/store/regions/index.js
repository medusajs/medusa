import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/regions", route)

  route.get("/", middlewares.wrap(require("./list-regions").default))
  route.get("/:region_id", middlewares.wrap(require("./get-region").default))

  return app
}
