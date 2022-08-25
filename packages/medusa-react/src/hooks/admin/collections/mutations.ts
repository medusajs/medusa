import {
  AdminCollectionsDeleteRes,
  AdminCollectionsRes,
  AdminDeleteProductsFromCollectionReq,
  AdminPostCollectionsCollectionReq,
  AdminPostCollectionsReq,
  AdminPostProductsToCollectionReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { adminCollectionKeys } from "."
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"

export const useAdminCreateCollection = (
  options?: UseMutationOptions<
    Response<AdminCollectionsRes>,
    Error,
    AdminPostCollectionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostCollectionsReq) =>
      client.admin.collections.create(payload),
    buildOptions(queryClient, adminCollectionKeys.lists(), options)
  )
}

export const useAdminUpdateCollection = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCollectionsRes>,
    Error,
    AdminPostCollectionsCollectionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostCollectionsCollectionReq) =>
      client.admin.collections.update(id, payload),
    buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteCollection = (
  id: string,
  options?: UseMutationOptions<Response<AdminCollectionsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    () => client.admin.collections.delete(id),
    buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    )
  )
}


/**
 * Hook returns function for adding multiple products to a collection.
 *
 * @param id - id of the collection in which products are being added
 * @param options
 */
export const useAdminAddProductsToCollection = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCollectionsRes>,
    Error,
    AdminPostProductsToCollectionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostProductsToCollectionReq) =>
      client.admin.collections.addProducts(id, payload),
    buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    )
  )
}

/**
 * Hook returns function for removal of multiple products from a collection.
 *
 * @param id - id of the collection from which products will be removed
 * @param options
 */
export const useAdminRemoveProductsFromCollection = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminCollectionsDeleteRes>,
    Error,
    AdminDeleteProductsFromCollectionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminDeleteProductsFromCollectionReq) =>
      client.admin.collections.removeProducts(id, payload),
    buildOptions(
      queryClient,
      [adminCollectionKeys.lists(), adminCollectionKeys.detail(id)],
      options
    )
  )
}
