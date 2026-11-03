import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import {
  authorize,
  authorizeIfNecessary,
  AuthenticatedMedusaRequest,
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from "@medusajs/framework/http"
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
  AdminBatchUpdateProductType,
  AdminBatchUpdateProductVariant,
  AdminBatchUpdateVariantInventoryItem,
  AdminBatchVariantImages,
  AdminCreateProduct,
  AdminCreateProductType,
  AdminCreateProductVariant,
  AdminCreateVariantInventoryItem,
  AdminGetProductOptionsParams,
  AdminGetProductParams,
  AdminGetProductsParams,
  AdminGetProductVariantParams,
  AdminImportProducts,
  AdminLinkProductOptions,
  AdminUpdateProduct,
  AdminUpdateProductType,
  AdminUpdateProductVariant,
  AdminUpdateVariantInventoryItem,
  CreateProduct,
  CreateProductVariant,
} from "./validators"

const upload = multer({ storage: multer.memoryStorage() })

type ProductWritesByOperation = {
  create: {
    variants?: { inventory_items?: unknown[] }[]
    sales_channels?: unknown[]
  }[]
  update: { variants?: unknown[]; sales_channels?: unknown[] }[]
}

/**
 * Guards the resources a product payload writes through nested fields with the
 * policies of their dedicated routes. Updating `variants` or `sales_channels`
 * replaces the whole set, so it may create, update, and delete variants.
 */
const authorizeNestedProductWrites = <TBody>(
  getProducts: (body: TBody) => ProductWritesByOperation
) => {
  const products = (req: AuthenticatedMedusaRequest<TBody>) =>
    getProducts(req.validatedBody)

  return [
    authorizeIfNecessary<TBody>(
      (req) => products(req).create.some((p) => !!p.variants?.length),
      {
        resource: Entities.product_variant,
        operation: PolicyOperation.create,
      }
    ),
    authorizeIfNecessary<TBody>(
      (req) => products(req).update.some((p) => p.variants !== undefined),
      {
        resource: Entities.product_variant,
        operation: [
          PolicyOperation.create,
          PolicyOperation.update,
          PolicyOperation.delete,
        ],
      }
    ),
    authorizeIfNecessary<TBody>(
      (req) =>
        products(req).create.some((p) =>
          p.variants?.some((v) => !!v.inventory_items?.length)
        ),
      { resource: Entities.inventory_item, operation: PolicyOperation.create }
    ),
    authorizeIfNecessary<TBody>(
      (req) => {
        const { create, update } = products(req)
        return (
          create.some((p) => !!p.sales_channels?.length) ||
          update.some((p) => p.sales_channels !== undefined)
        )
      },
      { resource: "sales_channel", operation: PolicyOperation.update }
    ),
  ]
}

export const adminProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/products/*",
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    matcher: "/admin/products/*/variants/*",
    middlewares: [
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    matcher: "/admin/products/*/options/*",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    matcher: "/admin/products/*/variants/*/inventory-items/*",
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/products",
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: PolicyOperation.read,
        },
      ]),
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
  },
  {
    method: ["POST"],
    matcher: "/admin/products",
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateProduct),
      ...authorizeNestedProductWrites<AdminCreateProductType>((body) => ({
        create: [body],
        update: [],
      })),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: [
            PolicyOperation.create,
            PolicyOperation.update,
            PolicyOperation.delete,
          ],
        },
      ]),
      validateAndTransformBody(
        createBatchBody(CreateProduct, AdminBatchUpdateProduct)
      ),
      ...authorizeNestedProductWrites<{
        create?: AdminCreateProductType[]
        update?: AdminBatchUpdateProductType[]
      }>((body) => ({
        create: body.create ?? [],
        update: body.update ?? [],
      })),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
      ),
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
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: [PolicyOperation.create, PolicyOperation.update],
        },
      ]),
      upload.single("file"),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/imports",
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: [PolicyOperation.create, PolicyOperation.update],
        },
      ]),
      validateAndTransformBody(AdminImportProducts),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/import/:transaction_id/confirm",
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: [PolicyOperation.create, PolicyOperation.update],
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/imports/:transaction_id/confirm",
    middlewares: [
      authorize([
        {
          resource: Entities.product,
          operation: [PolicyOperation.create, PolicyOperation.update],
        },
      ]),
    ],
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
      authorize([
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateProduct),
      ...authorizeNestedProductWrites<AdminUpdateProductType>((body) => ({
        create: [],
        update: [body],
      })),
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
      authorize([
        {
          resource: Entities.product,
          operation: PolicyOperation.delete,
        },
      ]),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
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
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
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
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.product_variant,
          operation: [
            PolicyOperation.create,
            PolicyOperation.update,
            PolicyOperation.delete,
          ],
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(
        createBatchBody(CreateProductVariant, AdminBatchUpdateProductVariant)
      ),
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/images/:image_id/variants/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminBatchImageVariant),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/products/:id/variants/:variant_id/images/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminBatchVariantImages),
    ],
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
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetProductParams,
        QueryConfig.retrieveProductQueryConfig
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
  {
    method: ["POST"],
    matcher: "/admin/products/:id/options/batch",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: [
            PolicyOperation.delete,
            PolicyOperation.create,
            PolicyOperation.update,
          ],
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminLinkProductOptions),
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
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.inventory_item,
          operation: [
            PolicyOperation.create,
            PolicyOperation.update,
            PolicyOperation.delete,
          ],
        },
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.inventory_item,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetProductVariantParams,
        QueryConfig.retrieveVariantConfig
      ),
    ],
  },
]
