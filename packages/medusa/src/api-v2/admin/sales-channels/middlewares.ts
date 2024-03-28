import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
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
]
