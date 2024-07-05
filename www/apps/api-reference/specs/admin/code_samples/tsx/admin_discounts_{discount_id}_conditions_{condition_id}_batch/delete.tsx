import React from "react"
import {
  useAdminDeleteDiscountConditionResourceBatch
} from "medusa-react"

type Props = {
  discountId: string
  conditionId: string
}

const DiscountCondition = ({
  discountId,
  conditionId
}: Props) => {
  const deleteConditionResource = useAdminDeleteDiscountConditionResourceBatch(
    discountId,
    conditionId,
  )
  // ...

  const handleDelete = (itemId: string) => {
    deleteConditionResource.mutate({
      resources: [
        {
          id: itemId
        }
      ]
    }, {
      onSuccess: ({ discount }) => {
        console.log(discount.id)
      }
    })
  }

  // ...
}

export default DiscountCondition
