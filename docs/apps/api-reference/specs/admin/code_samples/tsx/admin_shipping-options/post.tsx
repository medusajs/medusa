import React from "react"
import { useAdminCreateShippingOption } from "medusa-react"

type CreateShippingOption = {
  name: string
  provider_id: string
  data: Record<string, unknown>
  price_type: string
  amount: number
}

type Props = {
  regionId: string
}

const Region = ({ regionId }: Props) => {
  const createShippingOption = useAdminCreateShippingOption()
  // ...

  const handleCreate = (
    data: CreateShippingOption
  ) => {
    createShippingOption.mutate({
      ...data,
      region_id: regionId
    }, {
      onSuccess: ({ shipping_option }) => {
        console.log(shipping_option.id)
      }
    })
  }

  // ...
}

export default Region
