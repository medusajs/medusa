import { Router } from "express"
import { Region } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"
import "reflect-metadata"

const route = Router()

export default (app) => {
  app.use("/regions", route)

  route.get("/", middlewares.wrap(require("./list-regions").default))
  route.get("/:region_id", middlewares.wrap(require("./get-region").default))

  route.get(
    "/:region_id/fulfillment-options",
    middlewares.wrap(require("./get-fulfillment-options").default)
  )

  route.post("/", middlewares.wrap(require("./create-region").default))
  route.post(
    "/:region_id",
    middlewares.wrap(require("./update-region").default)
  )

  route.delete(
    "/:region_id",
    middlewares.wrap(require("./delete-region").default)
  )

  route.post(
    "/:region_id/countries",
    middlewares.wrap(require("./add-country").default)
  )
  route.delete(
    "/:region_id/countries/:country_code",
    middlewares.wrap(require("./remove-country").default)
  )

  route.post(
    "/:region_id/payment-providers",
    middlewares.wrap(require("./add-payment-provider").default)
  )
  route.delete(
    "/:region_id/payment-providers/:provider_id",
    middlewares.wrap(require("./remove-payment-provider").default)
  )

  route.post(
    "/:region_id/fulfillment-providers",
    middlewares.wrap(require("./add-fulfillment-provider").default)
  )
  route.delete(
    "/:region_id/fulfillment-providers/:provider_id",
    middlewares.wrap(require("./remove-fulfillment-provider").default)
  )

  return app
}

export const defaultAdminRegionFields: (keyof Region)[] = [
  "id",
  "name",
  "automatic_taxes",
  "gift_cards_taxable",
  "tax_provider_id",
  "currency_code",
  "tax_rate",
  "tax_code",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultAdminRegionRelations = [
  "countries",
  "payment_providers",
  "fulfillment_providers",
]

export class AdminRegionsRes {
  region: Region
}

export type AdminRegionsListRes = PaginatedResponse & {
  regions: Region[]
}

export type AdminRegionsDeleteRes = DeleteResponse

export class FulfillmentOption {
  provider_id: string
  options: unknown[]
}

export class AdminGetRegionsRegionFulfillmentOptionsRes {
  fulfillment_options: FulfillmentOption[]
}

export * from "./list-regions"
export * from "./update-region"
export * from "./create-region"
export * from "./add-country"
export * from "./add-payment-provider"
export * from "./add-fulfillment-provider"
