import React from "react"
import { useAdminPriceList } from "medusa-react"

type Props = {
  priceListId: string
}

const PriceList = ({
  priceListId
}: Props) => {
  const {
    price_list,
    isLoading,
  } = useAdminPriceList(priceListId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {price_list && <span>{price_list.name}</span>}
    </div>
  )
}

export default PriceList
