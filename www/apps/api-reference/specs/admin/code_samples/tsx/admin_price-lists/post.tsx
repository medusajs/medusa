import React from "react"
import {
  PriceListStatus,
  PriceListType,
} from "@medusajs/medusa"
import { useAdminCreatePriceList } from "medusa-react"

type CreateData = {
  name: string
  description: string
  type: PriceListType
  status: PriceListStatus
  prices: {
    amount: number
    variant_id: string
    currency_code: string
    max_quantity: number
  }[]
}

const CreatePriceList = () => {
  const createPriceList = useAdminCreatePriceList()
  // ...

  const handleCreate = (
    data: CreateData
  ) => {
    createPriceList.mutate(data, {
      onSuccess: ({ price_list }) => {
        console.log(price_list.id)
      }
    })
  }

  // ...
}

export default CreatePriceList
