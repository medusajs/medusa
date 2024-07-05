import React from "react"
import {
  useAdminDiscountRemoveCondition
} from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const deleteCondition = useAdminDiscountRemoveCondition(
    discountId
  )
  // ...

  const handleDelete = (
    conditionId: string
  ) => {
    deleteCondition.mutate(conditionId, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(deleted)
      }
    })
  }

  // ...
}

export default Discount
