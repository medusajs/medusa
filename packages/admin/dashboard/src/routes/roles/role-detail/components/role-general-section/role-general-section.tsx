import { Key, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Hint } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
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

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{role.name}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `edit`,
                  disabled: !hasPermission("rbac_role:update"),
                  disabledTooltip: (
                    <Hint variant="error">
                      {t("permissions.accessDenied.action")}
                    </Hint>
                  ),
                },
                {
                  icon: <Key />,
                  label: t("roles.actions.managePermissions"),
                  to: `permissions`,
                  disabled: !hasPermission("rbac_role:update"),
                  disabledTooltip: (
                    <Hint variant="error">
                      {t("permissions.accessDenied.action")}
                    </Hint>
                  ),
                },
              ],
            },
            {
              actions: [
                {
                  icon: <Trash />,
                  label: t("actions.delete"),
                  onClick: () => {},
                  disabled: !hasPermission("rbac_role:delete"),
                  disabledTooltip: (
                    <Hint variant="error">
                      {t("permissions.accessDenied.action")}
                    </Hint>
                  ),
                },
              ],
            },
          ]}
        />
      </div>
      <SectionRow title={t("fields.description")} value={role.description} />
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
    </Container>
  )
}
