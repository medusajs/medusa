import { Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { OverrideOption } from "../../types"
import { OverrideChip } from "../override-chip"

type OverrideGridProps = {
  overrides: OverrideOption[]
  onRemove: (value: string) => void
  onClear: () => void
}

export const OverrideGrid = ({
  overrides,
  onRemove,
  onClear,
}: OverrideGridProps) => {
  const { t } = useTranslation()

  if (!overrides.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {overrides.map((override) => (
        <OverrideChip
          key={override.value}
          override={override}
          onRemove={onRemove}
        />
      ))}
      <Button
        variant="transparent"
        size="small"
        className="text-ui-fg-muted hover:text-ui-fg-subtle"
        onClick={onClear}
      >
        {t("actions.clearAll")}
      </Button>
    </div>
  )
}
