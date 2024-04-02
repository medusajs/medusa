import { useAdminProduct } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { ProductOrganizationForm } from "./components/product-organization-form"

export const ProductOrganization = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  const ready = !isLoading && product

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header></RouteDrawer.Header>
      {ready && <ProductOrganizationForm product={product} />}
    </RouteDrawer>
  )
}
