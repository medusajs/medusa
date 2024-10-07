import { useParams } from "react-router-dom"

import {
  useProductCategory,
  useUpdateProductCategory,
} from "../../../hooks/api"
import { MetadataForm } from "../../../components/forms/metadata-form"
import { RouteDrawer } from "../../../components/modals"

export const CategoriesMetadata = () => {
  const { id } = useParams()

  const { product_category, isPending, isError, error } = useProductCategory(id)
  const { mutateAsync, isPending: isMutating } = useUpdateProductCategory(id)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={product_category?.metadata}
      />
    </RouteDrawer>
  )
}
