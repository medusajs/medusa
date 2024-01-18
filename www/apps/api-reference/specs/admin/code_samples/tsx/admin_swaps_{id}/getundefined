import React from "react"
import { useAdminSwap } from "medusa-react"

type Props = {
  swapId: string
}

const Swap = ({ swapId }: Props) => {
  const { swap, isLoading } = useAdminSwap(swapId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {swap && <span>{swap.id}</span>}
    </div>
  )
}

export default Swap
