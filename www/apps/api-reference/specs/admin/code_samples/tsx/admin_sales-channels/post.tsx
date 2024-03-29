import React from "react"
import { useAdminCreateSalesChannel } from "medusa-react"

const CreateSalesChannel = () => {
  const createSalesChannel = useAdminCreateSalesChannel()
  // ...

  const handleCreate = (name: string, description: string) => {
    createSalesChannel.mutate({
      name,
      description,
    }, {
      onSuccess: ({ sales_channel }) => {
        console.log(sales_channel.id)
      }
    })
  }

  // ...
}

export default CreateSalesChannel
