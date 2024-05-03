import React from "react"
import { useAdminReturns } from "medusa-react"

const Returns = () => {
  const { returns, isLoading } = useAdminReturns()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {returns && !returns.length && (
        <span>No Returns</span>
      )}
      {returns && returns.length > 0 && (
        <ul>
          {returns.map((returnData) => (
            <li key={returnData.id}>
              {returnData.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Returns
