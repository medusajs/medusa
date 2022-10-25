import { Router } from "express"
import "reflect-metadata"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { StockLocationDTO } from "../../../../types/stock-location"
import middlewares, { transformQuery } from "../../../middlewares"
import { AdminGetStockLocationParams } from "./list-stock-locations"

const route = Router()

export default (app) => {
  app.use("/stock-locations", route)

  route.get(
    "/",
    transformQuery(AdminGetStockLocationParams, {
      defaultFields: defaultAdminStockLocationFields,
      defaultRelations: defaultAdminStockLocationRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-stock-locations").default)
  )
  // route.post(
  //   "/",
  //   transformQuery(AdminPostDiscountsParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   transformBody(AdminPostDiscountsReq),
  //   middlewares.wrap(require("./create-discount").default)
  // )

  // route.get(
  //   "/:discount_id",
  //   transformQuery(AdminGetDiscountParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   middlewares.wrap(require("./get-discount").default)
  // )
  // route.get(
  //   "/code/:code",
  //   transformQuery(AdminGetDiscountsDiscountCodeParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   middlewares.wrap(require("./get-discount-by-code").default)
  // )
  // route.post(
  //   "/:discount_id",
  //   transformQuery(AdminPostDiscountsDiscountParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   transformBody(AdminPostDiscountsDiscountReq),
  //   middlewares.wrap(require("./update-discount").default)
  // )
  // route.delete(
  //   "/:discount_id",
  //   middlewares.wrap(require("./delete-discount").default)
  // )

  // // Dynamic codes
  // route.post(
  //   "/:discount_id/dynamic-codes",
  //   transformBody(AdminPostDiscountsDiscountDynamicCodesReq),
  //   middlewares.wrap(require("./create-dynamic-code").default)
  // )
  // route.delete(
  //   "/:discount_id/dynamic-codes/:code",
  //   middlewares.wrap(require("./delete-dynamic-code").default)
  // )

  // // Discount region management
  // route.post(
  //   "/:discount_id/regions/:region_id",
  //   middlewares.wrap(require("./add-region").default)
  // )
  // route.delete(
  //   "/:discount_id/regions/:region_id",
  //   middlewares.wrap(require("./remove-region").default)
  // )

  // // Discount condition management
  // route.post(
  //   "/:discount_id/conditions",
  //   transformQuery(AdminPostDiscountsDiscountConditionsParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   transformBody(AdminPostDiscountsDiscountConditions),
  //   middlewares.wrap(require("./create-condition").default)
  // )

  // route.delete(
  //   "/:discount_id/conditions/:condition_id",
  //   transformQuery(AdminDeleteDiscountsDiscountConditionsConditionParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   middlewares.wrap(require("./delete-condition").default)
  // )

  // const conditionRouter = Router({ mergeParams: true })
  // route.use(
  //   "/:discount_id/conditions/:condition_id",
  //   doesConditionBelongToDiscount,
  //   conditionRouter
  // )

  // conditionRouter.get(
  //   "/",
  //   transformQuery(AdminGetDiscountsDiscountConditionsConditionParams, {
  //     defaultFields: defaultAdminDiscountConditionFields,
  //     defaultRelations: defaultAdminDiscountConditionRelations,
  //     isList: false,
  //   }),
  //   middlewares.wrap(require("./get-condition").default)
  // )
  // conditionRouter.post(
  //   "/",
  //   transformQuery(AdminPostDiscountsDiscountConditionsConditionParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   transformBody(AdminPostDiscountsDiscountConditionsCondition),
  //   middlewares.wrap(require("./update-condition").default)
  // )
  // conditionRouter.post(
  //   "/batch",
  //   transformQuery(AdminPostDiscountsDiscountConditionsConditionBatchParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   transformBody(AdminPostDiscountsDiscountConditionsConditionBatchReq),
  //   middlewares.wrap(require("./add-resources-to-condition-batch").default)
  // )
  // conditionRouter.delete(
  //   "/batch",
  //   transformQuery(AdminDeleteDiscountsDiscountConditionsConditionBatchParams, {
  //     defaultFields: defaultAdminDiscountsFields,
  //     defaultRelations: defaultAdminDiscountsRelations,
  //     isList: false,
  //   }),
  //   transformBody(AdminDeleteDiscountsDiscountConditionsConditionBatchReq),
  //   middlewares.wrap(require("./delete-resources-from-condition-batch").default)
  // )

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
