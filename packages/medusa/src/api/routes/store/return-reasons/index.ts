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

export const defaultStoreReturnReasonFields = [
  "id",
  "value",
  "label",
  "parent_return_reason_id",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultStoreReturnReasonRelations = [
  "parent_return_reason",
  "return_reason_children",
]

export type StoreReturnReasonsListRes = {
  return_reasons: ReturnReason[]
}

export type StoreReturnReasonsRes = {
  return_reason: ReturnReason
}

export * from "./get-reason"
