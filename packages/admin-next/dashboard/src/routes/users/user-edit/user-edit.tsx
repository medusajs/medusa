import { Drawer, Heading } from "@medusajs/ui"
import { useAdminUser } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditUserForm } from "./components/edit-user-form"

export const UserEdit = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { t } = useTranslation()
  const { id } = useParams()
  const { user, isLoading, isError, error } = useAdminUser(id!)

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
          <Heading>{t("users.editUser")}</Heading>
        </Drawer.Header>
        {!isLoading && user && (
          <EditUserForm
            user={user}
            subscribe={subscribe}
            onSuccessfulSubmit={handleSuccessfulSubmit}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
