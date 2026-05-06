import { useParams } from "react-router-dom"
import { MetadataForm } from "../../../components/forms/metadata-form"
import {
  usePriceList,
  useUpdatePriceList,
} from "../../../hooks/api/price-lists"

export const PriceListMetadata = () => {
  const { id } = useParams()

  const { price_list, isPending, isError, error } = usePriceList(id!)
  const { mutateAsync, isPending: isMutating } = useUpdatePriceList(id!)

  if (isError) {
    throw error
  }

  return (
    <MetadataForm
      metadata={price_list?.metadata}
      hook={mutateAsync}
      isPending={isPending}
      isMutating={isMutating}
    />
  )
}
