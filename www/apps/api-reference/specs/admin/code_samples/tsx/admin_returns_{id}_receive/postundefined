import React from "react"
import { useAdminReceiveReturn } from "medusa-react"

type ReceiveReturnData = {
  items: {
    item_id: string
    quantity: number
  }[]
}

type Props = {
  returnId: string
}

const Return = ({ returnId }: Props) => {
  const receiveReturn = useAdminReceiveReturn(
    returnId
  )
  // ...

  const handleReceive = (data: ReceiveReturnData) => {
    receiveReturn.mutate(data, {
      onSuccess: ({ return: dataReturn }) => {
        console.log(dataReturn.status)
      }
    })
  }

  // ...
}

export default Return
