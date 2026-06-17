import React from "react"
import clsx from "clsx"
import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"
import { Link } from "../.."

export type PermissionsBadgeProps = {
  permissions: string[]
  requireAll?: boolean
  label?: string
  actor?: string
  className?: string
}

export const PermissionsBadge = ({
  permissions,
  requireAll = true,
  label,
  actor = "user",
  className,
}: PermissionsBadgeProps) => {
  if (!permissions?.length) {
    return null
  }

  const defaultLabel =
    permissions.length > 1
      ? `Requires policies (${requireAll ? "all of" : "any of"}):`
      : "Requires policy:"

  return (
      <span
        className={clsx(
          "flex flex-wrap items-center gap-docs_0.5 my-docs_1",
          className
        )}
      >
        <span className="text-compact-x-small text-medusa-fg-subtle">
          {label || defaultLabel}
        </span>
        <Tooltip
          tooltipChildren={
            <span>
              This requires the <Link href="https://docs.medusajs.com/resources/commerce-modules/rbac">role-based access control (RBAC) feature</Link>.<br />
              The {actor} needs{" "}
              {requireAll && permissions.length > 1 ? "all of" : "the"}{" "}
              {permissions.length > 1 && !requireAll ? "one of the " : ""}
              listed {permissions.length > 1 ? "policies" : "policy"}.
            </span>
          }
          clickable
        >
          <span className="inline-flex flex-wrap items-center gap-docs_0.25">
            {permissions.map((permission) => (
              <Badge variant="code" key={permission}>
                {permission}
              </Badge>
            ))}
          </span>
        </Tooltip>
      </span>
  )
}
