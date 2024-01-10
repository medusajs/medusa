import React from "react"
import { useAdminPriceLists } from "medusa-react"

const PriceLists = () => {
  const { price_lists, isLoading } = useAdminPriceLists()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {price_lists && !price_lists.length && (
        <span>No Price Lists</span>
      )}
      {price_lists && price_lists.length > 0 && (
        <ul>
          {price_lists.map((price_list) => (
            <li key={price_list.id}>{price_list.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PriceLists
