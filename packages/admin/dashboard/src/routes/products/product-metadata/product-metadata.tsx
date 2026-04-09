import { useParams } from "react-router-dom"
import { MetadataForm } from "../../../components/forms/metadata-form/metadata-form"
import { useProduct, useUpdateProduct } from "../../../hooks/api"

export const ProductMetadata = () => {
  const { id } = useParams()

  const { product, isPending, isError, error } = useProduct(id!, {
    // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
    fields:
      "-type,-collection,-options,-tags,-images,-variants,-sales_channels",
  })

  const { mutateAsync, isPending: isMutating } = useUpdateProduct(product?.id!)

  if (isError) {
    throw error
  }

  return (
    <MetadataForm
      metadata={product?.metadata}
      hook={mutateAsync}
      isPending={isPending}
      isMutating={isMutating}
    />
  )
}
