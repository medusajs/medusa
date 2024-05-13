import { isPresent, ProductStatus } from "@medusajs/utils"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import {
  applyDefaultFilters,
  filterByValidSalesChannels,
  setPricingContext,
} from "../../utils/middlewares"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  StoreGetProductsParams,
  StoreGetProductsParamsType,
} from "./validators"

export const storeProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/store/products*",
    middlewares: [
      authenticate("store", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/products",
    middlewares: [
      validateAndTransformQuery(
        StoreGetProductsParams,
        QueryConfig.listProductQueryConfig
      ),
      filterByValidSalesChannels(),
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
      setPricingContext(),
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
      filterByValidSalesChannels(),
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
      setPricingContext(),
    ],
  },
]
