import { XMarkMini } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { MouseEvent } from "react"
import * as Popover from "@radix-ui/react-popover"

export type FilterChipProps = {
  hadPreviousValue?: boolean
  label: string
  value?: string
  readonly?: boolean
  hasOperator?: boolean
  onRemove: () => void
}

const FilterChip = ({
  hadPreviousValue,
  label,
  value,
  readonly,
  hasOperator,
  onRemove,
}: FilterChipProps) => {
  const { t } = useTranslation()

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <div
      className="bg-ui-bg-field transition-fg shadow-borders-base text-ui-fg-subtle flex cursor-default select-none items-stretch overflow-hidden rounded-md"
    >
      {!hadPreviousValue && (
        <Popover.Anchor />
      )}
      <div
        className={clx(
          "flex items-center justify-center whitespace-nowrap px-2 py-1",
          {
            "border-r": !!(value || hadPreviousValue),
          }
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          {label}
        </Text>
      </div>
      <div className="flex w-full items-center overflow-hidden">
        {hasOperator && !!(value || hadPreviousValue) && (
          <div className="border-r p-1 px-2">
            <Text
              size="small"
              weight="plus"
              leading="compact"
              className="text-ui-fg-muted"
            >
              {t("general.is")}
            </Text>
          </div>
        )}
        {!!(value || hadPreviousValue) && (
          <Popover.Trigger asChild className={clx("flex-1 cursor-pointer overflow-hidden border-r p-1 px-2",
            {
              "hover:bg-ui-bg-field-hover": !readonly,
              "data-[state=open]:bg-ui-bg-field-hover": !readonly,
            }
          )}>
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="truncate text-nowrap"
            >
              {value || "\u00A0"}
            </Text>
          </Popover.Trigger>
        )}
      </div>
      {!readonly && !!(value || hadPreviousValue) && (
        <button
          onClick={handleRemove}
          className={clx(
            "text-ui-fg-muted transition-fg flex items-center justify-center p-1",
            "hover:bg-ui-bg-subtle-hover",
            "active:bg-ui-bg-subtle-pressed active:text-ui-fg-base"
          )}
        >
          <XMarkMini />
        </button>
      )}
    </div>
  )
}

export default FilterChip
