import { useAdminCollection } from "medusa-react"
import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { AddProductsToCollectionForm } from "./components/add-products-to-collection-form"

export const CollectionAddProducts = () => {
  const { id } = useParams()
  const { collection, isLoading, isError, error } = useAdminCollection(id!)

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
