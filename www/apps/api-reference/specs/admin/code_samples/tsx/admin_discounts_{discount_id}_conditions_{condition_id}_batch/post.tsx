import React from "react"
import {
  useAdminAddDiscountConditionResourceBatch
} from "medusa-react"

type Props = {
  discountId: string
  conditionId: string
}

const DiscountCondition = ({
  discountId,
  conditionId
}: Props) => {
  const addConditionResources = useAdminAddDiscountConditionResourceBatch(
    discountId,
    conditionId
  )
  // ...

  const handleAdd = (itemId: string) => {
    addConditionResources.mutate({
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
