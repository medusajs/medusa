import React from "react"
import { useAdminAddProductsToCollection } from "medusa-react"

type Props = {
  collectionId: string
}

const Collection = ({ collectionId }: Props) => {
  const addProducts = useAdminAddProductsToCollection(collectionId)
  // ...

  const handleAddProducts = (productIds: string[]) => {
    addProducts.mutate({
      product_ids: productIds
    }, {
      onSuccess: ({ collection }) => {
        console.log(collection.products)
      }
    })
  }

  // ...
}

export default Collection
