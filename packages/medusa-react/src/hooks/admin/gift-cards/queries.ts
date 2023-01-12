import {
  AdminGetGiftCardsParams,
  AdminGiftCardsListRes,
  AdminGiftCardsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_GIFT_CARDS_QUERY_KEY = `admin_gift_cards` as const

export const adminGiftCardKeys = queryKeysFactory(ADMIN_GIFT_CARDS_QUERY_KEY)

type GiftCardQueryKeys = typeof adminGiftCardKeys

export const useAdminGiftCards = (
  query?: AdminGetGiftCardsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminGiftCardsListRes>,
    Error,
    ReturnType<GiftCardQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminGiftCardKeys.list(query),
    () => client.admin.giftCards.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminGiftCard = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminGiftCardsRes>,
    Error,
    ReturnType<GiftCardQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminGiftCardKeys.detail(id),
    () => client.admin.giftCards.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
