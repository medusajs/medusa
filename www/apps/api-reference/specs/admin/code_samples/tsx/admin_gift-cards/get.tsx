import React from "react"
import { GiftCard } from "@medusajs/medusa"
import { useAdminGiftCards } from "medusa-react"

const CustomGiftCards = () => {
  const { gift_cards, isLoading } = useAdminGiftCards()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {gift_cards && !gift_cards.length && (
        <span>No custom gift cards...</span>
      )}
      {gift_cards && gift_cards.length > 0 && (
        <ul>
          {gift_cards.map((giftCard: GiftCard) => (
            <li key={giftCard.id}>{giftCard.code}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomGiftCards
