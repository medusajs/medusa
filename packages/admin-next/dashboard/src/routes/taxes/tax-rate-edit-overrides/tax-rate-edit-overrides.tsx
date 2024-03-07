import { useAdminTaxRate } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { EditTaxRateOverridesForm } from "./components/edit-tax-rate-overrides-form"

export const TaxRateEditOverrides = () => {
  const { rate_id } = useParams()

  const { tax_rate, isLoading, isError, error } = useAdminTaxRate(rate_id!, {
    expand: ["products", "shipping_options", "product_types"],
  })

  const ready = !isLoading && tax_rate

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <EditTaxRateOverridesForm taxRate={tax_rate} />}
    </RouteFocusModal>
  )
}
