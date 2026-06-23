import { useParams } from "react-router-dom"

import { MetadataForm } from "../../../components/forms/metadata-form/metadata-form"
import {
  useProductOptionValue,
  useUpdateProductOptionValue,
} from "../../../hooks/api"

export const ProductOptionValueMetadata = () => {
  const { id, value_id } = useParams()

  const { product_option_value, isPending, isError, error } =
    useProductOptionValue(id!, value_id!)

  const { mutateAsync, isPending: isMutating } = useUpdateProductOptionValue(
    id!,
    value_id!
  )

  if (isError) {
    throw error
  }

  return (
    <MetadataForm
      metadata={product_option_value?.metadata}
      hook={mutateAsync}
      isPending={isPending}
      isMutating={isMutating}
    />
  )
}
