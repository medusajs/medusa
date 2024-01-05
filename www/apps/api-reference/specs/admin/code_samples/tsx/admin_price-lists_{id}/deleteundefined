import React from "react"
import { useAdminDeletePriceList } from "medusa-react"

type Props = {
  priceListId: string
}

const PriceList = ({
  priceListId
}: Props) => {
  const deletePriceList = useAdminDeletePriceList(priceListId)
  // ...

  const handleDelete = () => {
    deletePriceList.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default PriceList
