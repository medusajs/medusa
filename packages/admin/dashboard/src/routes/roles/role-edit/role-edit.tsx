import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useRbacRole } from "../../../hooks/api/rbac-roles"
import { EditRoleForm } from "./components/edit-role-form"

export const RoleEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { role, isPending, isError, error } = useRbacRole(id!, {
    fields: "id,name,description",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("roles.edit.header")}</Heading>
      </RouteDrawer.Header>
      {!isPending && role && <EditRoleForm role={role} />}
    </RouteDrawer>
  )
}
