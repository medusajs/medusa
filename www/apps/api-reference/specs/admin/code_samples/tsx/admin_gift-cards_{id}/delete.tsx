import React from "react"
import { useAdminDeleteGiftCard } from "medusa-react"

type Props = {
  customGiftCardId: string
}

const CustomGiftCard = ({ customGiftCardId }: Props) => {
  const deleteGiftCard = useAdminDeleteGiftCard(
    customGiftCardId
  )
  // ...

  const handleDelete = () => {
    deleteGiftCard.mutate(void 0, {
      onSuccess: ({ id, object, deleted}) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default CustomGiftCard
