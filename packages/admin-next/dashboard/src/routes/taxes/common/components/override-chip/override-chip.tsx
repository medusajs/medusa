import { XMarkMini } from "@medusajs/icons"
import { OverrideOption } from "../../types"

type OverrideChipProps = {
  override: OverrideOption
  onRemove: (value: string) => void
}

export const OverrideChip = ({ override, onRemove }: OverrideChipProps) => {
  return (
    <div className="bg-ui-bg-field shadow-borders-base transition-fg hover:bg-ui-bg-field-hover flex h-7 items-center overflow-hidden rounded-md">
      <div className="txt-compact-small-plus flex h-full select-none items-center justify-center px-2 py-0.5">
        {override.label}
      </div>
      <button
        type="button"
        onClick={() => onRemove(override.value)}
        className="focus-visible:bg-ui-bg-field-hover transition-fg hover:bg-ui-bg-field-hover flex h-full w-7 items-center justify-center border-l outline-none"
      >
        <XMarkMini className="text-ui-fg-muted" />
      </button>
    </div>
  )
}
