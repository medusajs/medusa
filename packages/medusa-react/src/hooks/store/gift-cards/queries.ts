import { StoreGiftCardsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const GIFT_CARDS_QUERY_KEY = `gift_cards` as const

export const giftCardKeys = queryKeysFactory(GIFT_CARDS_QUERY_KEY)

type GiftCardQueryKey = typeof giftCardKeys

export const useGiftCard = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreGiftCardsRes>,
    Error,
    ReturnType<GiftCardQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    giftCardKeys.detail(id),
    () => client.giftCards.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
