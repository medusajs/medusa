import React from "react"
import { useAdminCreateCollection } from "medusa-react"

const CreateCollection = () => {
  const createCollection = useAdminCreateCollection()
  // ...

  const handleCreate = (title: string) => {
    createCollection.mutate({
      title
    }, {
      onSuccess: ({ collection }) => {
        console.log(collection.id)
      }
    })
  }

  // ...
}

export default CreateCollection
