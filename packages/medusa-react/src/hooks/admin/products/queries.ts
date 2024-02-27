import {
  AdminGetProductParams,
  AdminGetProductsParams,
  AdminGetProductsVariantsParams,
  AdminProductsListRes,
  AdminProductsListTagsRes,
  AdminProductsListVariantsRes,
  AdminProductsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_PRODUCTS_QUERY_KEY = `admin_products` as const

export const adminProductKeys = {
  ...queryKeysFactory(ADMIN_PRODUCTS_QUERY_KEY),
  detailVariants(id: string, query?: any) {
    return [
      ...this.detail(id),
      "variants" as const,
      { ...(query || {}) },
    ] as const
  },
}

type ProductQueryKeys = typeof adminProductKeys

/**
 * This hook retrieves a list of products. The products can be filtered by fields such as `q` or `status` passed in
 * the `query` parameter. The products can also be sorted or paginated.
 *
 * @example
 * To list products:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProducts } from "medusa-react"
 *
 * const Products = () => {
 *   const { products, isLoading } = useAdminProducts()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {products && !products.length && <span>No Products</span>}
 *       {products && products.length > 0 && (
 *         <ul>
 *           {products.map((product) => (
 *             <li key={product.id}>{product.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Products
 * ```
 *
 * To specify relations that should be retrieved within the products:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProducts } from "medusa-react"
 *
 * const Products = () => {
 *   const { products, isLoading } = useAdminProducts({
 *     expand: "images"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {products && !products.length && <span>No Products</span>}
 *       {products && products.length > 0 && (
 *         <ul>
 *           {products.map((product) => (
 *             <li key={product.id}>{product.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Products
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminProducts } from "medusa-react"
 *
 * const Products = () => {
 *   const {
 *     products,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminProducts({
 *     expand: "images",
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {products && !products.length && <span>No Products</span>}
 *       {products && products.length > 0 && (
 *         <ul>
 *           {products.map((product) => (
 *             <li key={product.id}>{product.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Products
 * ```
 *
 * @customNamespace Hooks.Admin.Products
 * @category Queries
 */
export const useAdminProducts = (
  /**
   * Filters and pagination configurations to apply on the retrieved products.
   */
  query?: AdminGetProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListRes>,
    Error,
    ReturnType<ProductQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.list(query),
    () => client.admin.products.list(query),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a product's details.
 *
 * @example
 * import React from "react"
 * import { useAdminProduct } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 * }
 *
 * const Product = ({ productId }: Props) => {
 *   const {
 *     product,
 *     isLoading,
 *   } = useAdminProduct(productId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product && <span>{product.title}</span>}
 *
 *     </div>
 *   )
 * }
 *
 * export default Product
 *
 * @customNamespace Hooks.Admin.Products
 * @category Queries
 */
export const useAdminProduct = (
  /**
   * The product's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved product.
   */
  query?: AdminGetProductParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsRes>,
    Error,
    ReturnType<ProductQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.detail(id),
    () => client.admin.products.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminProductVariants = (
  /**
   * The product's ID.
   */
  id: string,
  /**
   * Configurations to apply on the retrieved product variants.
   */
  query?: AdminGetProductsVariantsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListVariantsRes>,
    Error,
    ReturnType<ProductQueryKeys["detailVariants"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.detailVariants(id, query),
    () => client.admin.products.listVariants(id, query),
    options
  )
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of Product Tags with how many times each is used in products.
 *
 * @example
 * import React from "react"
 * import { useAdminProductTagUsage } from "medusa-react"
 *
 * const ProductTags = (productId: string) => {
 *   const { tags, isLoading } = useAdminProductTagUsage()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {tags && !tags.length && <span>No Product Tags</span>}
 *       {tags && tags.length > 0 && (
 *         <ul>
 *           {tags.map((tag) => (
 *             <li key={tag.id}>{tag.value} - {tag.usage_count}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ProductTags
 *
 * @customNamespace Hooks.Admin.Products
 * @category Queries
 */
export const useAdminProductTagUsage = (
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListTagsRes>,
    Error,
    ReturnType<ProductQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.detail("tags"),
    () => client.admin.products.listTags(),
    options
  )
  return { ...data, ...rest } as const
}
