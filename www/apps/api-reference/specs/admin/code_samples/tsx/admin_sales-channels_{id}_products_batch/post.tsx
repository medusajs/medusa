import React from "react"
import { useAdminAddProductsToSalesChannel } from "medusa-react"

type Props = {
  salesChannelId: string
}

const SalesChannel = ({ salesChannelId }: Props) => {
  const addProducts = useAdminAddProductsToSalesChannel(
    salesChannelId
  )
  // ...

  const handleAddProducts = (productId: string) => {
    addProducts.mutate({
      product_ids: [
        {
          id: productId,
        },
      ],
    }, {
      onSuccess: ({ sales_channel }) => {
        console.log(sales_channel.id)
      }
    })
  }

  // ...
}

export default SalesChannel
