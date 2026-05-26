import { Key, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { ListSummary } from "../../../../../components/common/list-summary"
import { SectionRow } from "../../../../../components/common/section"
import { usePermissions } from "../../../../../providers/permissions-provider"

type RoleWithUsers = HttpTypes.AdminRbacRole & {
  users_link?: { user?: HttpTypes.AdminUser | null }[]
}

type RoleGeneralSectionProps = {
  role: RoleWithUsers
}

export const RoleGeneralSection = ({ role }: RoleGeneralSectionProps) => {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()

  const users = useMemo(() => {
    return (
      role.users_link
        ?.map((link) => link.user)
        .filter((user): user is HttpTypes.AdminUser => !!user) ?? []
    )
  }, [role.users_link])

  const userLabels = useMemo(() => {
    return users.map((user) => {
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim()
      return fullName || user.email || user.id
    })
  }, [users])

  const permissionLabels = useMemo(() => {
    return (
      role.policies?.map((policy) => {
        if (policy.key) {
          return policy.key
        }

        const resource = policy.resource ?? ""
        const operation = policy.operation ?? ""

        if (resource && operation) {
          return `${resource}:${operation}`
        }

        return policy.id
      }) ?? []
    )
  }, [role.policies])

  const canUpdate = hasPermission("rbac_role:update")
  const canDelete = hasPermission("rbac_role:delete")

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `edit`,
        },
        {
          icon: <Key />,
          label: t("roles.actions.managePermissions"),
          to: `permissions`,
        },
      ],
    })
  }

  if (canDelete) {
    groups.push({
      actions: [
        {
          icon: <Trash />,
          label: t("actions.delete"),
          onClick: () => {},
        },
      ],
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{role.name}</Heading>
        {groups.length && <ActionMenu groups={groups} />}
      </div>
      <SectionRow title={t("fields.description")} value={role.description} />
      {hasPermission("user:read") && (
        <SectionRow
          title={t("users.domain")}
          value={
            userLabels.length ? (
              <div className="inline-flex">
                <ListSummary list={userLabels} />
              </div>
            ) : (
              "-"
            )
          }
        />
      )}
      {hasPermission("rbac_policy:read") && (
        <SectionRow
          title={t("roles.fields.permissions")}
          value={
            permissionLabels.length ? (
              <div className="inline-flex">
                <ListSummary list={permissionLabels} />
              </div>
            ) : (
              "-"
            )
          }
        />
      )}
    </Container>
  )
}
