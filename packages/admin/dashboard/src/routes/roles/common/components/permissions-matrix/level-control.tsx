import { clx } from "@medusajs/ui"
import { ToggleGroup } from "radix-ui"
import { useTranslation } from "react-i18next"

import { useDocumentDirection } from "../../../../../hooks/use-document-direction"
import { GroupLevel } from "../../utils"

type LevelControlProps = {
  /**
   * The current level. `mixed` means no option is pressed.
   */
  value: GroupLevel
  onChange: (level: "none" | "view" | "full") => void
  label: string
}

const OPTIONS = ["none", "view", "full"] as const

export const LevelControl = ({ value, onChange, label }: LevelControlProps) => {
  const { t } = useTranslation()
  const direction = useDocumentDirection()

  return (
    <ToggleGroup.Root
      type="single"
      dir={direction}
      aria-label={label}
      value={value === "mixed" ? "" : value}
      onValueChange={(next) => {
        // Pressing the pressed option reports an empty value, which is ignored
        // so a level can't be cleared.
        if (next) {
          onChange(next as (typeof OPTIONS)[number])
        }
      }}
      className="flex items-center gap-x-px rounded-md bg-ui-bg-disabled p-px"
    >
      {OPTIONS.map((option) => (
        <ToggleGroup.Item
          key={option}
          value={option}
          className={clx(
            "txt-compact-small-plus rounded-[4px] px-2 py-1 text-ui-fg-muted outline-none transition-fg",
            "hover:text-ui-fg-base focus-visible:shadow-borders-focus",
            "data-[state=on]:bg-ui-button-neutral data-[state=on]:text-ui-fg-base data-[state=on]:shadow-buttons-neutral"
          )}
        >
          {t(`roles.permissions.matrix.levels.${option}`)}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
