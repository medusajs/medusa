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

/**
 * This hook retrieves a list of gift cards. The gift cards can be filtered by fields such as `q` passed in the `query`
 * parameter. The gift cards can also paginated.
 *
 * @example
 * To list gift cards:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminGiftCards } from "medusa-react"
 *
 * const CustomGiftCards = () => {
 *   const { gift_cards, isLoading } = useAdminGiftCards()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {gift_cards && !gift_cards.length && (
 *         <span>No custom gift cards...</span>
 *       )}
 *       {gift_cards && gift_cards.length > 0 && (
 *         <ul>
 *           {gift_cards.map((giftCard) => (
 *             <li key={giftCard.id}>{giftCard.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default CustomGiftCards
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminGiftCards } from "medusa-react"
 *
 * const CustomGiftCards = () => {
 *   const {
 *     gift_cards,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminGiftCards({
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {gift_cards && !gift_cards.length && (
 *         <span>No custom gift cards...</span>
 *       )}
 *       {gift_cards && gift_cards.length > 0 && (
 *         <ul>
 *           {gift_cards.map((giftCard) => (
 *             <li key={giftCard.id}>{giftCard.code}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default CustomGiftCards
 * ```
 *
 * @customNamespace Hooks.Admin.Gift Cards
 * @category Queries
 */
export const useAdminGiftCards = (
  /**
   * Filters and pagination configurations to apply on the retrieved gift cards.
   */
  query?: AdminGetGiftCardsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminGiftCardsListRes>,
    Error,
    ReturnType<GiftCardQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminGiftCardKeys.list(query),
    queryFn: () => client.admin.giftCards.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a gift card's details.
 *
 * @example
 * import React from "react"
 * import { useAdminGiftCard } from "medusa-react"
 *
 * type Props = {
 *   giftCardId: string
 * }
 *
 * const CustomGiftCard = ({ giftCardId }: Props) => {
 *   const { gift_card, isLoading } = useAdminGiftCard(giftCardId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {gift_card && <span>{gift_card.code}</span>}
 *     </div>
 *   )
 * }
 *
 * export default CustomGiftCard
 *
 * @customNamespace Hooks.Admin.Gift Cards
 * @category Queries
 */
export const useAdminGiftCard = (
  /**
   * The gift card's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminGiftCardsRes>,
    Error,
    ReturnType<GiftCardQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminGiftCardKeys.detail(id),
    queryFn: () => client.admin.giftCards.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
