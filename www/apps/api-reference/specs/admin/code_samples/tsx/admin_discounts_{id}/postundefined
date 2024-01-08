import React from "react"
import { useAdminUpdateDiscount } from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const updateDiscount = useAdminUpdateDiscount(discountId)
  // ...

  const handleUpdate = (isDisabled: boolean) => {
    updateDiscount.mutate({
      is_disabled: isDisabled,
    })
  }

  // ...
}

export default Discount
