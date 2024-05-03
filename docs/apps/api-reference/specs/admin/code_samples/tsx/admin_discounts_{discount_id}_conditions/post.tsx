import React from "react"
import { DiscountConditionOperator } from "@medusajs/medusa"
import { useAdminDiscountCreateCondition } from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const createCondition = useAdminDiscountCreateCondition(discountId)
  // ...

  const handleCreateCondition = (
    operator: DiscountConditionOperator,
    products: string[]
  ) => {
    createCondition.mutate({
      operator,
      products
    }, {
      onSuccess: ({ discount }) => {
        console.log(discount.id)
      }
    })
  }

  // ...
}

export default Discount
