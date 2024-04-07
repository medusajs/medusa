import { Heading } from "@medusajs/ui"
import { useAdminCustomerGroup } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditCustomerGroupForm } from "./components/edit-customer-group-form"

export const CustomerGroupEdit = () => {
  const { id } = useParams()
  const { customer_group, isLoading, isError, error } = useAdminCustomerGroup(
    id!
  )

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("customerGroups.editCustomerGroup")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && customer_group && (
        <EditCustomerGroupForm group={customer_group} />
      )}
    </RouteDrawer>
  )
}
