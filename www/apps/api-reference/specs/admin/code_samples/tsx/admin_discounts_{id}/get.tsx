import React from "react"
import { useAdminDiscount } from "medusa-react"

type Props = {
  discountId: string
}

const Discount = ({ discountId }: Props) => {
  const { discount, isLoading } = useAdminDiscount(
    discountId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {discount && <span>{discount.code}</span>}
    </div>
  )
}

export default Discount
