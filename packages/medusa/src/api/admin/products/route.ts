import { createProductsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
  refetchEntity,
} from "@medusajs/framework/http"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  isPresent,
} from "@medusajs/framework/utils"
import IndexEngineFeatureFlag from "../../../feature-flags/index-engine"
import { remapKeysForProduct, remapProductResponse } from "./helpers"

/**
 * Retrieve a list of products for admin access. Supports both regular query 
 * and index engine for enhanced filtering and search capabilities.
 * 
 * @param req - The authenticated request containing list parameters
 * @param res - The response object
 * 
 * @see {@link https://docs.medusajs.com/api/admin#products_getproducts | API Reference}
 */
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
      isPresent(req.filterableFields.categories)
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
  const selectFields = remapKeysForProduct(req.queryConfig.fields ?? [])

  const { data: products, metadata } = await refetchEntities({
    entity: "product",
    idOrFilter: req.filterableFields,
    scope: req.scope,
    fields: selectFields,
    pagination: req.queryConfig.pagination,
    withDeleted: req.queryConfig.withDeleted,
  })

  res.json({
    products: products.map(remapProductResponse),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
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

/**
 * Create a new product with the provided data.
 * 
 * @param req - The authenticated request containing product creation data and additional data
 * @param res - The response object containing the created product
 * 
 * @see {@link https://docs.medusajs.com/api/admin#products_postproducts | API Reference}
 */
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
