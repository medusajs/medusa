import { validateAndTransformQuery } from "@medusajs/framework"
import {
  applyCrossModuleFilter,
  applyDefaultFilters,
  applyParamsAsFilters,
  authenticate,
  clearFiltersByKey,
  MiddlewareRoute,
} from "@medusajs/framework/http"
import { ProductStatus } from "@medusajs/framework/utils"
import {
  filterByValidSalesChannels,
  normalizeDataForContext,
  setPricingContext,
  setTaxContext,
} from "../../utils/middlewares"
import * as QueryConfig from "./query-config"
import {
  StoreProductVariantListParams,
  StoreProductVariantParams,
} from "./validators"

const pricingMiddlewares = [
  normalizeDataForContext({ priceFieldPaths: ["calculated_price"] }),
  setPricingContext({ priceFieldPaths: ["calculated_price"] }),
  setTaxContext({ priceFieldPaths: ["calculated_price"] }),
]

export const storeProductVariantRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/product-variants",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
      validateAndTransformQuery(
        StoreProductVariantListParams,
        QueryConfig.listProductVariantConfig
      ),
      filterByValidSalesChannels(),
      applyCrossModuleFilter({
        filterableField: "sales_channel_id",
        relationPath: "product.sales_channels.id",
      }),
      applyDefaultFilters({
        product: {
          status: ProductStatus.PUBLISHED,
        },
      }),
      ...pricingMiddlewares,
      clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/product-variants/:id",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
      validateAndTransformQuery(
        StoreProductVariantParams,
        QueryConfig.retrieveProductVariantConfig
      ),
      applyParamsAsFilters({ id: "id" }),
      filterByValidSalesChannels(),
      applyCrossModuleFilter({
        filterableField: "sales_channel_id",
        relationPath: "product.sales_channels.id",
      }),
      applyDefaultFilters({
        product: {
          status: ProductStatus.PUBLISHED,
        },
      }),
      ...pricingMiddlewares,
      clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
    ],
  },
]
