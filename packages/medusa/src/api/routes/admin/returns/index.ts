import { Router } from "express"
import "reflect-metadata"
import { Order, Return } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/returns", route)

  /**
   * List returns
   */
  route.get("/", middlewares.wrap(require("./list-returns").default))

  route.post(
    "/:id/receive",
    middlewares.wrap(require("./receive-return").default)
  )

  route.post(
    "/:id/cancel",
    middlewares.wrap(require("./cancel-return").default)
  )

  return app
}

/**
 * @schema AdminReturnsCancelRes
 * type: object
 * properties:
 *   order:
 *     $ref: "#/components/schemas/Order"
 */
export type AdminReturnsCancelRes = {
  order: Order
}

/**
 * @schema AdminReturnsListRes
 * type: object
 * properties:
 *   returns:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Return"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminReturnsListRes = PaginatedResponse & {
  returns: Return[]
}

/**
 * @schema AdminReturnsRes
 * type: object
 * properties:
 *   return:
 *     $ref: "#/components/schemas/Return"
 */
export type AdminReturnsRes = {
  return: Return
}

export * from "./list-returns"
export * from "./receive-return"
