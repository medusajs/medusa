import React from "react"
import { useAdminDiscountRemoveRegion } from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const deleteRegion = useAdminDiscountRemoveRegion(discountId)
  // ...

  const handleDelete = (regionId: string) => {
    deleteRegion.mutate(regionId, {
      onSuccess: ({ discount }) => {
        console.log(discount.regions)
      }
    })
  }

  // ...
}

export default Discount
