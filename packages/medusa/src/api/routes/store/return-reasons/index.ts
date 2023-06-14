import { ReturnReason } from "./../../../../"
import { Router } from "express"
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

  return app
}

export const defaultStoreReturnReasonFields: (keyof ReturnReason)[] = [
  "id",
  "value",
  "label",
  "parent_return_reason_id",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultStoreReturnReasonRelations: (keyof ReturnReason)[] = [
  "parent_return_reason",
  "return_reason_children",
]

/**
 * @schema StoreReturnReasonsListRes
 * type: object
 * x-expanded-relations:
 *   field: return_reasons
 *   relations:
 *     - parent_return_reason
 *     - return_reason_children
 * required:
 *   - return_reasons
 * properties:
 *   return_reasons:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ReturnReason"
 */
export type StoreReturnReasonsListRes = {
  return_reasons: ReturnReason[]
}

/**
 * @schema StoreReturnReasonsRes
 * type: object
 * x-expanded-relations:
 *   field: return_reason
 *   relations:
 *     - parent_return_reason
 *     - return_reason_children
 * required:
 *   - return_reason
 * properties:
 *   return_reason:
 *     $ref: "#/components/schemas/ReturnReason"
 */
export type StoreReturnReasonsRes = {
  return_reason: ReturnReason
}

export * from "./get-reason"
