import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { LEVEL_COLORS } from "../../constants"
import { useGroupLabels } from "../../hooks"
import { getGroupCounts, getGroupLevel, MatrixGroup } from "../../utils"

type PermissionsSummaryProps = {
  name?: string
  matrix: MatrixGroup[]
  selection: Set<string>
  /**
   * When passed, an unsaved changes line is shown.
   */
  changes?: { added: number; removed: number }
  /**
   * Keys of wildcard policies the role holds. They are not part of the matrix.
   */
  wildcardKeys?: string[]
}

export const PermissionsSummary = ({
  name,
  matrix,
  selection,
  changes,
  wildcardKeys,
}: PermissionsSummaryProps) => {
  const { t } = useTranslation()
  const groupLabels = useGroupLabels()

  const counts = matrix.map((group) => getGroupCounts(group, selection))
  const selected = counts.reduce((sum, count) => sum + count.selected, 0)
  const total = counts.reduce((sum, count) => sum + count.total, 0)

  return (
    <Container className="flex flex-col gap-y-4 p-6">
      <Heading level="h2">
        {t("roles.permissions.matrix.summary.heading")}
      </Heading>
      <div className="flex flex-col gap-y-1">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {t("roles.permissions.matrix.summary.name")}
        </Text>
        <Text size="small" leading="compact" weight="plus">
          {name?.trim() || "-"}
        </Text>
      </div>
      <div className="flex flex-col gap-y-1">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {t("roles.permissions.matrix.summary.permissions")}
        </Text>
        <Text size="small" leading="compact" weight="plus">
          {t("roles.permissions.matrix.summary.selectedOfTotal", {
            selected,
            total,
          })}
        </Text>
        {changes && (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {changes.added === 0 && changes.removed === 0
              ? t("roles.permissions.matrix.summary.noChanges")
              : `${t("roles.permissions.matrix.summary.unsavedChanges")}: ${t(
                  "roles.permissions.matrix.summary.changes",
                  { added: changes.added, removed: changes.removed }
                )}`}
          </Text>
        )}
      </div>
      <ul className="flex flex-col gap-y-2 border-t pt-4">
        {matrix.map((group, index) => {
          const level = getGroupLevel(group, selection)
          const { selected, total } = counts[index]

          return (
            <li
              key={group.id}
              className="flex items-center justify-between gap-x-2"
            >
              <Text size="small" leading="compact">
                {groupLabels.label(group.id)}
              </Text>
              <div className="flex items-center gap-x-2">
                {level === "mixed" && (
                  <Text
                    size="xsmall"
                    leading="compact"
                    className="font-mono text-ui-fg-subtle"
                  >
                    {selected}/{total}
                  </Text>
                )}
                <Badge
                  size="2xsmall"
                  rounded="full"
                  color={LEVEL_COLORS[level]}
                >
                  {t(`roles.permissions.matrix.levels.${level}`)}
                </Badge>
              </div>
            </li>
          )
        })}
      </ul>
      {!!wildcardKeys?.length && (
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {t("roles.permissions.matrix.summary.wildcards", {
            keys: wildcardKeys.join(", "),
          })}
        </Text>
      )}
      <Text size="xsmall" leading="compact" className="text-ui-fg-muted">
        {t("roles.permissions.matrix.summary.footnote")}
      </Text>
    </Container>
  )
}
