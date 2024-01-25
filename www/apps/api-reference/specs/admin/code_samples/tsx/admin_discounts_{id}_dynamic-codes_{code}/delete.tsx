import React from "react"
import { useAdminDeleteDynamicDiscountCode } from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const deleteDynamicDiscount = useAdminDeleteDynamicDiscountCode(discountId)
  // ...

  const handleDelete = (code: string) => {
    deleteDynamicDiscount.mutate(code, {
      onSuccess: ({ discount }) => {
        console.log(discount.is_dynamic)
      }
    })
  }

  // ...
}

export default Discount
