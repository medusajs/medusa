import { Heading } from "@medusajs/ui"
import { useAdminUser } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditUserForm } from "./components/edit-user-form"

export const UserEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { user, isLoading, isError, error } = useAdminUser(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("users.editUser")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && user && <EditUserForm user={user} />}
    </RouteDrawer>
  )
}
