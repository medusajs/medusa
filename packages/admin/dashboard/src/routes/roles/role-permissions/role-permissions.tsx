import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useRbacRole } from "../../../hooks/api/rbac-roles"
import { EditRolePermissionsForm } from "./components/edit-role-permissions-form"

export const RolePermissions = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { role, isPending, isError, error } = useRbacRole(id!, {
    fields: "id,name,policies.id",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      {!isPending && role && (
        <>
          <RouteDrawer.Header>
            <RouteDrawer.Title asChild>
              <Heading>
                {t("roles.permissions.header", { name: role.name })}
              </Heading>
            </RouteDrawer.Title>
            <RouteDrawer.Description className="sr-only">
              {t("roles.permissions.hint")}
            </RouteDrawer.Description>
          </RouteDrawer.Header>
          <EditRolePermissionsForm role={role} />
        </>
      )}
    </RouteDrawer>
  )
}
