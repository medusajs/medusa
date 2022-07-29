import { Router } from "express"
import { Customer } from "./../../../.."
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/auth", route)

  route.get("/", middlewares.authenticate(), require("./get-session").default)
  route.get("/:email", require("./exists").default)
  route.delete("/", require("./delete-session").default)
  route.post("/", require("./create-session").default)

  return app
}

export type StoreAuthRes = {
  customer: Customer
}

export type StoreGetAuthEmailRes = {
  exists: boolean
}

export * from "./create-session"
export * from "./delete-session"
export * from "./exists"
export * from "./get-session"
