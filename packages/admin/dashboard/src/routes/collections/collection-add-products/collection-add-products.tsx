import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useCollection } from "../../../hooks/api/collections"
import { AddProductsToCollectionForm } from "./components/add-products-to-collection-form"

export const CollectionAddProducts = () => {
  const { id } = useParams()
  const { collection, isLoading, isError, error } = useCollection(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && collection && (
        <AddProductsToCollectionForm collection={collection} />
      )}
    </RouteFocusModal>
  )
}
