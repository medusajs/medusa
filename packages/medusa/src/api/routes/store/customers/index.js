import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")

  app.use("/customers", route)
  route.param("id", middlewares.wrap(require("./authorize-customer").default))

  // Inject plugin routes
  const routers = middlewareService.getRouters("store/customers")
  for (const router of routers) {
    route.use("/", router)
  }

  route.post("/", middlewares.wrap(require("./create-customer").default))

  route.post(
    "/password-reset",
    middlewares.wrap(require("./reset-password").default)
  )

  route.post(
    "/password-token",
    middlewares.wrap(require("./reset-password-token").default)
  )

  // Authenticated endpoints
  route.use(middlewares.authenticate())

  route.get("/:id", middlewares.wrap(require("./get-customer").default))
  route.post("/:id", middlewares.wrap(require("./update-customer").default))

  route.post(
    "/:id/addresses",
    middlewares.wrap(require("./create-address").default)
  )

  route.post(
    "/:id/addresses/:address_id",
    middlewares.wrap(require("./update-address").default)
  )

  route.delete(
    "/:id/addresses/:address_id",
    middlewares.wrap(require("./delete-address").default)
  )

  route.get(
    "/:id/payment-methods",
    middlewares.wrap(require("./get-payment-methods").default)
  )

  return app
}
