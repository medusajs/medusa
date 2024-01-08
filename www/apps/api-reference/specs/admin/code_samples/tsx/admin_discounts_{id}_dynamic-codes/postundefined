import React from "react"
import { useAdminCreateDynamicDiscountCode } from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const createDynamicDiscount = useAdminCreateDynamicDiscountCode(discountId)
  // ...

  const handleCreate = (
    code: string,
    usageLimit: number
  ) => {
    createDynamicDiscount.mutate({
      code,
      usage_limit: usageLimit
    }, {
      onSuccess: ({ discount }) => {
        console.log(discount.is_dynamic)
      }
    })
  }

  // ...
}

export default Discount
