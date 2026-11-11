import { TriangleRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, Button, Container, Heading, Text } from "@medusajs/ui"
import { Collapsible } from "radix-ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import {
  useRbacPolicyPermissions,
  useRbacRolePermissions,
} from "../../../../../hooks/use-resource-permissions"
import { LEVEL_COLORS } from "../../../common/constants"
import {
  useGroupLabels,
  useOperationLabel,
  useResourceLabel,
} from "../../../common/hooks"
import {
  getWildcardPolicies,
  RoleGroupSummary,
  summarizeRolePolicies,
} from "../../../common/utils"

type RolePermissionsSectionProps = {
  role: HttpTypes.AdminRbacRole
}

export const RolePermissionsSection = ({
  role,
}: RolePermissionsSectionProps) => {
  const { t } = useTranslation()
  const { canUpdate } = useRbacRolePermissions()
  const { canRead: canReadPolicies } = useRbacPolicyPermissions()

  const canManagePolicies = canUpdate && canReadPolicies

  const summaries = useMemo(
    () => summarizeRolePolicies(role.policies ?? []),
    [role.policies]
  )

  const wildcardKeys = useMemo(
    () =>
      getWildcardPolicies(role.policies ?? []).map(
        (policy) => policy.key ?? `${policy.resource}:${policy.operation}`
      ),
    [role.policies]
  )

  const count = summaries.reduce((sum, group) => sum + group.selected, 0)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between gap-x-4 px-6 py-4">
        <div className="flex flex-col gap-y-0.5">
          <Heading level="h2">
            {t("roles.permissions.matrix.detail.heading")}
          </Heading>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("roles.permissions.matrix.detail.countOnly", { count })}
          </Text>
        </div>
        {canManagePolicies && (
          <Link to="permissions">
            <Button variant="secondary" size="small">
              {t("roles.actions.managePermissions")}
            </Button>
          </Link>
        )}
      </div>
      <ul className="divide-y">
        {summaries.map((summary) => (
          <li key={summary.id}>
            <GroupRow summary={summary} />
          </li>
        ))}
      </ul>
      {wildcardKeys.length > 0 && (
        <Text
          size="small"
          leading="compact"
          className="px-6 py-4 text-ui-fg-subtle"
        >
          {t("roles.permissions.matrix.summary.wildcards", {
            keys: wildcardKeys.join(", "),
          })}
        </Text>
      )}
    </Container>
  )
}

const GroupRow = ({ summary }: { summary: RoleGroupSummary }) => {
  const { t } = useTranslation()
  const groupLabels = useGroupLabels()
  const resourceLabel = useResourceLabel()
  const operationLabel = useOperationLabel()

  const label = groupLabels.label(summary.id)
  const description = groupLabels.description(summary.id)

  const badge = (
    <Badge size="2xsmall" rounded="full" color={LEVEL_COLORS[summary.level]}>
      {t(`roles.permissions.matrix.levels.${summary.level}`)}
    </Badge>
  )

  if (summary.selected === 0) {
    return (
      <div className="flex items-center justify-between gap-x-4 px-6 py-4">
        <div className="flex min-w-0 flex-col gap-y-0.5 ps-6">
          <Text size="small" leading="compact" className="text-ui-fg-muted">
            {label}
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-muted">
            {description}
          </Text>
        </div>
        {badge}
      </div>
    )
  }

  return (
    <Collapsible.Root>
      <Collapsible.Trigger className="group flex w-full items-center justify-between gap-x-4 px-6 py-4 text-start outline-none focus-visible:shadow-borders-focus">
        <div className="flex min-w-0 items-start gap-x-2">
          <TriangleRightMini className="mt-0.5 shrink-0 text-ui-fg-muted transition-transform group-data-[state='open']:rotate-90 rtl:rotate-180 rtl:group-data-[state='open']:rotate-90" />
          <div className="flex min-w-0 flex-col gap-y-0.5">
            <Text size="small" leading="compact" weight="plus">
              {label}
            </Text>
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {description}
            </Text>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-x-2">
          {summary.level === "mixed" && summary.total !== undefined && (
            <Text
              size="xsmall"
              leading="compact"
              className="font-mono text-ui-fg-subtle"
            >
              {summary.selected}/{summary.total}
            </Text>
          )}
          {badge}
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="flex flex-col gap-y-3 border-t bg-ui-bg-subtle px-6 py-4 ps-12">
          {summary.resources.map((resource) => (
            <div
              key={resource.resource}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
            >
              <div className="flex flex-col">
                <Text size="small" leading="compact">
                  {resourceLabel(resource.resource)}
                </Text>
                {resource.hasViewWarning && (
                  <Text
                    size="xsmall"
                    leading="compact"
                    className="text-ui-fg-error"
                  >
                    {t("roles.permissions.matrix.noViewAccess")}
                  </Text>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {resource.operations.map((operation) => (
                  <Badge key={operation} size="2xsmall" color="grey">
                    {operationLabel(operation)}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {summary.withoutAccess.length > 0 && (
            <Text size="small" leading="compact" className="text-ui-fg-muted">
              {t("roles.permissions.matrix.detail.noAccessTo", {
                resources: summary.withoutAccess
                  .map((resource) => resourceLabel(resource).toLowerCase())
                  .join(", "),
              })}
            </Text>
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
