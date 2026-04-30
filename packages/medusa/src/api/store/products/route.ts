import { MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes, QueryContextType } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  isPresent,
  QueryContext,
} from "@medusajs/framework/utils"
import IndexEngineFeatureFlag from "../../../feature-flags/index-engine"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "../../utils/middlewares"
import { RequestWithContext, wrapProductsWithTaxPrices } from "./helpers"

/**
 * This API route retrieves a list of products for the storefront based on the
 * provided filters. When the index engine feature flag is enabled, it uses the
 * index for improved performance, except when tag or category filters are used
 * which require falling back to the regular graph query path.
 *
 * The response includes products with calculated prices, tax information, and
 * inventory quantities when requested.
 *
 * @param req - The request object containing filter parameters and context
 * @param res - The response object to send the product list
 * @returns Promise that resolves when the response is sent
 *
 * @example
 * GET /store/products
 * GET /store/products?q=shirt&sales_channel_id=sc_123
 * GET /store/products?tag_id=tag_123&category_id=cat_456
 */
export const GET = async (
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) => {
  const filterableFields: HttpTypes.StoreProductListParams =
    req.filterableFields

  if (FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key)) {
    // TODO: These filters are not supported by the index engine yet
    if (
      isPresent(filterableFields.tag_id) ||
      isPresent(filterableFields.category_id)
    ) {
      return await getProducts(req, res)
    }

    return await getProductsWithIndexEngine(req, res)
  }

  return await getProducts(req, res)
}

async function getProductsWithIndexEngine(
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const context: QueryContextType = {}
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  if (isPresent(req.pricingContext)) {
    context["variants"] ??= {}
    context["variants"]["calculated_price"] ??= QueryContext(
      req.pricingContext!
    )
  }

  const filters: Record<string, any> = req.filterableFields
  if (isPresent(filters.sales_channel_id)) {
    const salesChannelIds = filters.sales_channel_id

    filters["sales_channels"] ??= {}
    filters["sales_channels"]["id"] = salesChannelIds

    delete filters.sales_channel_id
  }

  const { data: products = [], metadata } = await query.index(
    {
      entity: "product",
      fields: req.queryConfig.fields,
      filters,
      pagination: req.queryConfig.pagination,
      context,
    },
    {
      cache: {
        enable: true,
      },
      locale: req.locale,
    }
  )

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      products.map((product) => product.variants).flat(1)
    )
  }

  await wrapProductsWithTaxPrices(req, products)

  res.json({
    products,
    count: metadata!.estimate_count,
    estimate_count: metadata!.estimate_count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}

async function getProducts(
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const context: object = {}
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  if (isPresent(req.pricingContext)) {
    context["variants"] ??= {}
    context["variants"]["calculated_price"] ??= QueryContext(
      req.pricingContext!
    )
  }

  const { data: products = [], metadata } = await query.graph(
    {
      entity: "product",
      fields: req.queryConfig.fields,
      filters: req.filterableFields,
      pagination: req.queryConfig.pagination,
      context,
    },
    {
      cache: {
        enable: true,
      },
      locale: req.locale,
    }
  )

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      products.map((product) => product.variants).flat(1)
    )
  }

  await wrapProductsWithTaxPrices(req, products)

  res.json({
    products,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}
