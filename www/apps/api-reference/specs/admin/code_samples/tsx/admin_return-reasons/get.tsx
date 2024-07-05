import React from "react"
import { useAdminReturnReasons } from "medusa-react"

const ReturnReasons = () => {
  const { return_reasons, isLoading } = useAdminReturnReasons()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {return_reasons && !return_reasons.length && (
        <span>No Return Reasons</span>
      )}
      {return_reasons && return_reasons.length > 0 && (
        <ul>
          {return_reasons.map((reason) => (
            <li key={reason.id}>
              {reason.label}: {reason.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReturnReasons
