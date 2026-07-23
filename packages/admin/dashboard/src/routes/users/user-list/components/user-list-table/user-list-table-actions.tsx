import { PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useUserPermissions } from "../../../../../hooks/use-resource-permissions"

export const UserListTableActions = ({
  user,
}: {
  user: HttpTypes.AdminUser
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { canUpdate } = useUserPermissions()

  if (!canUpdate) {
    return null
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              onClick: () => navigate(`/settings/users/${user.id}/edit`),
            },
          ],
        },
      ]}
    />
  )
}
