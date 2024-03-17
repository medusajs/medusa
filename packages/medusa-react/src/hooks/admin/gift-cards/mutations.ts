import {
  AdminGiftCardsDeleteRes,
  AdminGiftCardsRes,
  AdminPostGiftCardsGiftCardReq,
  AdminPostGiftCardsReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminGiftCardKeys } from "./queries"

/**
 * This hook creates a gift card that can redeemed by its unique code. The Gift Card is only valid within one region.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateGiftCard } from "medusa-react"
 *
 * const CreateCustomGiftCards = () => {
 *   const createGiftCard = useAdminCreateGiftCard()
 *   // ...
 *
 *   const handleCreate = (
 *     regionId: string,
 *     value: number
 *   ) => {
 *     createGiftCard.mutate({
 *       region_id: regionId,
 *       value,
 *     }, {
 *       onSuccess: ({ gift_card }) => {
 *         console.log(gift_card.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateCustomGiftCards
 *
 * @customNamespace Hooks.Admin.Gift Cards
 * @category Mutations
 */
export const useAdminCreateGiftCard = (
  options?: UseMutationOptions<
    Response<AdminGiftCardsRes>,
    Error,
    AdminPostGiftCardsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostGiftCardsReq) =>
      client.admin.giftCards.create(payload),
    ...buildOptions(queryClient, adminGiftCardKeys.lists(), options),
  })
}

/**
 * This hook updates a gift card's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateGiftCard } from "medusa-react"
 *
 * type Props = {
 *   customGiftCardId: string
 * }
 *
 * const CustomGiftCard = ({ customGiftCardId }: Props) => {
 *   const updateGiftCard = useAdminUpdateGiftCard(
 *     customGiftCardId
 *   )
 *   // ...
 *
 *   const handleUpdate = (regionId: string) => {
 *     updateGiftCard.mutate({
 *       region_id: regionId,
 *     }, {
 *       onSuccess: ({ gift_card }) => {
 *         console.log(gift_card.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CustomGiftCard
 *
 * @customNamespace Hooks.Admin.Gift Cards
 * @category Mutations
 */
export const useAdminUpdateGiftCard = (
  /**
   * The gift card's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminGiftCardsRes>,
    Error,
    AdminPostGiftCardsGiftCardReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostGiftCardsGiftCardReq) =>
      client.admin.giftCards.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminGiftCardKeys.lists(), adminGiftCardKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a gift card. Once deleted, it can't be used by customers.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteGiftCard } from "medusa-react"
 *
 * type Props = {
 *   customGiftCardId: string
 * }
 *
 * const CustomGiftCard = ({ customGiftCardId }: Props) => {
 *   const deleteGiftCard = useAdminDeleteGiftCard(
 *     customGiftCardId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteGiftCard.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted}) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CustomGiftCard
 *
 * @customNamespace Hooks.Admin.Gift Cards
 * @category Mutations
 */
export const useAdminDeleteGiftCard = (
  /**
   * The gift card's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminGiftCardsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => client.admin.giftCards.delete(id),
    ...buildOptions(
      queryClient,
      [adminGiftCardKeys.lists(), adminGiftCardKeys.detail(id)],
      options
    ),
  })
}
