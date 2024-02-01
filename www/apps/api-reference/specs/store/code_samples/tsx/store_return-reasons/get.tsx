import React from "react"
import { useReturnReasons } from "medusa-react"

const ReturnReasons = () => {
  const {
    return_reasons,
    isLoading
  } = useReturnReasons()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {return_reasons?.length && (
        <ul>
          {return_reasons.map((returnReason) => (
            <li key={returnReason.id}>
              {returnReason.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReturnReasons
