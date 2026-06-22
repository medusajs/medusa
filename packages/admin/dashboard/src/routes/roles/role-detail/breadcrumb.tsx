import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useRbacRole } from "../../../hooks/api/rbac-roles"
import { ROLE_DETAIL_FIELDS } from "./constants"

type RoleDetailBreadcrumbProps = UIMatch<HttpTypes.AdminRbacRoleResponse>

export const RoleDetailBreadcrumb = (props: RoleDetailBreadcrumbProps) => {
  const { id } = props.params || {}

  const { role } = useRbacRole(
    id!,
    {
      fields: ROLE_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!role) {
    return null
  }

  return <span>{role.name}</span>
}
