import { useParams } from "react-router-dom"
import { MetadataForm } from "../../../components/forms/metadata-form/metadata-form"
import { useProduct, useUpdateProduct } from "../../../hooks/api"

export const ProductMetadata = () => {
  const { id } = useParams()

  const { product, isPending, isError, error } = useProduct(id!)

  const { mutateAsync, isPending: isMutating } = useUpdateProduct(product.id!)

  if (isError) {
    throw error
  }

  return (
    <MetadataForm
      metadata={product.metadata}
      hook={mutateAsync}
      isPending={isPending}
      isMutating={isMutating}
    />
  )
}
