import { Button, Checkbox, Container, Input, Label, Text } from "@medusajs/ui"
import { useId, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Skeleton } from "../../../../../components/common/skeleton"
import { CUSTOM_GROUP_ID } from "../../constants"
import { useGroupLabels, useResourceLabel } from "../../hooks"
import { filterMatrix, MatrixGroup } from "../../utils"
import { PermissionGroup } from "./permission-group"

const CUSTOM_POLICIES_GUIDE_URL =
  "https://docs.medusajs.com/resources/enterprise/rbac/define-policies"

type PermissionsMatrixProps = {
  matrix: MatrixGroup[]
  selection: Set<string>
  onSelectionChange: (next: Set<string>) => void
  /**
   * Called when "Clear all" is pressed. The parent decides whether to confirm.
   */
  onClearAll: () => void
  isLoading?: boolean
}

export const PermissionsMatrix = ({
  matrix,
  selection,
  onSelectionChange,
  onClearAll,
  isLoading,
}: PermissionsMatrixProps) => {
  const { t } = useTranslation()
  const resourceLabel = useResourceLabel()
  const groupLabels = useGroupLabels()
  const showKeysId = useId()

  const [query, setQuery] = useState("")
  const [showKeys, setShowKeys] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const visible = useMemo(
    () =>
      filterMatrix(matrix, query, {
        group: groupLabels.label,
        resource: resourceLabel,
      }),
    [matrix, query, resourceLabel, groupLabels]
  )

  const isSearching = query.trim().length > 0

  const handleOpenChange = (id: string, open: boolean) => {
    setExpanded((current) => {
      const next = new Set(current)

      if (open) {
        next.add(id)
      } else {
        next.delete(id)
      }

      return next
    })
  }

  return (
    <Container className="divide-y overflow-hidden p-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-6 py-4">
        <div className="min-w-[200px] flex-1">
          <Input
            type="search"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              // The matrix lives inside the role form, so Enter must not submit it.
              if (e.key === "Enter") {
                e.preventDefault()
              }
            }}
            placeholder={t("roles.permissions.matrix.search.placeholder")}
            aria-label={t("roles.permissions.matrix.search.placeholder")}
          />
        </div>
        <div className="flex items-center gap-x-2">
          <Checkbox
            id={showKeysId}
            checked={showKeys}
            onCheckedChange={(value) => setShowKeys(value === true)}
          />
          <Label htmlFor={showKeysId} size="small" weight="plus">
            {t("roles.permissions.matrix.showKeys")}
          </Label>
        </div>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClearAll}
        >
          {t("roles.permissions.matrix.clearAll")}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-y-4 px-6 py-4" aria-busy>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-y-1 px-6 py-12 text-center">
          <Text size="small" leading="compact" weight="plus">
            {t("roles.permissions.matrix.search.emptyHeading")}
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("roles.permissions.matrix.search.emptyDescription")}
          </Text>
        </div>
      ) : (
        visible.map((group) => (
          <PermissionGroup
            key={group.id}
            group={group}
            matrix={matrix}
            selection={selection}
            onSelectionChange={onSelectionChange}
            open={isSearching || expanded.has(group.id)}
            onOpenChange={(open) => handleOpenChange(group.id, open)}
            showKeys={showKeys}
          >
            {group.id === CUSTOM_GROUP_ID && (
              <div className="m-6 mb-3 flex flex-col gap-y-1 rounded-lg bg-ui-bg-base p-4 shadow-elevation-card-rest">
                <Text size="small" leading="compact" weight="plus">
                  {t("roles.permissions.matrix.custom.calloutHeading")}
                </Text>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {t("roles.permissions.matrix.custom.calloutDescription")}
                </Text>
                <a
                  href={CUSTOM_POLICIES_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="txt-compact-small-plus text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                >
                  {t("roles.permissions.matrix.custom.calloutAction")}
                </a>
              </div>
            )}
          </PermissionGroup>
        ))
      )}
    </Container>
  )
}
