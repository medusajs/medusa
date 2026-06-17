import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { maybeApplyLinkFilter, MiddlewareRoute } from "@medusajs/framework/http"
import { FeatureFlag, PolicyOperation } from "@medusajs/framework/utils"
import multer from "multer"
import IndexEngineFeatureFlag from "../../../feature-flags/index-engine"
import { DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT } from "../../../utils/middlewares"
import { createBatchBody } from "../../utils/validators"
import { AdminGetProductVariantsParams } from "../product-variants/validators"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { maybeApplyPriceListsFilter } from "./utils"
import {
  AdminBatchCreateVariantInventoryItem,
  AdminBatchDeleteVariantInventoryItem,
  AdminBatchImageVariant,
  AdminBatchUpdateProduct,
  AdminBatchUpdateProductVariant,
  AdminBatchUpdateVariantInventoryItem,
  AdminBatchVariantImages,
  AdminCreateProduct,
  AdminCreateProductOption,
  AdminCreateProductVariant,
  AdminCreateVariantInventoryItem,
  AdminGetProductOptionParams,
  AdminGetProductOptionsParams,
  AdminGetProductParams,
  AdminGetProductsParams,
  AdminGetProductVariantParams,
  AdminImportProducts,
  AdminUpdateProduct,
  AdminUpdateProductOption,
  AdminUpdateProductVariant,
  AdminUpdateVariantInventoryItem,
  CreateProduct,
  CreateProductVariant,
} from "./validators"

const upload = multer({ storage: multer.memoryStorage() })

export const adminProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/products/*",
    policies: [
      {
        resource: Entities.product,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    matcher: "/admin/products/*/variants/*",
    policies: [
      {
        resource: Entities.product_variant,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    matcher: "/admin/products/*/options/*",
    policies: [
      {
        resource: Entities.product_option,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    matcher: "/admin/products/*/variants/*/inventory-items/*",
    policies: [
      {
        resource: Entities.inventory_item,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/products",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductsParams,
        QueryConfig.listProductQueryConfig
      ),
      (req, res, next) => {
        if (FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key)) {
          return next()
        }

        return maybeApplyLinkFilter({
          entryPoint: "product_sales_channel",
          resourceId: "product_id",
          filterableField: "sales_channel_id",
        })(req, res, next)
      },
      maybeApplyPriceListsFilter(),
    ],
    policies: [
      {
        resource: Entities.product,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.product,
        operation: PolicyOperation.create,
      },
      {
        resource: Entities.inventory_item,
        operation: PolicyOperation.create,
      },
      {
        resource: Entities.price,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      validateAndTransformBody(
        createBatchBody(CreateProduct, AdminBatchUpdateProduct)
      ),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.product,
        operation: [PolicyOperation.create, PolicyOperation.update],
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/export",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductsParams,
        QueryConfig.listProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/import",
    middlewares: [upload.single("file")],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/imports",
    middlewares: [validateAndTransformBody(AdminImportProducts)],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/import/:transaction_id/confirm",
    middlewares: [],
  },
  {
    method: ["GET"],
    matcher: "/admin/products/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateProduct),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.product,
        operation: PolicyOperation.delete,
      },
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
    policies: [
      {
        resource: Entities.product_variant,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      validateAndTransformBody(
        createBatchBody(CreateProductVariant, AdminBatchUpdateProductVariant)
      ),
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
    policies: [
      {
        resource: Entities.product_variant,
        operation: [
          PolicyOperation.create,
          PolicyOperation.update,
          PolicyOperation.delete,
        ],
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/images/:image_id/variants/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [validateAndTransformBody(AdminBatchImageVariant)],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/:variant_id/images/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [validateAndTransformBody(AdminBatchVariantImages)],
  },
  // Note: New endpoint in v2
  {
    method: ["GET"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateProductVariant),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/products/:id/variants/:variant_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.product_variant,
        operation: PolicyOperation.delete,
      },
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
    policies: [
      {
        resource: Entities.product_option,
        operation: PolicyOperation.delete,
      },
    ],
  },

  // Variant inventory item endpoints
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/inventory-items/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
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
    policies: [
      {
        resource: Entities.inventory_item,
        operation: [
          PolicyOperation.create,
          PolicyOperation.update,
          PolicyOperation.delete,
        ],
      },
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
    policies: [
      {
        resource: Entities.inventory_item,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.inventory_item,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.inventory_item,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
