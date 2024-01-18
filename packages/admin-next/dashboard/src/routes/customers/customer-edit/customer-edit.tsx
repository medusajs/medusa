import { Drawer, Heading } from "@medusajs/ui"
import { useAdminCustomer } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditCustomerForm } from "./components/edit-customer-form"

export const CustomerEdit = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()
  const { t } = useTranslation()

  const { id } = useParams()
  const { customer, isLoading, isError, error } = useAdminCustomer(id!)

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
          <Heading>{t("customers.editCustomer")}</Heading>
        </Drawer.Header>
        {!isLoading && customer && (
          <EditCustomerForm
            customer={customer}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
