import { createProductsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
  searchEntityWithGraphFallback,
} from "@medusajs/framework/http"
import {
  AdditionalData,
  HttpTypes,
  ProductDTO,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  isPresent,
} from "@medusajs/framework/utils"
import IndexEngineFeatureFlag from "../../../feature-flags/index-engine"
import { remapKeysForProduct, remapProductResponse } from "./helpers"

const PRODUCT_SEARCH_INDEX = "product"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductListParams>,
  res: MedusaResponse<HttpTypes.AdminProductListResponse>
) => {
  if (FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key)) {
    // Use regular list when no filters are provided
    // TODO: Tags and categories are not supported by the index engine yet
    if (
      Object.keys(req.filterableFields).length === 0 ||
      isPresent(req.filterableFields.tags) ||
      isPresent(req.filterableFields.categories) ||
      isPresent(req.filterableFields.option_value_id) ||
      isPresent(req.filterableFields.options)
    ) {
      return await getProducts(req, res)
    }

    return await getProductsWithIndexEngine(req, res)
  }

  return await getProducts(req, res)
}

async function getProducts(
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductListParams>,
  res: MedusaResponse<HttpTypes.AdminProductListResponse>
) {
  // Reads from the Search Module when it holds a product index that can answer
  // the request, and from the database otherwise. Same shape either way.
  const { data, count, offset, limit } =
    await searchEntityWithGraphFallback<ProductDTO>({
    entity: "product",
    index: PRODUCT_SEARCH_INDEX,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
    withDeleted: req.queryConfig.withDeleted,
  })

  res.json({
    products: data.map(remapProductResponse),
    count,
    offset,
    limit,
  })
}

async function getProductsWithIndexEngine(
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductListParams>,
  res: MedusaResponse<HttpTypes.AdminProductListResponse>
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const filters: Record<string, any> = req.filterableFields
  if (isPresent(filters.sales_channel_id)) {
    const salesChannelIds = filters.sales_channel_id

    filters["sales_channels"] ??= {}
    filters["sales_channels"]["id"] = salesChannelIds

    delete filters.sales_channel_id
  }

  if (isPresent(filters.price_list_id)) {
    const priceListIds = filters.price_list_id

    filters["variants"] ??= {}
    filters["variants"]["prices"] ??= {}
    filters["variants"]["prices"]["price_list_id"] = priceListIds

    delete filters.price_list_id
  }

  // TODO: Remove once we implement search by relations in a similar way to query.graph
  if (isPresent(filters.q)) {
    filters["variants"] ??= {}
  }

  const { data: products, metadata } = await query.index({
    entity: "product",
    fields: req.queryConfig.fields ?? [],
    filters: filters,
    pagination: req.queryConfig.pagination,
    withDeleted: req.queryConfig.withDeleted,
  })

  res.json({
    products: products.map(remapProductResponse),
    count: metadata!.estimate_count,
    estimate_count: metadata!.estimate_count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateProduct & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const { additional_data, ...products } = req.validatedBody

  const { result } = await createProductsWorkflow(req.scope).run({
    input: { products: [products], additional_data },
  })

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })

  res.status(200).json({ product: remapProductResponse(product) })
}
