import { validateAndTransformQuery } from "@medusajs/framework"
import {
  applyDefaultFilters,
  applyParamsAsFilters,
  authenticate,
  clearFiltersByKey,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareRoute,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  isPresent,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  filterByValidSalesChannels,
  normalizeDataForContext,
  remapProductCrossModuleFilters,
  remapProductSearchFilters,
  setPricingContext,
  setTaxContext,
} from "../../utils/middlewares"
import * as QueryConfig from "./query-config"
import * as SearchQueryConfig from "./search/query-config"
import { StoreGetProductsSearchParams } from "./search/validators"
import { StoreGetProductsParams } from "./validators"

async function applySalesChannelCrossModuleFilter(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  if (!isPresent(req.filterableFields.sales_channel_id)) {
    return next()
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelsQueryRes = await query.graph({
    entity: "sales_channels",
    fields: ["id"],
    pagination: {
      skip: 0,
      take: 1,
    },
  })

  const salesChannelCount = salesChannelsQueryRes.metadata?.count ?? 0
  if (!(salesChannelCount > 1)) {
    delete req.filterableFields.sales_channel_id
    return next()
  }

  remapProductCrossModuleFilters(req.filterableFields)
  return next()
}

export const storeProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/products",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
      validateAndTransformQuery(
        StoreGetProductsParams,
        QueryConfig.listProductQueryConfig
      ),
      filterByValidSalesChannels(),
      applySalesChannelCrossModuleFilter,
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
        // TODO: the type here seems off and the implementation does not take into account $and and $or possible filters. Might be worth re working (original type used here was StoreGetProductsParamsType)
        categories: (filters: any, fields: string[]) => {
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
    matcher: "/store/products/search",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
      validateAndTransformQuery(
        StoreGetProductsSearchParams,
        SearchQueryConfig.searchProductQueryConfig
      ),
      filterByValidSalesChannels(),
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
      }),
      normalizeDataForContext(),
      setPricingContext(),
      setTaxContext(),
      clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
      // Runs last, once the pricing params the middlewares above read are
      // cleared: whatever is left is a filter the search index can evaluate.
      remapProductSearchFilters(),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/products/:id",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
      validateAndTransformQuery(
        StoreGetProductsParams,
        QueryConfig.retrieveProductQueryConfig
      ),
      applyParamsAsFilters({ id: "id" }),
      filterByValidSalesChannels(),
      applySalesChannelCrossModuleFilter,
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
      }),
      normalizeDataForContext(),
      setPricingContext(),
      setTaxContext(),
      clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
    ],
  },
]
