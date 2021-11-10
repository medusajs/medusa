import { Router } from "express"
import { Customer } from "../../../.."
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/customers", route)

  route.get("/", middlewares.wrap(require("./list-customers").default))
  route.get("/:id", middlewares.wrap(require("./get-customer").default))

  route.post("/", middlewares.wrap(require("./create-customer").default))
  route.post("/:id", middlewares.wrap(require("./update-customer").default))
  return app
}

export type AdminCustomerResponse = {
  customer: Customer
}

export * from "./create-customer"
export * from "./get-customer"
export * from "./list-customers"
export * from "./update-customer"
