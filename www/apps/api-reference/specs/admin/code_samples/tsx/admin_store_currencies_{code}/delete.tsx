import React from "react"
import { useAdminDeleteStoreCurrency } from "medusa-react"

const Store = () => {
  const deleteCurrency = useAdminDeleteStoreCurrency()
  // ...

  const handleAdd = (code: string) => {
    deleteCurrency.mutate(code, {
      onSuccess: ({ store }) => {
        console.log(store.currencies)
      }
    })
  }

  // ...
}

export default Store
