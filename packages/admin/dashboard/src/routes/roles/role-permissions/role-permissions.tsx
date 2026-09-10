import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { VisuallyHidden } from "../../../components/utilities/visually-hidden"
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
    <RouteFocusModal>
      {!isPending && role && (
        <>
          <RouteFocusModal.Header>
            <RouteFocusModal.Title asChild>
              <VisuallyHidden>
                {t("roles.permissions.header", { name: role.name })}
              </VisuallyHidden>
            </RouteFocusModal.Title>
            <RouteFocusModal.Description asChild>
              <VisuallyHidden>{t("roles.permissions.hint")}</VisuallyHidden>
            </RouteFocusModal.Description>
          </RouteFocusModal.Header>
          <EditRolePermissionsForm role={role} />
        </>
      )}
    </RouteFocusModal>
  )
}
