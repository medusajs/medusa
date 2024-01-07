import React from "react"
import { useAdminSwaps } from "medusa-react"

const Swaps = () => {
  const { swaps, isLoading } = useAdminSwaps()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {swaps && !swaps.length && <span>No Swaps</span>}
      {swaps && swaps.length > 0 && (
        <ul>
          {swaps.map((swap) => (
            <li key={swap.id}>{swap.payment_status}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Swaps
