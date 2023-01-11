import { Router } from "express"
import "reflect-metadata"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { StockLocationDTO } from "../../../../types/stock-location"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminGetStockLocationsParams } from "./list-stock-locations"
import { AdminGetStockLocationsLocationParams } from "./get-stock-location"
import {
  AdminPostStockLocationsLocationParams,
  AdminPostStockLocationsLocationReq,
} from "./update-stock-location"
import {
  AdminPostStockLocationsParams,
  AdminPostStockLocationsReq,
} from "./create-stock-location"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"

const route = Router()

export default (app) => {
  app.use(
    "/stock-locations",
    checkRegisteredModules({
      stockLocationService:
        "Stock Locations are not enabled. Please add a Stock Location module to enable this functionality.",
    }),
    route
  )

  route.get(
    "/",
    transformQuery(AdminGetStockLocationsParams, {
      defaultFields: defaultAdminStockLocationFields,
      defaultRelations: defaultAdminStockLocationRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-stock-locations").default)
  )
  route.post(
    "/",
    transformQuery(AdminPostStockLocationsParams, {
      defaultFields: defaultAdminStockLocationFields,
      defaultRelations: defaultAdminStockLocationRelations,
      isList: false,
    }),
    transformBody(AdminPostStockLocationsReq),
    middlewares.wrap(require("./create-stock-location").default)
  )

  route.get(
    "/:id",
    transformQuery(AdminGetStockLocationsLocationParams, {
      defaultFields: defaultAdminStockLocationFields,
      defaultRelations: defaultAdminStockLocationRelations,
      isList: false,
    }),
    middlewares.wrap(require("./get-stock-location").default)
  )

  route.post(
    "/:id",
    transformQuery(AdminPostStockLocationsLocationParams, {
      defaultFields: defaultAdminStockLocationFields,
      defaultRelations: defaultAdminStockLocationRelations,
      isList: false,
    }),
    transformBody(AdminPostStockLocationsLocationReq),
    middlewares.wrap(require("./update-stock-location").default)
  )

  return app
}

export const defaultAdminStockLocationFields: (keyof StockLocationDTO)[] = [
  "id",
  "name",
  "address_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminStockLocationRelations = []

export type AdminStockLocationsRes = {
  stock_location: StockLocationDTO
}

export type AdminStockLocationsDeleteRes = DeleteResponse

export type AdminStockLocationsListRes = PaginatedResponse & {
  stock_locations: StockLocationDTO[]
}

export * from "./list-stock-locations"
export * from "./get-stock-location"
export * from "./create-stock-location"
export * from "./update-stock-location"
