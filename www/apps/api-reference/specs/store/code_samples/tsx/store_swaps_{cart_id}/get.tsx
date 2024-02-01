import React from "react"
import { useCartSwap } from "medusa-react"
type Props = {
  cartId: string
}

const Swap = ({ cartId }: Props) => {
  const {
    swap,
    isLoading,
  } = useCartSwap(cartId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {swap && <span>{swap.id}</span>}

    </div>
  )
}

export default Swap
