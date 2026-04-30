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
 * This API route retrieves a list of products based on the provided filters.
 * When the index engine feature flag is enabled, it uses the index for improved
 * performance, except when tags or categories filters are used which require
 * falling back to the regular query path.
 *
 * @param req - The authenticated request object containing filter parameters
 * @param res - The response object to send the product list
 * @returns Promise that resolves when the response is sent
 *
 * @example
 * GET /admin/products
 * GET /admin/products?q=shirt
 * GET /admin/products?price_list_id=plist_123
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
 * This API route creates a new product using the provided product data.
 * It runs the create products workflow and returns the newly created product
 * with the specified fields.
 *
 * @param req - The authenticated request object containing product creation data
 * @param res - The response object to send the created product
 * @returns Promise that resolves when the response is sent
 *
 * @example
 * POST /admin/products
 * {
 *   "title": "Sample Product",
 *   "handle": "sample-product",
 *   "description": "A sample product"
 * }
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
