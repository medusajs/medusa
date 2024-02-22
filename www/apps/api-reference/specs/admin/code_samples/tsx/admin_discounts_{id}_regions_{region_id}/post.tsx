import React from "react"
import { useAdminDiscountAddRegion } from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const addRegion = useAdminDiscountAddRegion(discountId)
  // ...

  const handleAdd = (regionId: string) => {
    addRegion.mutate(regionId, {
      onSuccess: ({ discount }) => {
        console.log(discount.regions)
      }
    })
  }

  // ...
}

export default Discount
