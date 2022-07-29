import { PaginatedResponse } from "./../../../../types/common"
import { ProductVariant } from "../../../../"
import { Router } from "express"

const route = Router()

export default (app) => {
  app.use("/variants", route)

  route.get("/", require("./list-variants").default)
  route.get("/:id", require("./get-variant").default)

  return app
}

export const defaultStoreVariantRelations = ["prices", "options"]

export type StoreVariantsRes = {
  variant: ProductVariant
}

export type StoreVariantsListRes = PaginatedResponse & {
  variants: ProductVariant[]
}

export * from "./list-variants"
export * from "./get-variant"
