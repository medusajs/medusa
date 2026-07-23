import { PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import {
  Action,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { usePermissions } from "../../../../../providers/permissions-provider"

export const CustomerActions = ({
  customer,
}: {
  customer: HttpTypes.AdminCustomer
}) => {
  const { t } = useTranslation()
  const { can } = usePermissions()

  const actions: Action[] = []

  if (can("customer", "update")) {
    actions.push({
      icon: <PencilSquare />,
      label: t("actions.edit"),
      to: `/customers/${customer.id}/edit`,
    })
  }

  if (!actions.length) {
    return null
  }

  return (
    <ActionMenu
      groups={[
        {
          actions,
        },
      ]}
    />
  )
}
