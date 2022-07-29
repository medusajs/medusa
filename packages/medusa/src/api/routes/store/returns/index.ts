import { Return } from "./../../../../models/return"
import { Router } from "express"

const route = Router()

export default (app) => {
  app.use("/returns", route)

  route.post("/", require("./create-return").default)

  return app
}

export type StoreReturnsRes = {
  return: Return
}

export * from "./create-return"
