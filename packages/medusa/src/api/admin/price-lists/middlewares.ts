import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.price_list,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    matcher: "/admin/price-lists/*/prices/*",
    middlewares: [
      authorize([
        {
          resource: Entities.price,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists",
    middlewares: [
      authorize([
        {
          resource: Entities.price_list,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetPriceListsParams,
        QueryConfig.listPriceListQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.price_list,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListsParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.price_list,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/products",
    middlewares: [
      authorize([
        {
          resource: Entities.price_list,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminRemoveProductsPriceList),
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.listPriceListQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.price_list,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(
        createBatchBody(AdminCreatePriceListPrice, AdminUpdatePriceListPrice)
      ),
      validateAndTransformQuery(
        AdminGetPriceListPriceParams,
        QueryConfig.listPriceListPriceQueryConfig
      ),
    ],
  },
]
