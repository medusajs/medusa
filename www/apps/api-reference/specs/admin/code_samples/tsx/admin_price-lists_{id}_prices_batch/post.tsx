import React from "react"
import { useAdminCreatePriceListPrices } from "medusa-react"

type PriceData = {
  amount: number
  variant_id: string
  currency_code: string
}

type Props = {
  priceListId: string
}

const PriceList = ({
  priceListId
}: Props) => {
  const addPrices = useAdminCreatePriceListPrices(priceListId)
  // ...

  const handleAddPrices = (prices: PriceData[]) => {
    addPrices.mutate({
      prices
    }, {
      onSuccess: ({ price_list }) => {
        console.log(price_list.prices)
      }
    })
  }

  // ...
}

export default PriceList
