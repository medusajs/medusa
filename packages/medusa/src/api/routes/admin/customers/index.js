import { Router } from "express"
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

export const defaultRelations = [
  "shipping_addresses",
  "billing_address",
  "orders",
]

export const defaultFields = [
  "id",
  "email",
  "first_name",
  "last_name",
  "billing_address_id",
  "phone",
  "has_account",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const allowedRelations = [
  "shipping_addresses",
  "billing_address",
  "orders",
]

export const allowedFields = [
  "id",
  "email",
  "first_name",
  "last_name",
  "billing_address_id",
  "phone",
  "has_account",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]
