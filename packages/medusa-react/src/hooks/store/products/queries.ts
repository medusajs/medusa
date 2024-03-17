import {
  StoreGetProductsParams,
  StoreProductsListRes,
  StoreProductsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const PRODUCTS_QUERY_KEY = `products` as const

export const productKeys =
  queryKeysFactory<typeof PRODUCTS_QUERY_KEY, StoreGetProductsParams>(
    PRODUCTS_QUERY_KEY
  )
type ProductQueryKey = typeof productKeys

/**
 * This hook retrieves a list of products. The products can be filtered by fields such as `id` or `q` passed in the `query` parameter. The products can also be sorted or paginated.
 * This hook can also be used to retrieve a product by its handle.
 *
 * For accurate and correct pricing of the products based on the customer's context, it's highly recommended to pass fields such as
 * `region_id`, `currency_code`, and `cart_id` when available.
 *
 * Passing `sales_channel_id` ensures retrieving only products available in the specified sales channel.
 * You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
 *
 * @example
 * To list products:
 *
 * ```tsx
 * import React from "react"
 * import { useProducts } from "medusa-react"
 *
 * const Products = () => {
 *   const { products, isLoading } = useProducts()
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
 * import { useProducts } from "medusa-react"
 *
 * const Products = () => {
 *   const { products, isLoading } = useProducts({
 *     expand: "variants"
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
 * By default, only the first `100` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useProducts } from "medusa-react"
 *
 * const Products = () => {
 *   const {
 *     products,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useProducts({
 *     expand: "variants",
 *     limit: 50,
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
 * @customNamespace Hooks.Store.Products
 * @category Queries
 */
export const useProducts = (
  /**
   * Filters and pagination configurations to apply on the retrieved products.
   */
  query?: StoreGetProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductsListRes>,
    Error,
    ReturnType<ProductQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => client.products.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a Product's details. For accurate and correct pricing of the product based on the customer's context, it's highly recommended to pass fields such as
 * `region_id`, `currency_code`, and `cart_id` when available.
 *
 * Passing `sales_channel_id` ensures retrieving only products available in the current sales channel.
 * You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
 *
 * @example
 * import React from "react"
 * import { useProduct } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 * }
 *
 * const Product = ({ productId }: Props) => {
 *   const { product, isLoading } = useProduct(productId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {product && <span>{product.title}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Product
 *
 * @customNamespace Hooks.Store.Products
 * @category Queries
 */
export const useProduct = (
  /**
   * The product's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreProductsRes>,
    Error,
    ReturnType<ProductQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => client.products.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}
