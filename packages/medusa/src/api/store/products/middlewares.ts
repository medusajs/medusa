import { isPresent, ProductStatus } from "@medusajs/utils"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import {
  applyDefaultFilters,
  clearFiltersByKey,
  filterByValidSalesChannels,
  normalizeDataForContext,
  setPricingContext,
  setTaxContext,
} from "../../utils/middlewares"
import { setContext } from "../../utils/middlewares/common/set-context"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { maybeApplyStockLocationId } from "./helpers"
import * as QueryConfig from "./query-config"
import {
  StoreGetProductsParams,
  StoreGetProductsParamsType,
} from "./validators"
import { applyParamsAsFilters } from "../../utils/middlewares/common/apply-params-as-filters"

export const storeProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/products",
    middlewares: [
      validateAndTransformQuery(
        StoreGetProductsParams,
        QueryConfig.listProductQueryConfig
      ),
      filterByValidSalesChannels(),
      setContext({
        stock_location_id: maybeApplyStockLocationId,
      }),
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
        categories: (filters: StoreGetProductsParamsType, fields: string[]) => {
          const categoryIds = filters.category_id
          delete filters.category_id

          if (!isPresent(categoryIds)) {
            return
          }

          return { id: categoryIds, is_internal: false, is_active: true }
        },
      }),
      normalizeDataForContext(),
      setPricingContext(),
      setTaxContext(),
      clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/products/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetProductsParams,
        QueryConfig.retrieveProductQueryConfig
      ),
      applyParamsAsFilters({ id: "id" }),
      filterByValidSalesChannels(),
      setContext({
        stock_location_id: maybeApplyStockLocationId,
      }),
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
        categories: (_filters, fields: string[]) => {
          if (!fields.some((field) => field.startsWith("categories"))) {
            return
          }

          return { is_internal: false, is_active: true }
        },
      }),
      normalizeDataForContext(),
      setPricingContext(),
      setTaxContext(),
      clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
    ],
  },
]
