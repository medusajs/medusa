import { Router } from "express"
import "reflect-metadata"
import { Order, Return } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"

const route = Router()

export default (app) => {
  app.use("/returns", route)

  /**
   * List returns
   */
  route.get("/", require("./list-returns").default)

  route.post("/:id/receive", require("./receive-return").default)

  route.post("/:id/cancel", require("./cancel-return").default)

  return app
}

export type AdminReturnsCancelRes = {
  order: Order
}

export type AdminReturnsListRes = PaginatedResponse & {
  returns: Return[]
}

export type AdminReturnsRes = {
  return: Return
}

export * from "./list-returns"
export * from "./receive-return"
