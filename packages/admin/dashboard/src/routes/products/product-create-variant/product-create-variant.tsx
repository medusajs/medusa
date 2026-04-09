import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { CreateProductVariantForm } from "./components/create-product-variant-form"

export const ProductCreateVariant = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!, {
    // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
    fields: "-type,-collection,-tags,-images,-variants,-sales_channels",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && product && <CreateProductVariantForm product={product} />}
    </RouteFocusModal>
  )
}
