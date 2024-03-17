import {
  AdminCollectionsDeleteRes,
  AdminCollectionsRes,
  AdminDeleteProductsFromCollectionReq,
  AdminDeleteProductsFromCollectionRes,
  AdminPostCollectionsCollectionReq,
  AdminPostCollectionsReq,
  AdminPostProductsToCollectionReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminCollectionKeys } from "./queries"

/**
 * This hook creates a product collection.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateCollection } from "medusa-react"
 *
 * const CreateCollection = () => {
 *   const createCollection = useAdminCreateCollection()
 *   // ...
 *
 *   const handleCreate = (title: string) => {
 *     createCollection.mutate({
 *       title
 *     }, {
 *       onSuccess: ({ collection }) => {
 *         console.log(collection.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateCollection
 *
 * @customNamespace Hooks.Admin.Product Collections
 * @category Mutations
 */
export const useAdminCreateCollection = (
  options?: UseMutationOptions<
    Response<AdminCollectionsRes>,
    Error,
    AdminPostCollectionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostCollectionsReq) =>
      client.admin.collections.create(payload),
    ...buildOptions(queryClient, adminCollectionKeys.lists(), options),
  })
}

/**
 * This hook updates a product collection's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateCollection } from "medusa-react"
 *
 * type Props = {
 *   collectionId: string
 * }
 *
 * const Collection = ({ collectionId }: Props) => {
 *   const updateCollection = useAdminUpdateCollection(collectionId)
 *   // ...
 *
 *   const handleUpdate = (title: string) => {
 *     updateCollection.mutate({
 *       title
 *     }, {
 *       onSuccess: ({ collection }) => {
 *         console.log(collection.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Collection
 *
 * @customNamespace Hooks.Admin.Product Collections
 * @category Mutations
 */
export const useAdminUpdateCollection = (
  /**
   * The product collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminCollectionsRes>,
    Error,
    AdminPostCollectionsCollectionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostCollectionsCollectionReq) =>
      client.admin.collections.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a product collection. This does not delete associated products.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteCollection } from "medusa-react"
 *
 * type Props = {
 *   collectionId: string
 * }
 *
 * const Collection = ({ collectionId }: Props) => {
 *   const deleteCollection = useAdminDeleteCollection(collectionId)
 *   // ...
 *
 *   const handleDelete = (title: string) => {
 *     deleteCollection.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Collection
 *
 * @customNamespace Hooks.Admin.Product Collections
 * @category Mutations
 */
export const useAdminDeleteCollection = (
  /**
   * The product collection's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminCollectionsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => client.admin.collections.delete(id),
    ...buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook adds products to a collection.
 *
 * @example
 * import React from "react"
 * import { useAdminAddProductsToCollection } from "medusa-react"
 *
 * type Props = {
 *   collectionId: string
 * }
 *
 * const Collection = ({ collectionId }: Props) => {
 *   const addProducts = useAdminAddProductsToCollection(collectionId)
 *   // ...
 *
 *   const handleAddProducts = (productIds: string[]) => {
 *     addProducts.mutate({
 *       product_ids: productIds
 *     }, {
 *       onSuccess: ({ collection }) => {
 *         console.log(collection.products)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Collection
 *
 * @customNamespace Hooks.Admin.Product Collections
 * @category Mutations
 */
export const useAdminAddProductsToCollection = (
  /**
   * The product collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminCollectionsRes>,
    Error,
    AdminPostProductsToCollectionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostProductsToCollectionReq) =>
      client.admin.collections.addProducts(id, payload),
    ...buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook removes a list of products from a collection. This would not delete the product,
 * only the association between the product and the collection.
 *
 * @example
 * import React from "react"
 * import { useAdminRemoveProductsFromCollection } from "medusa-react"
 *
 * type Props = {
 *   collectionId: string
 * }
 *
 * const Collection = ({ collectionId }: Props) => {
 *   const removeProducts = useAdminRemoveProductsFromCollection(collectionId)
 *   // ...
 *
 *   const handleRemoveProducts = (productIds: string[]) => {
 *     removeProducts.mutate({
 *       product_ids: productIds
 *     }, {
 *       onSuccess: ({ id, object, removed_products }) => {
 *         console.log(removed_products)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Collection
 *
 * @customNamespace Hooks.Admin.Product Collections
 * @category Mutations
 */
export const useAdminRemoveProductsFromCollection = (
  /**
   * The product collection's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminDeleteProductsFromCollectionRes>,
    Error,
    AdminDeleteProductsFromCollectionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeleteProductsFromCollectionReq) =>
      client.admin.collections.removeProducts(id, payload),
    ...buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    ),
  })
}
