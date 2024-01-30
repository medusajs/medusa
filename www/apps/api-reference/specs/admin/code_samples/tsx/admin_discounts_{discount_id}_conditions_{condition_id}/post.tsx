import React from "react"
import { useAdminDiscountUpdateCondition } from "medusa-react"

type Props = {
  discountId: string
  conditionId: string
}

const DiscountCondition = ({
  discountId,
  conditionId
}: Props) => {
  const update = useAdminDiscountUpdateCondition(
    discountId,
    conditionId
  )
  // ...

  const handleUpdate = (
    products: string[]
  ) => {
    update.mutate({
      products
    }, {
      onSuccess: ({ discount }) => {
        console.log(discount.id)
      }
    })
  }

  // ...
}

export default DiscountCondition
