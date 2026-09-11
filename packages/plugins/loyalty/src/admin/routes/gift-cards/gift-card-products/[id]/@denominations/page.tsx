import { Heading } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { GiftCardProductEditDenominationsForm } from "./components/gift-card-product-edit-denominations-form"
import { RouteDrawer } from "@medusajs/dashboard/components"
import { useProduct } from "@medusajs/dashboard/hooks"

export const GiftCardProductEdit = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!, {})

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit gift cards denominations</Heading>
        </RouteDrawer.Title>

        <RouteDrawer.Description className="sr-only">
          Edit the gift card denominations
        </RouteDrawer.Description>
      </RouteDrawer.Header>

      {!isLoading && product && (
        <GiftCardProductEditDenominationsForm product={product} />
      )}
    </RouteDrawer>
  )
}

export default GiftCardProductEdit
