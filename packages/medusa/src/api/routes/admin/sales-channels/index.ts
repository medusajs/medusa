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

const route = Router()

export default (app) => {
  app.use("/sales-channels", isFeatureFlagEnabled("sales_channels"), route)

  route.get(
    "/",
    transformQuery(AdminGetSalesChannelsParams, {
      isList: true,
    }),
    require("./list-sales-channels").default
  )

  const salesChannelRouter = Router({ mergeParams: true })
  route.use("/:id", salesChannelRouter)

  salesChannelRouter.get("/", require("./get-sales-channel").default)
  salesChannelRouter.post(
    "/",
    transformBody(AdminPostSalesChannelsSalesChannelReq),
    require("./update-sales-channel").default
  )
  salesChannelRouter.delete("/", require("./delete-sales-channel").default)
  salesChannelRouter.post(
    "/",
    transformBody(AdminPostSalesChannelsSalesChannelReq),
    require("./update-sales-channel").default
  )
  salesChannelRouter.delete(
    "/products/batch",
    transformBody(AdminDeleteSalesChannelsChannelProductsBatchReq),
    require("./delete-products-batch").default
  )
  salesChannelRouter.post(
    "/products/batch",
    transformBody(AdminPostSalesChannelsChannelProductsBatchReq),
    validateProductsExist((req) => req.body.product_ids),
    require("./add-product-batch").default
  )

  route.post(
    "/",
    transformBody(AdminPostSalesChannelsReq),
    require("./create-sales-channel").default
  )

  return app
}

export type AdminSalesChannelsRes = {
  sales_channel: SalesChannel
}

export type AdminSalesChannelsDeleteRes = DeleteResponse

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
