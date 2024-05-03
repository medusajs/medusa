import React from "react"
import { useAdminGetDiscountCondition } from "medusa-react"

type Props = {
  discountId: string
  discountConditionId: string
}

const DiscountCondition = ({
  discountId,
  discountConditionId
}: Props) => {
  const {
    discount_condition,
    isLoading
  } = useAdminGetDiscountCondition(
    discountId,
    discountConditionId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {discount_condition && (
        <span>{discount_condition.type}</span>
      )}
    </div>
  )
}

export default DiscountCondition
