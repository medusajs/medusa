import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import {
  applyDefaultFilters,
  applyParamsAsFilters,
  authenticate,
  clearFiltersByKey,
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from "@zjedene-medusa/framework/http"
import { ProductStatus } from "@zjedene-medusa/framework/utils"
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
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
        filterByField: "product.id",
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
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
        filterByField: "product.id",
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
