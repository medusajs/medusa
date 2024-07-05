import React from "react"
import {
  useAdminDeleteProductsFromSalesChannel,
} from "medusa-react"

type Props = {
  salesChannelId: string
}

const SalesChannel = ({ salesChannelId }: Props) => {
  const deleteProducts = useAdminDeleteProductsFromSalesChannel(
    salesChannelId
  )
  // ...

  const handleDeleteProducts = (productId: string) => {
    deleteProducts.mutate({
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
