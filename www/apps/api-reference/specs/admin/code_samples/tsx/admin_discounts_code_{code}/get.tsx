import React from "react"
import { useAdminGetDiscountByCode } from "medusa-react"

type Props = {
  discountCode: string
}

const Discount = ({ discountCode }: Props) => {
  const { discount, isLoading } = useAdminGetDiscountByCode(
    discountCode
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {discount && <span>{discount.code}</span>}
    </div>
  )
}

export default Discount
