import * as QueryConfig from "./query-config"

import {
  AdminGetProductsOptionsParams,
  AdminGetProductsParams,
  AdminGetProductsProductOptionsOptionParams,
  AdminGetProductsProductParams,
  AdminGetProductsProductVariantsVariantParams,
  AdminGetProductsVariantsParams,
  AdminPostProductsProductOptionsOptionReq,
  AdminPostProductsProductOptionsReq,
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  AdminPostProductsReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/products*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },

  {
    method: ["GET"],
    matcher: "/admin/products",
    middlewares: [
      transformQuery(
        AdminGetProductsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/products/:id",
    middlewares: [
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products",
    middlewares: [transformBody(AdminPostProductsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id",
    middlewares: [transformBody(AdminPostProductsProductReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id",
    middlewares: [],
  },

  // TODO: Part of v1 API. Remove in favor of just updating the metadata through as standard update
  {
    method: ["POST"],
    matcher: "/admin/products/:id/metadata",
    middlewares: [],
  },

  {
    method: ["GET"],
    matcher: "/admin/products/:id/variants",
    middlewares: [
      transformQuery(
        AdminGetProductsVariantsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      transformQuery(
        AdminGetProductsProductVariantsVariantParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants",
    middlewares: [transformBody(AdminPostProductsProductVariantsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [transformBody(AdminPostProductsProductVariantsVariantReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [],
  },

  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/options",
    middlewares: [
      transformQuery(
        AdminGetProductsOptionsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [
      transformQuery(
        AdminGetProductsProductOptionsOptionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/options",
    middlewares: [transformBody(AdminPostProductsProductOptionsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [transformBody(AdminPostProductsProductOptionsOptionReq)],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [],
  },
]
