import { Check, TriangleRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, Button, clx, Container, Heading, Text } from "@medusajs/ui"
import { Collapsible } from "radix-ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ConditionalTooltip } from "../../../../../components/common/conditional-tooltip"
import { useRbacPolicies } from "../../../../../hooks/api/rbac-policies"
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
  buildMatrix,
  expandWildcardPolicies,
  getWildcardPolicies,
  hasViewWarning,
  MatrixGroup,
  MatrixPolicy,
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

  // Same query as the permissions matrix, so the two share a cache entry.
  const { policies: allPolicies } = useRbacPolicies(
    { limit: 9999, fields: "id,key,resource,operation" },
    { enabled: canReadPolicies }
  )

  // What the role can do, not only what it stores: its wildcard policies
  // count as every existing policy they match.
  const effectivePolicies = useMemo(
    () =>
      expandWildcardPolicies(
        (role.policies ?? []) as MatrixPolicy[],
        allPolicies ?? []
      ),
    [role.policies, allPolicies]
  )

  const summaries = useMemo(
    () => summarizeRolePolicies(effectivePolicies, allPolicies),
    [effectivePolicies, allPolicies]
  )

  const heldIds = useMemo(
    () => new Set(effectivePolicies.map((policy) => policy.id)),
    [effectivePolicies]
  )

  // Grantability is irrelevant on the detail page, so no assignable ids.
  const matrix = useMemo(() => {
    const byId = new Map<string, MatrixPolicy>()

    for (const policy of [...(allPolicies ?? []), ...effectivePolicies]) {
      if (!byId.has(policy.id)) {
        byId.set(policy.id, policy)
      }
    }

    return buildMatrix([...byId.values()], new Set())
  }, [allPolicies, effectivePolicies])

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
            <GroupRow
              summary={summary}
              group={matrix.find((group) => group.id === summary.id)}
              heldIds={heldIds}
            />
          </li>
        ))}
      </ul>
      {wildcardKeys.length > 0 && (
        <Text
          size="small"
          leading="compact"
          className="px-6 py-4 text-ui-fg-subtle"
        >
          {t("roles.permissions.matrix.detail.wildcards", {
            keys: wildcardKeys.join(", "),
          })}
        </Text>
      )}
    </Container>
  )
}

type GroupRowProps = {
  summary: RoleGroupSummary
  group?: MatrixGroup
  heldIds: Set<string>
}

const GroupRow = ({ summary, group, heldIds }: GroupRowProps) => {
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
        <div className="border-t bg-ui-bg-subtle">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="sticky start-0 bg-ui-bg-subtle px-6 py-2 text-start">
                    <Text
                      size="xsmall"
                      leading="compact"
                      weight="plus"
                      className="text-ui-fg-subtle"
                    >
                      {t("roles.permissions.matrix.resourceColumn")}
                    </Text>
                  </th>
                  {group?.operations.map((operation) => (
                    <th key={operation} className="px-3 py-2 text-center">
                      <Text
                        as="span"
                        size="xsmall"
                        leading="compact"
                        weight="plus"
                        className="text-ui-fg-subtle"
                      >
                        {operationLabel(operation)}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group?.resources.map((resource) => {
                  const holdsAny = Object.values(resource.cells).some((cell) =>
                    heldIds.has(cell.policy.id)
                  )

                  return (
                    <tr
                      key={resource.resource}
                      className="border-b last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="sticky start-0 bg-ui-bg-subtle px-6 py-2 text-start font-normal"
                      >
                        <div className="flex min-w-0 flex-col">
                          <Text
                            size="small"
                            leading="compact"
                            className={clx({ "text-ui-fg-muted": !holdsAny })}
                          >
                            {resourceLabel(resource.resource)}
                          </Text>
                          {hasViewWarning(resource, heldIds) && (
                            <Text
                              size="xsmall"
                              leading="compact"
                              className="text-ui-fg-error"
                            >
                              {t("roles.permissions.matrix.noViewAccess")}
                            </Text>
                          )}
                        </div>
                      </th>
                      {group.operations.map((operation) => {
                        const cell = resource.cells[operation]

                        if (!cell) {
                          return (
                            <td
                              key={operation}
                              className="px-3 py-2 text-center"
                            >
                              <ConditionalTooltip
                                showTooltip
                                content={t(
                                  "roles.permissions.matrix.notAvailableTooltip"
                                )}
                              >
                                <Text
                                  as="span"
                                  size="small"
                                  leading="compact"
                                  className="text-ui-fg-muted"
                                >
                                  {t("roles.permissions.matrix.notAvailable")}
                                </Text>
                              </ConditionalTooltip>
                            </td>
                          )
                        }

                        return (
                          <td key={operation} className="px-3 py-2">
                            <div className="flex items-center justify-center">
                              {heldIds.has(cell.policy.id) ? (
                                <>
                                  <Check className="text-ui-fg-base" />
                                  <span className="sr-only">
                                    {t(
                                      "roles.permissions.matrix.detail.granted"
                                    )}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span
                                    aria-hidden
                                    className="text-ui-fg-muted"
                                  >
                                    &ndash;
                                  </span>
                                  <span className="sr-only">
                                    {t(
                                      "roles.permissions.matrix.detail.notGranted"
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
