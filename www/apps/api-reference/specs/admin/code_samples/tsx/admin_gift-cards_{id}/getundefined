import React from "react"
import { useAdminGiftCard } from "medusa-react"

type Props = {
  giftCardId: string
}

const CustomGiftCard = ({ giftCardId }: Props) => {
  const { gift_card, isLoading } = useAdminGiftCard(giftCardId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {gift_card && <span>{gift_card.code}</span>}
    </div>
  )
}

export default CustomGiftCard
