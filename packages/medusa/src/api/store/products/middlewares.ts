import { validateAndTransformQuery } from "@medusajs/framework"
import {
  applyDefaultFilters,
  applyParamsAsFilters,
  authenticate,
  clearFiltersByKey,
  maybeApplyLinkFilter,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareRoute,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  isPresent,
  ProductStatus,
} from "@medusajs/framework/utils"
import IndexEngineFeatureFlag from "../../../feature-flags/index-engine"
import {
  filterByValidSalesChannels,
  normalizeDataForContext,
  setPricingContext,
  setTaxContext,
} from "../../utils/middlewares"
import * as QueryConfig from "./query-config"
import { StoreGetProductsParams } from "./validators"

async function applyMaybeLinkFilterIfNecessary(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const canUseIndex = !(
    isPresent(req.filterableFields.tags) ||
    isPresent(req.filterableFields.categories)
  )
  if (FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key) && canUseIndex) {
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

  return maybeApplyLinkFilter({
    entryPoint: "product_sales_channel",
    resourceId: "product_id",
    filterableField: "sales_channel_id",
  })(req, res, next)
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
      applyMaybeLinkFilterIfNecessary,
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
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
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
