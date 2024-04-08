import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import * as QueryConfig from "./query-config"
import {
  AdminGetSalesChannelsParams,
  AdminGetSalesChannelsSalesChannelParams,
  AdminPostSalesChannelsChannelProductsBatchReq,
  AdminPostSalesChannelsReq,
  AdminPostSalesChannelsSalesChannelReq,
} from "./validators"

export const adminSalesChannelRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/sales-channels*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-channels",
    middlewares: [
      transformQuery(
        AdminGetSalesChannelsParams,
        QueryConfig.listTransformQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "sales_channel_location",
        resourceId: "sales_channel_id",
        filterableField: "location_id",
      }),
      maybeApplyLinkFilter({
        entryPoint: "publishable_api_key_sales_channel",
        resourceId: "sales_channel_id",
        filterableField: "publishable_key_id",
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [
      transformQuery(
        AdminGetSalesChannelsSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels",
    middlewares: [
      transformBody(AdminPostSalesChannelsReq),
      transformQuery(
        AdminGetSalesChannelsSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [transformBody(AdminPostSalesChannelsSalesChannelReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id/products/batch/add",
    middlewares: [transformBody(AdminPostSalesChannelsChannelProductsBatchReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id/products/batch/remove",
    middlewares: [transformBody(AdminPostSalesChannelsChannelProductsBatchReq)],
  },
]
