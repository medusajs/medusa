import { FindConfig } from "@medusajs/framework/types"
import {
  ProductsQueryContextKey,
  ProductStatus,
  PublishedProductsContextKey,
} from "@medusajs/framework/utils"

const PRODUCTS_RELATION = "products"

export const extractPublishedProductsContext = <
  TFilters extends Record<string, any> | undefined
>(
  filters: TFilters
): { filters: TFilters; publishedOnly: boolean } => {
  const context = filters?.context

  if (!context) {
    return { filters, publishedOnly: false }
  }

  const { context: _context, ...rest } = filters as Record<string, any>

  return {
    filters: rest as TFilters,
    publishedOnly:
      !!context[ProductsQueryContextKey]?.[PublishedProductsContextKey],
  }
}

export const applyPublishedProductsPopulateWhere = <
  TConfig extends FindConfig<any> | undefined
>(
  config: TConfig,
  publishedOnly: boolean
): TConfig => {
  if (!publishedOnly) {
    return config
  }

  const productPaths = (config?.relations ?? []).filter(
    (relation) =>
      relation === PRODUCTS_RELATION ||
      relation.split(".").includes(PRODUCTS_RELATION)
  )

  if (!productPaths.length) {
    return config
  }

  const populateWhere: Record<string, any> = {
    ...((config as any)?.options?.populateWhere ?? {}),
  }

  for (const productPath of productPaths) {
    // Only constrain up to the products segment; anything deeper hangs off a
    // product that is already constrained.
    const segments = productPath.split(".")
    const productsAt = segments.indexOf(PRODUCTS_RELATION)

    let node = populateWhere
    for (const segment of segments.slice(0, productsAt)) {
      node[segment] ??= {}
      node = node[segment]
    }

    node[PRODUCTS_RELATION] = {
      ...(node[PRODUCTS_RELATION] ?? {}),
      status: ProductStatus.PUBLISHED,
    }
  }

  return {
    ...config,
    options: {
      ...(config as any)?.options,
      populateWhere,
    },
  } as TConfig
}

export const applyPublishedProductsContext = <
  TFilters extends Record<string, any> | undefined,
  TConfig extends FindConfig<any> | undefined
>(
  filters: TFilters,
  config: TConfig
): { filters: TFilters; config: TConfig } => {
  const { filters: cleanedFilters, publishedOnly } =
    extractPublishedProductsContext(filters)

  return {
    filters: cleanedFilters,
    config: applyPublishedProductsPopulateWhere(config, publishedOnly),
  }
}
