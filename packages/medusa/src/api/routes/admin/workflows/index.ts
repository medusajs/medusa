import { Router } from "express"
import middlewares, { transformQuery } from "../../../middlewares"
import { AdminGetWorkflowsParams } from "./list"

const route = Router()

export default (app) => {
  app.use("/workflows", route)

  route.get(
    "/",
    transformQuery(AdminGetWorkflowsParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list").default)
  )

  route.get("/subscribe", middlewares.wrap(require("./subscribe").default))

  route.post("/:workflow_id", middlewares.wrap(require("./run").default))

  route.post(
    "/:workflow_id/:transaction_id/:step_id/success",
    middlewares.wrap(require("./mark-step-success").default)
  )

  route.post(
    "/:workflow_id/:transaction_id/:step_id/failure",
    middlewares.wrap(require("./mark-step-failure").default)
  )

  return route
}
