import React from "react"
import { useAdminUpdateCollection } from "medusa-react"

type Props = {
  collectionId: string
}

const Collection = ({ collectionId }: Props) => {
  const updateCollection = useAdminUpdateCollection(collectionId)
  // ...

  const handleUpdate = (title: string) => {
    updateCollection.mutate({
      title
    }, {
      onSuccess: ({ collection }) => {
        console.log(collection.id)
      }
    })
  }

  // ...
}

export default Collection
