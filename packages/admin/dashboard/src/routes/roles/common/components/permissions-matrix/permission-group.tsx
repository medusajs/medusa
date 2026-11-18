import { LockClosedSolidMini, TriangleRightMini } from "@medusajs/icons"
import { Badge, Checkbox, clx, Text } from "@medusajs/ui"
import { Collapsible } from "radix-ui"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { ConditionalTooltip } from "../../../../../components/common/conditional-tooltip"
import {
  useGroupLabels,
  useOperationLabel,
  useResourceLabel,
} from "../../hooks"
import {
  getGroupControlLevel,
  getGroupCounts,
  getGroupLevel,
  getRowState,
  hasViewWarning,
  MatrixGroup,
  MatrixResource,
  setGroupLevel,
  toggleCell,
  toggleColumn,
  toggleRow,
} from "../../utils"
import { LevelControl } from "./level-control"

type PermissionGroupProps = {
  group: MatrixGroup
  matrix: MatrixGroup[]
  selection: Set<string>
  onSelectionChange: (next: Set<string>) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  showKeys: boolean
  /**
   * Extra content rendered at the top of the expanded content.
   */
  children?: ReactNode
}

const READ = "read"

const hasOtherSelected = (resource: MatrixResource, selection: Set<string>) =>
  Object.entries(resource.cells).some(
    ([operation, cell]) => operation !== READ && selection.has(cell.policy.id)
  )

export const PermissionGroup = ({
  group,
  matrix,
  selection,
  onSelectionChange,
  open,
  onOpenChange,
  showKeys,
  children,
}: PermissionGroupProps) => {
  const { t } = useTranslation()
  const resourceLabel = useResourceLabel()
  const operationLabel = useOperationLabel()

  const groupLabels = useGroupLabels()

  const label = groupLabels.label(group.id)
  const description = groupLabels.description(group.id)

  const level = getGroupLevel(group, selection)
  const counts = getGroupCounts(group, selection)

  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center justify-between gap-x-4 px-6 py-4">
        <Collapsible.Trigger className="group flex min-w-0 flex-1 items-start gap-x-2 text-start outline-none focus-visible:shadow-borders-focus">
          <TriangleRightMini className="mt-0.5 shrink-0 text-ui-fg-muted transition-transform group-data-[state='open']:rotate-90 rtl:rotate-180 rtl:group-data-[state='open']:rotate-90" />
          <div className="flex min-w-0 flex-col gap-y-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Text size="small" leading="compact" weight="plus">
                {label}
              </Text>
              <Text
                size="xsmall"
                leading="compact"
                className="font-mono text-ui-fg-subtle"
              >
                {counts.selected}/{counts.total}
              </Text>
              {level === "mixed" && (
                <Badge size="2xsmall" rounded="full" color="orange">
                  {t("roles.permissions.matrix.levels.mixed")}
                </Badge>
              )}
              {counts.locked > 0 && (
                <Badge size="2xsmall" rounded="full" color="grey">
                  <LockClosedSolidMini />
                  {t("roles.permissions.matrix.lockedBadge", {
                    count: counts.locked,
                  })}
                </Badge>
              )}
            </div>
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {description}
            </Text>
          </div>
        </Collapsible.Trigger>
        <LevelControl
          value={getGroupControlLevel(group, selection)}
          onChange={(next) =>
            onSelectionChange(setGroupLevel(group, selection, next))
          }
          label={t("roles.permissions.matrix.levelControlLabel", {
            group: label,
          })}
        />
      </div>
      <Collapsible.Content>
        <div className="border-t bg-ui-bg-subtle">
          {children}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="sticky start-0 bg-ui-bg-subtle px-6 py-2 text-start">
                    <div className="flex items-center gap-x-3">
                      {/* Spacer matching the row checkbox, keeps labels aligned. */}
                      <span aria-hidden className="size-4 shrink-0" />
                      <Text
                        size="xsmall"
                        leading="compact"
                        weight="plus"
                        className="text-ui-fg-subtle"
                      >
                        {t("roles.permissions.matrix.resourceColumn")}
                      </Text>
                    </div>
                  </th>
                  {group.operations.map((operation) => {
                    const name = operationLabel(operation)

                    return (
                      <th key={operation} className="px-3 py-2 text-center">
                        <button
                          type="button"
                          aria-label={t(
                            isColumnOn(group, selection, operation)
                              ? "roles.permissions.matrix.columnToggle.off"
                              : "roles.permissions.matrix.columnToggle.on",
                            { operation: name, group: label }
                          )}
                          onClick={() =>
                            onSelectionChange(
                              toggleColumn(group, selection, operation)
                            )
                          }
                          className="txt-compact-xsmall-plus rounded-md px-1.5 py-0.5 text-ui-fg-subtle outline-none hover:text-ui-fg-base focus-visible:shadow-borders-focus"
                        >
                          {name}
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {group.resources.map((resource) => {
                  const name = resourceLabel(resource.resource)

                  return (
                    <tr
                      key={resource.resource}
                      className="border-b last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="sticky start-0 bg-ui-bg-subtle px-6 py-2 text-start font-normal"
                      >
                        <div className="flex items-start gap-x-3">
                          <Checkbox
                            className="mt-0.5 shrink-0"
                            checked={getRowState(resource, selection)}
                            disabled={
                              !Object.values(resource.cells).some(
                                (cell) => cell.grantable
                              )
                            }
                            aria-label={t(
                              "roles.permissions.matrix.rowToggle",
                              {
                                resource: name,
                              }
                            )}
                            onCheckedChange={() =>
                              onSelectionChange(toggleRow(resource, selection))
                            }
                          />
                          <div className="flex min-w-0 flex-col">
                            <Text size="small" leading="compact">
                              {name}
                            </Text>
                            {hasViewWarning(resource, selection) && (
                              <Text
                                size="xsmall"
                                leading="compact"
                                className="text-ui-fg-error"
                              >
                                {t("roles.permissions.matrix.noViewAccess")}
                              </Text>
                            )}
                            {showKeys && (
                              <Text
                                size="xsmall"
                                leading="compact"
                                className="font-mono text-ui-fg-muted"
                              >
                                {Object.values(resource.cells)
                                  .map((cell) => cell.policy.key)
                                  .join(", ")}
                              </Text>
                            )}
                          </div>
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

                        const checked = selection.has(cell.policy.id)
                        const viewLocked =
                          operation === READ &&
                          checked &&
                          hasOtherSelected(resource, selection)
                        const disabled = !cell.grantable || viewLocked

                        let tooltip: string | undefined
                        if (!cell.grantable) {
                          tooltip = t(
                            checked
                              ? "roles.permissions.matrix.tooltips.cannotRemove"
                              : "roles.permissions.matrix.tooltips.cannotGrant"
                          )
                        } else if (viewLocked) {
                          tooltip = t(
                            "roles.permissions.matrix.tooltips.viewRequired"
                          )
                        }

                        return (
                          <td key={operation} className="px-3 py-2">
                            <ConditionalTooltip
                              showTooltip={disabled}
                              content={tooltip}
                            >
                              <div
                                className={clx(
                                  "flex items-center justify-center gap-x-1"
                                )}
                              >
                                <Checkbox
                                  checked={checked}
                                  disabled={disabled}
                                  aria-label={`${operationLabel(operation)} ${name}`}
                                  onCheckedChange={() =>
                                    onSelectionChange(
                                      toggleCell(
                                        matrix,
                                        selection,
                                        cell.policy.id
                                      )
                                    )
                                  }
                                />
                                {!cell.grantable && (
                                  <LockClosedSolidMini className="text-ui-fg-muted" />
                                )}
                              </div>
                            </ConditionalTooltip>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {counts.locked > 0 && (
            <div className="border-t px-6 py-3">
              <Text
                size="xsmall"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                {t("roles.permissions.matrix.lockedNote", {
                  count: counts.locked,
                })}
              </Text>
            </div>
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

const isColumnOn = (
  group: MatrixGroup,
  selection: Set<string>,
  operation: string
) => {
  const cells = group.resources
    .map((resource) => resource.cells[operation])
    .filter((cell) => cell?.grantable)

  return (
    cells.length > 0 && cells.every((cell) => selection.has(cell.policy.id))
  )
}
