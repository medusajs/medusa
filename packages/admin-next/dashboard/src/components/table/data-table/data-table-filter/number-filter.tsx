import * as Popover from "@radix-ui/react-popover"
import { MouseEvent, useState } from "react"

import { XMarkMini } from "@medusajs/icons"
import { Button, Select, Text, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useSelectedParams } from "../hooks"
import { useDataTableFilterContext } from "./context"
import { IFilter } from "./types"

type NumberFilterProps = IFilter

type NumericalComparisonOperator = {
  /**
   * The filtered number must be less than this value.
   */
  lt?: number
  /**
   * The filtered number must be greater than this value.
   */
  gt?: number
  /**
   * The filtered number must be greater than or equal to this value.
   */
  gte?: number
  /**
   * The filtered number must be less than or equal to this value.
   */
  lte?: number
}

type ComparisonOperator = "lt" | "gt" | "equal" | "between"

export const NumberFilter = ({
  filter,
  prefix,
  openOnMount,
}: NumberFilterProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(openOnMount)
  const [operator, setOperator] = useState<ComparisonOperator>("equal")

  const { key, label } = filter

  const { removeFilter } = useDataTableFilterContext()
  const selectedParams = useSelectedParams({ param: key, prefix })

  const currentValue = selectedParams.get()

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const handleOpenChange = (open: boolean) => {
    setOpen(open)

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (!open && !currentValue.length) {
      timeoutId = setTimeout(() => {
        removeFilter(key)
      }, 200)
    }
  }

  const handleRemove = () => {
    selectedParams.delete()
    removeFilter(key)
  }

  const operators: { operator: ComparisonOperator; label: string }[] = [
    {
      operator: "equal",
      label: t("filters.compare.equals"),
    },
    {
      operator: "lt",
      label: t("filters.compare.lessThan"),
    },
    {
      operator: "gt",
      label: t("filters.compare.greaterThan"),
    },
    {
      operator: "between",
      label: t("filters.compare.between"),
    },
  ]

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <NumberDisplay
        label={label}
        value={currentValue[0]}
        onRemove={handleRemove}
      />
      <Popover.Portal>
        <Popover.Content
          data-name="number_filter_content"
          align="start"
          sideOffset={8}
          collisionPadding={24}
          className={clx(
            "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] w-[300px] overflow-hidden rounded-lg"
          )}
          onInteractOutside={(e) => {
            if (e.target instanceof HTMLElement) {
              if (
                e.target.attributes.getNamedItem("data-name")?.value ===
                "filters_menu_content"
              ) {
                e.preventDefault()
              }
            }
          }}
        >
          <div className="p-1">
            <Select>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {operators.map((o) => (
                  <Select.Item key={o.operator} value={o.operator}>
                    {o.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Button size="small" variant="secondary">
              {t("actions.apply")}
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

const NumberDisplay = ({
  label,
  value,
  onRemove,
}: {
  label: string
  value?: string
  onRemove: () => void
}) => {
  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <Popover.Trigger
      asChild
      className={clx(
        "bg-ui-bg-field transition-fg shadow-borders-base text-ui-fg-subtle flex cursor-pointer select-none items-center rounded-md",
        "hover:bg-ui-bg-field-hover",
        "data-[state=open]:bg-ui-bg-field-hover"
      )}
    >
      <div>
        <div
          className={clx("flex items-center justify-center px-2 py-1", {
            "border-r": !!value,
          })}
        >
          <Text size="small" weight="plus" leading="compact">
            {label}
          </Text>
        </div>
        {value && (
          <div className="flex items-center">
            <div key={value} className="border-r p-1 px-2">
              <Text size="small" weight="plus" leading="compact">
                {value}
              </Text>
            </div>
          </div>
        )}
        {value && (
          <div>
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
          </div>
        )}
      </div>
    </Popover.Trigger>
  )
}
