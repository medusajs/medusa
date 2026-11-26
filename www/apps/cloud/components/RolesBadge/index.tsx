import React from "react"
import { Link, PermissionsBadge } from "docs-ui"

export type CloudRole = "developer" | "billing"

export type RolesBadgeProps = {
  roles?: CloudRole[]
  className?: string
}

const ROLE_NAMES: Record<CloudRole, string> = {
  developer: "Developer",
  billing: "Billing",
}

export const RolesBadge = ({ roles = [], className }: RolesBadgeProps) => {
  const roleNames = [
    "Admin",
    ...Object.entries(ROLE_NAMES)
      .filter(([role]) => roles.includes(role as CloudRole))
      .map(([, name]) => name),
  ]
  const isMultiple = roleNames.length > 1

  return (
    <PermissionsBadge
      permissions={roleNames}
      label={isMultiple ? "Requires one of the roles:" : "Requires role:"}
      badgeVariant="neutral"
      className={className}
      tooltip={
        <span>
          A user or connection must have{" "}
          {isMultiple ? "one of these roles" : "this role"} to perform this
          action.
          <br />
          Learn more in{" "}
          <Link href="https://docs.medusajs.com/cloud/organizations/roles">
            Roles and Permissions
          </Link>
          .
        </span>
      }
    />
  )
}
