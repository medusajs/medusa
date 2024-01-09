import React from "react"
import { useAdminDeleteCollection } from "medusa-react"

type Props = {
  collectionId: string
}

const Collection = ({ collectionId }: Props) => {
  const deleteCollection = useAdminDeleteCollection(collectionId)
  // ...

  const handleDelete = (title: string) => {
    deleteCollection.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default Collection
