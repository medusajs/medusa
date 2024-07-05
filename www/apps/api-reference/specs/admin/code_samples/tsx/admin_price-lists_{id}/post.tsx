import React from "react"
import { useAdminUpdatePriceList } from "medusa-react"

type Props = {
  priceListId: string
}

const PriceList = ({
  priceListId
}: Props) => {
  const updatePriceList = useAdminUpdatePriceList(priceListId)
  // ...

  const handleUpdate = (
    endsAt: Date
  ) => {
    updatePriceList.mutate({
      ends_at: endsAt,
    }, {
      onSuccess: ({ price_list }) => {
        console.log(price_list.ends_at)
      }
    })
  }

  // ...
}

export default PriceList
