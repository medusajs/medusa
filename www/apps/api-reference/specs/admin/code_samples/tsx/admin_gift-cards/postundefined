import React from "react"
import { useAdminCreateGiftCard } from "medusa-react"

const CreateCustomGiftCards = () => {
  const createGiftCard = useAdminCreateGiftCard()
  // ...

  const handleCreate = (
    regionId: string,
    value: number
  ) => {
    createGiftCard.mutate({
      region_id: regionId,
      value,
    }, {
      onSuccess: ({ gift_card }) => {
        console.log(gift_card.id)
      }
    })
  }

  // ...
}

export default CreateCustomGiftCards
