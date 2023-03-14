import { Router } from "express"
import { ReturnReason } from "../../../.."
import { DeleteResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/return-reasons", route)

  /**
   * List reasons
   */
  route.get("/", middlewares.wrap(require("./list-reasons").default))

  /**
   * Retrieve reason
   */
  route.get("/:id", middlewares.wrap(require("./get-reason").default))

  /**
   * Create a reason
   */
  route.post("/", middlewares.wrap(require("./create-reason").default))

  /**
   * Update a reason
   */
  route.post("/:id", middlewares.wrap(require("./update-reason").default))

  /**
   * Delete a reason
   */
  route.delete("/:id", middlewares.wrap(require("./delete-reason").default))

  return app
}

export const defaultAdminReturnReasonsFields: (keyof ReturnReason)[] = [
  "id",
  "value",
  "label",
  "parent_return_reason_id",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminReturnReasonsRelations: (keyof ReturnReason)[] = [
  "parent_return_reason",
  "return_reason_children",
]

/**
 * @schema AdminReturnReasonsRes
 * type: object
 * properties:
 *   return_reason:
 *     $ref: "#/components/schemas/ReturnReason"
 */
export type AdminReturnReasonsRes = {
  return_reason: ReturnReason
}

/**
 * @schema AdminReturnReasonsListRes
 * type: object
 * properties:
 *   return_reasons:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ReturnReason"
 */
export type AdminReturnReasonsListRes = {
  return_reasons: ReturnReason[]
}

/**
 * @schema AdminReturnReasonsDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted return reason
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: return_reason
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminReturnReasonsDeleteRes = DeleteResponse

export * from "./create-reason"
export * from "./update-reason"
