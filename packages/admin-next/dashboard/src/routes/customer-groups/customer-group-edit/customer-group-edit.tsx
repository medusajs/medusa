import { Drawer, Heading } from "@medusajs/ui"
import { useAdminCustomerGroup } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditCustomerGroupForm } from "./components/edit-customer-group-form"

export const CustomerGroupEdit = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { id } = useParams()
  const { customer_group, isLoading, isError, error } = useAdminCustomerGroup(
    id!
  )

  const { t } = useTranslation()

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("customerGroups.editCustomerGroup")}</Heading>
        </Drawer.Header>
        {!isLoading && customer_group && (
          <EditCustomerGroupForm
            subscribe={subscribe}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            group={customer_group}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
