import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT } from "../../../utils/middlewares"
import { createBatchBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreatePriceList,
  AdminCreatePriceListPrice,
  AdminGetPriceListParams,
  AdminGetPriceListPriceParams,
  AdminGetPriceListPricesParams,
  AdminGetPriceListsParams,
  AdminRemoveProductsPriceList,
  AdminUpdatePriceList,
  AdminUpdatePriceListPrice,
} from "./validators"

export const adminPriceListsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/price-lists/*",
    policies: [
      {
        resource: Entities.price_list,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    matcher: "/admin/price-lists/*/prices/*",
    policies: [
      {
        resource: Entities.price,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListsParams,
        QueryConfig.listPriceListQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price_list,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists",
    middlewares: [
      validateAndTransformBody(AdminCreatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListsParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price_list,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price_list,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/products",
    middlewares: [
      validateAndTransformBody(AdminRemoveProductsPriceList),
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.listPriceListQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price_list,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists/:id/prices",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListPricesParams,
        QueryConfig.listPriceListPriceQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/prices/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      validateAndTransformBody(
        createBatchBody(AdminCreatePriceListPrice, AdminUpdatePriceListPrice)
      ),
      validateAndTransformQuery(
        AdminGetPriceListPriceParams,
        QueryConfig.listPriceListPriceQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.price,
        operation: PolicyOperation.ALL,
      },
    ],
  },
]
