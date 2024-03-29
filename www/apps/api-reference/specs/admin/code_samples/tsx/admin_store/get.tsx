import React from "react"
import { useAdminStore } from "medusa-react"

const Store = () => {
  const {
    store,
    isLoading
  } = useAdminStore()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {store && <span>{store.name}</span>}
    </div>
  )
}

export default Store
