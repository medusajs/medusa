import {
  AdminCollectionsListRes,
  AdminCollectionsRes,
  AdminGetCollectionsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_COLLECTIONS_QUERY_KEY = `admin_collections` as const

export const adminCollectionKeys = queryKeysFactory(ADMIN_COLLECTIONS_QUERY_KEY)

type CollectionsQueryKey = typeof adminCollectionKeys

/**
 * This hook retrieves a list of product collections. The product collections can be filtered by fields such as `handle` or `title`.
 * The collections can also be sorted or paginated.
 *
 * @example
 * To list product collections:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminCollections } from "medusa-react"
 *
 * const Collections = () => {
 *   const { collections, isLoading } = useAdminCollections()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {collections && !collections.length && <span>
 *         No Product Collections
 *       </span>}
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
 * export default Collections
 * ```
 *
 * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminCollections } from "medusa-react"
 *
 * const Collections = () => {
 *   const { collections, limit, offset, isLoading } = useAdminCollections({
 *     limit: 15,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {collections && !collections.length && <span>
 *         No Product Collections
 *       </span>}
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
 * export default Collections
 * ```
 *
 * @customNamespace Hooks.Admin.Product Collections
 * @category Queries
 */
export const useAdminCollections = (
  /**
   * Filters and pagination configurations to apply on the retrieved product collections.
   */
  query?: AdminGetCollectionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCollectionsListRes>,
    Error,
    ReturnType<CollectionsQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCollectionKeys.list(query),
    queryFn: () => client.admin.collections.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a product collection by its ID. The products associated with it are expanded and returned as well.
 *
 * @example
 * import React from "react"
 * import { useAdminCollection } from "medusa-react"
 *
 * type Props = {
 *   collectionId: string
 * }
 *
 * const Collection = ({ collectionId }: Props) => {
 *   const { collection, isLoading } = useAdminCollection(collectionId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {collection && <span>{collection.title}</span>}
 *     </div>
 *   )
 * }
 *
 * export default Collection
 *
 * @customNamespace Hooks.Admin.Product Collections
 * @category Queries
 */
export const useAdminCollection = (
  /**
   * The product collection's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminCollectionsRes>,
    Error,
    ReturnType<CollectionsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminCollectionKeys.detail(id),
    queryFn: () => client.admin.collections.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
