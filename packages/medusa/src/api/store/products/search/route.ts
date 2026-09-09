import { MedusaResponse } from "@medusajs/framework/http"
import {
  HttpTypes,
  QueryContextType,
  SearchTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  QueryContext,
  isPresent,
} from "@medusajs/framework/utils"
import {
  prepareInventoryQuantityFields,
  wrapVariantsWithInventoryQuantityForSalesChannel,
} from "../../../utils/middlewares"
import { RequestWithContext, wrapProductsWithTaxPrices } from "../helpers"
import { StoreGetProductsSearchParamsType } from "./validators"

const PRODUCT_SEARCH_INDEX = "product"

export const GET = async (
  req: RequestWithContext<void, StoreGetProductsSearchParamsType>,
  res: MedusaResponse<HttpTypes.StoreProductSearchResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const searchModule = req.scope.resolve(Modules.SEARCH, {
    allowUnregistered: true,
  })

  if (!searchModule) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "The Search Module is not installed, so products cannot be searched. Use /store/products instead."
    )
  }

  const retrievable = new Set(
    searchModule.listRetrievableFields(PRODUCT_SEARCH_INDEX)
  )

  const { fields, withInventoryQuantity } = prepareInventoryQuantityFields(
    req.queryConfig.fields,
    { relation: "variants" }
  )

  // Everything the index can return is served by the engine; the rest is what
  // `query.search` will hydrate through `query.graph`.
  const withHydration = fields.some((field) => !retrievable.has(field))

  const context: QueryContextType = {}
  if (withHydration && isPresent(req.pricingContext)) {
    context["variants"] ??= {}
    context["variants"]["calculated_price"] ??= QueryContext(
      req.pricingContext!
    )
  }

  const { data: products = [], search_result: searchResult } =
    await query.search(
      {
        entity: PRODUCT_SEARCH_INDEX,
        fields,
        // Validated by the route's schema and mapped onto the index' fields by
        // its middlewares, so they reach the engine as they are.
        filters: req.filterableFields as SearchTypes.SearchFilters,
        pagination: {
          skip: req.queryConfig.pagination.skip,
          take: req.queryConfig.pagination.take,
          order: buildSearchOrder(req.validatedQuery.order),
        },
        context: withHydration ? context : undefined,
      },
      // Only reaches the hydration: what the index itself returns is whatever
      // the seed wrote, so an index that has to serve several locales stores
      // them as its own fields.
      { locale: req.locale }
    )

  if (withHydration) {
    if (withInventoryQuantity) {
      await wrapVariantsWithInventoryQuantityForSalesChannel(
        req,
        products.flatMap((product) => product.variants ?? [])
      )
    }

    await wrapProductsWithTaxPrices(req, products)
  }

  res.json({
    products,
    // Most engines only estimate a total, and one asked for no count at all
    // reports `null` — neither is a number the response can promise.
    count: searchResult.metadata.count ?? products.length,
    offset: searchResult.metadata.skip,
    limit: searchResult.metadata.take,
  })
}

/**
 * `order=-title` sorts descending, `order=title` ascending. Left unset, the
 * engine orders by relevance.
 */
function buildSearchOrder(
  order?: string
): Record<string, SearchTypes.SearchOrderBy> | undefined {
  if (!order) {
    return undefined
  }

  return order.startsWith("-")
    ? { [order.slice(1)]: "DESC" }
    : { [order]: "ASC" }
}
