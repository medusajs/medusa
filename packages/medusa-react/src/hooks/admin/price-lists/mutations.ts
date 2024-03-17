import {
  AdminDeletePriceListPricesPricesReq,
  AdminDeletePriceListsPriceListProductsPricesBatchReq,
  AdminPostPriceListPricesPricesReq,
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  AdminPriceListDeleteBatchRes,
  AdminPriceListDeleteProductPricesRes,
  AdminPriceListDeleteRes,
  AdminPriceListDeleteVariantPricesRes,
  AdminPriceListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductKeys } from "../products"
import { adminVariantKeys } from "../variants"
import { adminPriceListKeys } from "./queries"

/**
 * This hook creates a price list.
 *
 * @example
 * import React from "react"
 * import {
 *   PriceListStatus,
 *   PriceListType,
 * } from "@medusajs/medusa"
 * import { useAdminCreatePriceList } from "medusa-react"
 *
 * type CreateData = {
 *   name: string
 *   description: string
 *   type: PriceListType
 *   status: PriceListStatus
 *   prices: {
 *     amount: number
 *     variant_id: string
 *     currency_code: string
 *     max_quantity: number
 *   }[]
 * }
 *
 * const CreatePriceList = () => {
 *   const createPriceList = useAdminCreatePriceList()
 *   // ...
 *
 *   const handleCreate = (
 *     data: CreateData
 *   ) => {
 *     createPriceList.mutate(data, {
 *       onSuccess: ({ price_list }) => {
 *         console.log(price_list.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreatePriceList
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminCreatePriceList = (
  options?: UseMutationOptions<
    Response<AdminPriceListRes>,
    Error,
    AdminPostPriceListsPriceListReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostPriceListsPriceListReq) =>
      client.admin.priceLists.create(payload),
    ...buildOptions(queryClient, [adminPriceListKeys.lists()], options),
  })
}

/**
 * This hook updates a price list's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdatePriceList } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceList = ({
 *   priceListId
 * }: Props) => {
 *   const updatePriceList = useAdminUpdatePriceList(priceListId)
 *   // ...
 *
 *   const handleUpdate = (
 *     endsAt: Date
 *   ) => {
 *     updatePriceList.mutate({
 *       ends_at: endsAt,
 *     }, {
 *       onSuccess: ({ price_list }) => {
 *         console.log(price_list.ends_at)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PriceList
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminUpdatePriceList = (
  /**
   * The price list's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPriceListRes>,
    Error,
    AdminPostPriceListsPriceListPriceListReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostPriceListsPriceListPriceListReq) =>
      client.admin.priceLists.update(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminPriceListKeys.detailProducts(id),
      ],
      options
    ),
  })
}

/**
 * This hook deletes a price list and its associated prices.
 *
 * @example
 * import React from "react"
 * import { useAdminDeletePriceList } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceList = ({
 *   priceListId
 * }: Props) => {
 *   const deletePriceList = useAdminDeletePriceList(priceListId)
 *   // ...
 *
 *   const handleDelete = () => {
 *     deletePriceList.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PriceList
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminDeletePriceList = (
  /**
   * The price list's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminPriceListDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.priceLists.delete(id),
    ...buildOptions(
      queryClient,
      [adminPriceListKeys.detail(id), adminPriceListKeys.lists()],
      options
    ),
  })
}

/**
 * This hook adds or updates a list of prices in a price list.
 *
 * @example
 * import React from "react"
 * import { useAdminCreatePriceListPrices } from "medusa-react"
 *
 * type PriceData = {
 *   amount: number
 *   variant_id: string
 *   currency_code: string
 * }
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceList = ({
 *   priceListId
 * }: Props) => {
 *   const addPrices = useAdminCreatePriceListPrices(priceListId)
 *   // ...
 *
 *   const handleAddPrices = (prices: PriceData[]) => {
 *     addPrices.mutate({
 *       prices
 *     }, {
 *       onSuccess: ({ price_list }) => {
 *         console.log(price_list.prices)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PriceList
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminCreatePriceListPrices = (
  /**
   * The price list's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPriceListRes>,
    Error,
    AdminPostPriceListPricesPricesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostPriceListPricesPricesReq) =>
      client.admin.priceLists.addPrices(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminPriceListKeys.detailProducts(id),
      ],
      options
    ),
  })
}

/**
 * This hook deletes a list of prices in a price list.
 *
 * @example
 * import React from "react"
 * import { useAdminDeletePriceListPrices } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceList = ({
 *   priceListId
 * }: Props) => {
 *   const deletePrices = useAdminDeletePriceListPrices(priceListId)
 *   // ...
 *
 *   const handleDeletePrices = (priceIds: string[]) => {
 *     deletePrices.mutate({
 *       price_ids: priceIds
 *     }, {
 *       onSuccess: ({ ids, deleted, object }) => {
 *         console.log(ids)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PriceList
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminDeletePriceListPrices = (
  /**
   * The price list's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPriceListDeleteBatchRes>,
    Error,
    AdminDeletePriceListPricesPricesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeletePriceListPricesPricesReq) =>
      client.admin.priceLists.deletePrices(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminPriceListKeys.detailProducts(id),
      ],
      options
    ),
  })
}

/**
 * This hook deletes all the prices associated with multiple products in a price list.
 *
 * @example
 * import React from "react"
 * import { useAdminDeletePriceListProductsPrices } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 * }
 *
 * const PriceList = ({
 *   priceListId
 * }: Props) => {
 *   const deleteProductsPrices = useAdminDeletePriceListProductsPrices(
 *     priceListId
 *   )
 *   // ...
 *
 *   const handleDeleteProductsPrices = (productIds: string[]) => {
 *     deleteProductsPrices.mutate({
 *       product_ids: productIds
 *     }, {
 *       onSuccess: ({ ids, deleted, object }) => {
 *         console.log(ids)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PriceList
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminDeletePriceListProductsPrices = (
  /**
   * The price list's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPriceListDeleteBatchRes>,
    Error,
    AdminDeletePriceListsPriceListProductsPricesBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      payload: AdminDeletePriceListsPriceListProductsPricesBatchReq
    ) => client.admin.priceLists.deleteProductsPrices(id, payload),
    ...buildOptions(
      queryClient,
      [adminPriceListKeys.detail(id), adminPriceListKeys.lists()],
      options
    ),
  })
}

/**
 * This hook deletes all the prices related to a specific product in a price list.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminDeletePriceListProductPrices
 * } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 *   productId: string
 * }
 *
 * const PriceListProduct = ({
 *   priceListId,
 *   productId
 * }: Props) => {
 *   const deleteProductPrices = useAdminDeletePriceListProductPrices(
 *     priceListId,
 *     productId
 *   )
 *   // ...
 *
 *   const handleDeleteProductPrices = () => {
 *     deleteProductPrices.mutate(void 0, {
 *       onSuccess: ({ ids, deleted, object }) => {
 *         console.log(ids)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PriceListProduct
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminDeletePriceListProductPrices = (
  /**
   * The price list's ID.
   */
  id: string,
  /**
   * The product's ID.
   */
  productId: string,
  options?: UseMutationOptions<
    Response<AdminPriceListDeleteProductPricesRes>,
    Error
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      client.admin.priceLists.deleteProductPrices(id, productId),
    ...buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminProductKeys.detail(productId),
      ],
      options
    ),
  })
}

/**
 * This hook deletes all the prices related to a specific product variant in a price list.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminDeletePriceListVariantPrices
 * } from "medusa-react"
 *
 * type Props = {
 *   priceListId: string
 *   variantId: string
 * }
 *
 * const PriceListVariant = ({
 *   priceListId,
 *   variantId
 * }: Props) => {
 *   const deleteVariantPrices = useAdminDeletePriceListVariantPrices(
 *     priceListId,
 *     variantId
 *   )
 *   // ...
 *
 *   const handleDeleteVariantPrices = () => {
 *     deleteVariantPrices.mutate(void 0, {
 *       onSuccess: ({ ids, deleted, object }) => {
 *         console.log(ids)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PriceListVariant
 *
 * @customNamespace Hooks.Admin.Price Lists
 * @category Mutations
 */
export const useAdminDeletePriceListVariantPrices = (
  /**
   * The price list's ID.
   */
  id: string,
  /**
   * The product variant's ID.
   */
  variantId: string,
  options?: UseMutationOptions<
    Response<AdminPriceListDeleteVariantPricesRes>,
    Error
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      client.admin.priceLists.deleteVariantPrices(id, variantId),
    ...buildOptions(
      queryClient,
      [
        adminPriceListKeys.detail(id),
        adminPriceListKeys.lists(),
        adminVariantKeys.detail(variantId),
      ],
      options
    ),
  })
}
