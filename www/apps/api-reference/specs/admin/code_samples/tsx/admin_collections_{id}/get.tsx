import React from "react"
import { useAdminCollection } from "medusa-react"

type Props = {
  collectionId: string
}

const Collection = ({ collectionId }: Props) => {
  const { collection, isLoading } = useAdminCollection(collectionId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {collection && <span>{collection.title}</span>}
    </div>
  )
}

export default Collection
