import {
  StoreCollectionsListRes,
  StoreCollectionsRes,
  StoreGetCollectionsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const COLLECTIONS_QUERY_KEY = `collections` as const

export const collectionKeys = queryKeysFactory(COLLECTIONS_QUERY_KEY)

type CollectionQueryKey = typeof collectionKeys

/**
 * This hook retrieves a product collection's details.
 *
 * @example
 * import React from "react"
 * import { useCollection } from "medusa-react"
 *
 * type Props = {
 *   collectionId: string
 * }
 *
 * const ProductCollection = ({ collectionId }: Props) => {
 *   const { collection, isLoading } = useCollection(collectionId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {collection && <span>{collection.title}</span>}
 *     </div>
 *   )
 * }
 *
 * export default ProductCollection
 *
 * @customNamespace Hooks.Store.Product Collections
 * @category Queries
 */
export const useCollection = (
  /**
   * The product collection's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreCollectionsRes>,
    Error,
    ReturnType<CollectionQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => client.collections.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of product collections. The product collections can be filtered by fields such as `handle` or `created_at` passed in the `query` parameter.
 * The product collections can also be paginated.
 *
 * @example
 * To list product collections:
 *
 * ```tsx
 * import React from "react"
 * import { useCollections } from "medusa-react"
 *
 * const ProductCollections = () => {
 *   const { collections, isLoading } = useCollections()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {collections && collections.length === 0 && (
 *         <span>No Product Collections</span>
 *       )}
 *       {collections && collections.length > 0 && (
 *         <ul>
 *           {collections.map((collection) => (
 *             <li key={collection.id}>{collection.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ProductCollections
 * ```
 *
 * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useCollections } from "medusa-react"
 *
 * const ProductCollections = () => {
 *   const {
 *     collections,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useCollections({
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {collections && collections.length === 0 && (
 *         <span>No Product Collections</span>
 *       )}
 *       {collections && collections.length > 0 && (
 *         <ul>
 *           {collections.map((collection) => (
 *             <li key={collection.id}>{collection.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default ProductCollections
 * ```
 *
 * @customNamespace Hooks.Store.Product Collections
 * @category Queries
 */
export const useCollections = (
  /**
   * Filters and pagination configurations to apply on the retrieved product collections.
   */
  query?: StoreGetCollectionsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreCollectionsListRes>,
    Error,
    ReturnType<CollectionQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: collectionKeys.list(query),
    queryFn: () => client.collections.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
