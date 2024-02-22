import React from "react"
import { useAdminDeleteDiscount } from "medusa-react"

const Discount = () => {
  const deleteDiscount = useAdminDeleteDiscount(discount_id)
  // ...

  const handleDelete = () => {
    deleteDiscount.mutate()
  }

  // ...
}

export default Discount
