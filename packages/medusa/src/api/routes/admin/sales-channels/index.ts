import { Router } from "express"
import "reflect-metadata"
import { SalesChannel } from "../../../../models"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import { validateProductsExist } from "../../../middlewares/validators/product-existence"
import { AdminPostSalesChannelsChannelProductsBatchReq } from "./add-product-batch"
import { AdminPostSalesChannelsReq } from "./create-sales-channel"
import { AdminDeleteSalesChannelsChannelProductsBatchReq } from "./delete-products-batch"
import { AdminGetSalesChannelsParams } from "./list-sales-channels"
import { AdminPostSalesChannelsSalesChannelReq } from "./update-sales-channel"
import { AdminPostSalesChannelsChannelStockLocationsReq } from "./associate-stock-location"
import { AdminDeleteSalesChannelsChannelStockLocationsReq } from "./remove-stock-location"

const route = Router()

export default (app) => {
  app.use("/sales-channels", isFeatureFlagEnabled("sales_channels"), route)

  route.get(
    "/",
    transformQuery(AdminGetSalesChannelsParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list-sales-channels").default)
  )

  const salesChannelRouter = Router({ mergeParams: true })
  route.use("/:id", salesChannelRouter)

  salesChannelRouter.get(
    "/",
    middlewares.wrap(require("./get-sales-channel").default)
  )
  salesChannelRouter.delete(
    "/",
    middlewares.wrap(require("./delete-sales-channel").default)
  )
  salesChannelRouter.post(
    "/",
    transformBody(AdminPostSalesChannelsSalesChannelReq),
    middlewares.wrap(require("./update-sales-channel").default)
  )
  salesChannelRouter.post(
    "/stock-locations",
    transformBody(AdminPostSalesChannelsChannelStockLocationsReq),
    middlewares.wrap(require("./associate-stock-location").default)
  )
  salesChannelRouter.delete(
    "/stock-locations",
    transformBody(AdminDeleteSalesChannelsChannelStockLocationsReq),
    middlewares.wrap(require("./remove-stock-location").default)
  )
  salesChannelRouter.delete(
    "/products/batch",
    transformBody(AdminDeleteSalesChannelsChannelProductsBatchReq),
    middlewares.wrap(require("./delete-products-batch").default)
  )
  salesChannelRouter.post(
    "/products/batch",
    transformBody(AdminPostSalesChannelsChannelProductsBatchReq),
    validateProductsExist((req) => req.body.product_ids),
    middlewares.wrap(require("./add-product-batch").default)
  )

  route.post(
    "/",
    transformBody(AdminPostSalesChannelsReq),
    middlewares.wrap(require("./create-sales-channel").default)
  )

  return app
}

/**
 * @schema AdminSalesChannelsRes
 * type: object
 * properties:
 *   sales_channel:
 *     $ref: "#/components/schemas/SalesChannel"
 */
export type AdminSalesChannelsRes = {
  sales_channel: SalesChannel
}

/**
 * @schema AdminSalesChannelsDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted sales channel
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: sales-channel
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminSalesChannelsDeleteRes = DeleteResponse

/**
 * @schema AdminSalesChannelsDeleteLocationRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the removed stock location from a sales channel
 *   object:
 *     type: string
 *     description: The type of the object that was removed.
 *     default: stock-location
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminSalesChannelsDeleteLocationRes = DeleteResponse

/**
 * @schema AdminSalesChannelsListRes
 * type: object
 * properties:
 *   sales_channels:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/SalesChannel"
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
export type AdminSalesChannelsListRes = PaginatedResponse & {
  sales_channels: SalesChannel[]
}

export * from "./add-product-batch"
export * from "./create-sales-channel"
export * from "./delete-products-batch"
export * from "./delete-sales-channel"
export * from "./get-sales-channel"
export * from "./list-sales-channels"
export * from "./update-sales-channel"
export * from "./associate-stock-location"
export * from "./remove-stock-location"
