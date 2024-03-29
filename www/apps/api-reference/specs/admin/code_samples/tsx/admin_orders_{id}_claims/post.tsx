import React from "react"
import { useAdminCreateClaim } from "medusa-react"

type Props = {
  orderId: string
}

const CreateClaim = ({ orderId }: Props) => {

const CreateClaim = (orderId: string) => {
  const createClaim = useAdminCreateClaim(orderId)
  // ...

  const handleCreate = (itemId: string) => {
    createClaim.mutate({
      type: "refund",
      claim_items: [
        {
          item_id: itemId,
          quantity: 1,
        },
      ],
    }, {
      onSuccess: ({ order }) => {
        console.log(order.claims)
      }
    })
  }

  // ...
}

export default CreateClaim
