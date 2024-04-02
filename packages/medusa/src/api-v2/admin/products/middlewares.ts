import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  maybeApplyPriceListsFilter,
  maybeApplySalesChannelsFilter,
} from "./utils"
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

export const adminProductRoutesMiddlewares: MiddlewareRoute[] = [
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
        QueryConfig.listProductQueryConfig
      ),
      maybeApplySalesChannelsFilter(),
      maybeApplyPriceListsFilter(),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/products/:id",
    middlewares: [
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products",
    middlewares: [
      transformBody(AdminPostProductsReq),
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id",
    middlewares: [
      transformBody(AdminPostProductsProductReq),
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id",
    middlewares: [
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },

  {
    method: ["GET"],
    matcher: "/admin/products/:id/variants",
    middlewares: [
      transformQuery(
        AdminGetProductsVariantsParams,
        QueryConfig.listVariantConfig
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
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants",
    middlewares: [
      transformBody(AdminPostProductsProductVariantsReq),
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      transformBody(AdminPostProductsProductVariantsVariantReq),
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },

  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/options",
    middlewares: [
      transformQuery(
        AdminGetProductsOptionsParams,
        QueryConfig.listOptionConfig
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
        QueryConfig.retrieveOptionConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/options",
    middlewares: [
      transformBody(AdminPostProductsProductOptionsReq),
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [
      transformBody(AdminPostProductsProductOptionsOptionReq),
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [
      transformQuery(
        AdminGetProductsProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
]
