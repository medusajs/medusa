import React from "react"
import { useAdminCreateDraftOrder } from "medusa-react"

type DraftOrderData = {
  email: string
  region_id: string
  items: {
    quantity: number,
    variant_id: string
  }[]
  shipping_methods: {
    option_id: string
    price: number
  }[]
}

const CreateDraftOrder = () => {
  const createDraftOrder = useAdminCreateDraftOrder()
  // ...

  const handleCreate = (data: DraftOrderData) => {
    createDraftOrder.mutate(data, {
      onSuccess: ({ draft_order }) => {
        console.log(draft_order.id)
      }
    })
  }

  // ...
}

export default CreateDraftOrder
