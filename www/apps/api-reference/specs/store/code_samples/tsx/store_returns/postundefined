import React from "react"
import { useCreateReturn } from "medusa-react"

type CreateReturnData = {
  items: {
    item_id: string,
    quantity: number
  }[]
  return_shipping: {
    option_id: string
  }
}

type Props = {
  orderId: string
}

const CreateReturn = ({ orderId }: Props) => {
  const createReturn = useCreateReturn()
  // ...

  const handleCreate = (data: CreateReturnData) => {
    createReturn.mutate({
      ...data,
      order_id: orderId
    }, {
      onSuccess: ({ return: returnData }) => {
        console.log(returnData.id)
      }
    })
  }

  // ...
}

export default CreateReturn
