import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditCustomerForm } from "./components/edit-customer-form"
import { useCustomer } from "../../../hooks/api/customers"

export const CustomerEdit = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const { customer, isLoading, isError, error } = useCustomer(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("customers.editCustomer")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && customer && <EditCustomerForm customer={customer} />}
    </RouteDrawer>
  )
}
