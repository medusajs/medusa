import React from "react"
import { useGiftCard } from "medusa-react"

type Props = {
  giftCardCode: string
}

const GiftCard = ({ giftCardCode }: Props) => {
  const { gift_card, isLoading, isError } = useGiftCard(
    giftCardCode
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {gift_card && <span>{gift_card.value}</span>}
      {isError && <span>Gift Card does not exist</span>}
    </div>
  )
}

export default GiftCard
