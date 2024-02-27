import React from "react"
import { useAdminUpdateGiftCard } from "medusa-react"

type Props = {
  customGiftCardId: string
}

const CustomGiftCard = ({ customGiftCardId }: Props) => {
  const updateGiftCard = useAdminUpdateGiftCard(
    customGiftCardId
  )
  // ...

  const handleUpdate = (regionId: string) => {
    updateGiftCard.mutate({
      region_id: regionId,
    }, {
      onSuccess: ({ gift_card }) => {
        console.log(gift_card.id)
      }
    })
  }

  // ...
}

export default CustomGiftCard
