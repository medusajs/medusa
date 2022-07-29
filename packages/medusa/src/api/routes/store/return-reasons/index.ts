import { ReturnReason } from "./../../../../"
import { Router } from "express"

const route = Router()

export default (app) => {
  app.use("/return-reasons", route)

  /**
   * List reasons
   */
  route.get("/", require("./list-reasons").default)

  /**
   * Retrieve reason
   */
  route.get("/:id", require("./get-reason").default)

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

export type StoreReturnReasonsListRes = {
  return_reasons: ReturnReason[]
}

export type StoreReturnReasonsRes = {
  return_reason: ReturnReason
}

export * from "./get-reason"
