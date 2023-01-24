import {
  AdminGiftCardsDeleteRes,
  AdminGiftCardsRes,
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

export const useAdminCreateGiftCard = (
  options?: UseMutationOptions<
    Response<AdminGiftCardsRes>,
    Error,
    AdminPostGiftCardsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostGiftCardsReq) => client.admin.giftCards.create(payload),
    buildOptions(queryClient, adminGiftCardKeys.lists(), options)
  )
}

export const useAdminUpdateGiftCard = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminGiftCardsRes>,
    Error,
    AdminPostGiftCardsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostGiftCardsReq) =>
      client.admin.giftCards.update(id, payload),
    buildOptions(
      queryClient,
      [adminGiftCardKeys.lists(), adminGiftCardKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteGiftCard = (
  id: string,
  options?: UseMutationOptions<Response<AdminGiftCardsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    () => client.admin.giftCards.delete(id),
    buildOptions(
      queryClient,
      [adminGiftCardKeys.lists(), adminGiftCardKeys.detail(id)],
      options
    )
  )
}
