import React from "react"
import { useCollection } from "medusa-react"

type Props = {
  collectionId: string
}

const ProductCollection = ({ collectionId }: Props) => {
  const { collection, isLoading } = useCollection(collectionId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {collection && <span>{collection.title}</span>}
    </div>
  )
}

export default ProductCollection
