import React from "react"
import { useAdminRemoveProductsFromCollection } from "medusa-react"

type Props = {
  collectionId: string
}

const Collection = ({ collectionId }: Props) => {
  const removeProducts = useAdminRemoveProductsFromCollection(collectionId)
  // ...

  const handleRemoveProducts = (productIds: string[]) => {
    removeProducts.mutate({
      product_ids: productIds
    }, {
      onSuccess: ({ id, object, removed_products }) => {
        console.log(removed_products)
      }
    })
  }

  // ...
}

export default Collection
