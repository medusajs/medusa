import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import { unlessPath } from "../../utils/unless-path"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { createBatchBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import { maybeApplyPriceListsFilter } from "./utils"
import {
  AdminBatchCreateVariantInventoryItem,
  AdminBatchDeleteVariantInventoryItem,
  AdminBatchUpdateProduct,
  AdminBatchUpdateProductVariant,
  AdminBatchUpdateVariantInventoryItem,
  AdminCreateProduct,
  AdminCreateProductOption,
  AdminCreateProductVariant,
  AdminCreateVariantInventoryItem,
  AdminGetProductOptionParams,
  AdminGetProductOptionsParams,
  AdminGetProductParams,
  AdminGetProductsParams,
  AdminGetProductVariantParams,
  AdminGetProductVariantsParams,
  AdminUpdateProduct,
  AdminUpdateProductOption,
  AdminUpdateProductVariant,
  AdminUpdateVariantInventoryItem,
} from "./validators"

export const adminProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/products",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductsParams,
        QueryConfig.listProductQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
      maybeApplyPriceListsFilter(),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products",
    middlewares: [
      validateAndTransformBody(AdminCreateProduct),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/batch",
    middlewares: [
      validateAndTransformBody(
        createBatchBody(AdminCreateProduct, AdminBatchUpdateProduct)
      ),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/products/:id",
    middlewares: [
      unlessPath(
        /.*\/products\/batch/,
        validateAndTransformQuery(
          AdminGetProductParams,
          QueryConfig.retrieveProductQueryConfig
        )
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id",
    middlewares: [
      unlessPath(
        /.*\/products\/batch/,
        validateAndTransformBody(AdminUpdateProduct)
      ),
      unlessPath(
        /.*\/products\/batch/,
        validateAndTransformQuery(
          AdminGetProductParams,
          QueryConfig.retrieveProductQueryConfig
        )
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id",
    middlewares: [
      unlessPath(
        /.*\/products\/batch/,
        validateAndTransformQuery(
          AdminGetProductParams,
          QueryConfig.retrieveProductQueryConfig
        )
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/products/:id/variants",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductVariantsParams,
        QueryConfig.listVariantConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants",
    middlewares: [
      validateAndTransformBody(AdminCreateProductVariant),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/batch",
    middlewares: [
      validateAndTransformBody(
        createBatchBody(
          AdminCreateProductVariant,
          AdminBatchUpdateProductVariant
        )
      ),
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      unlessPath(
        /.*\/variants\/batch/,
        validateAndTransformQuery(
          AdminGetProductVariantParams,
          QueryConfig.retrieveVariantConfig
        )
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      unlessPath(
        /.*\/variants\/batch/,
        validateAndTransformBody(AdminUpdateProductVariant)
      ),
      unlessPath(
        /.*\/variants\/batch/,
        validateAndTransformQuery(
          AdminGetProductParams,
          QueryConfig.retrieveProductQueryConfig
        )
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      unlessPath(
        /.*\/variants\/batch/,
        validateAndTransformQuery(
          AdminGetProductParams,
          QueryConfig.retrieveProductQueryConfig
        )
      ),
    ],
  },

  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/options",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductOptionsParams,
        QueryConfig.listOptionConfig
      ),
    ],
  },
  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductOptionParams,
        QueryConfig.retrieveOptionConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/options",
    middlewares: [
      validateAndTransformBody(AdminCreateProductOption),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateProductOption),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id/options/:option_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },

  // Variant inventory item endpoints
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/inventory-items/batch",
    middlewares: [
      validateAndTransformBody(
        createBatchBody(
          AdminBatchCreateVariantInventoryItem,
          AdminBatchUpdateVariantInventoryItem,
          AdminBatchDeleteVariantInventoryItem
        )
      ),
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/:variant_id/inventory-items",
    middlewares: [
      validateAndTransformBody(AdminCreateVariantInventoryItem),
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher:
      "/admin/products/:id/variants/:variant_id/inventory-items/:inventory_item_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateVariantInventoryItem),
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher:
      "/admin/products/:id/variants/:variant_id/inventory-items/:inventory_item_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
]
