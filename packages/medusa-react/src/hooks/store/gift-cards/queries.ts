import { StoreGiftCardsRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const GIFT_CARDS_QUERY_KEY = `gift_cards` as const

export const giftCardKeys = queryKeysFactory(GIFT_CARDS_QUERY_KEY)

type GiftCardQueryKey = typeof giftCardKeys

/**
 * This hook retrieves a Gift Card's details by its associated unique code.
 *
 * @example
 * import React from "react"
 * import { useGiftCard } from "medusa-react"
 *
 * type Props = {
 *   giftCardCode: string
 * }
 *
 * const GiftCard = ({ giftCardCode }: Props) => {
 *   const { gift_card, isLoading, isError } = useGiftCard(
 *     giftCardCode
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {gift_card && <span>{gift_card.value}</span>}
 *       {isError && <span>Gift Card does not exist</span>}
 *     </div>
 *   )
 * }
 *
 * export default GiftCard
 *
 * @customNamespace Hooks.Store.Gift Cards
 * @category Queries
 */
export const useGiftCard = (
  /**
   * The gift card's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreGiftCardsRes>,
    Error,
    ReturnType<GiftCardQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: giftCardKeys.detail(id),
    queryFn: () => client.giftCards.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
