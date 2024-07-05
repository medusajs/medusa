import React from "react"
import { useAdminUpdateStore } from "medusa-react"

function Store() {
  const updateStore = useAdminUpdateStore()
  // ...

  const handleUpdate = (
    name: string
  ) => {
    updateStore.mutate({
      name
    }, {
      onSuccess: ({ store }) => {
        console.log(store.name)
      }
    })
  }
}

export default Store
