import { EllipseMiniSolid, XMarkMini } from "@medusajs/icons"
import { DatePicker, Label, Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { format } from "date-fns"
import isEqual from "lodash/isEqual"
import { MouseEvent, useState } from "react"

import { type DataTableFilterProps } from "../types"
import { useDataTableFacetedFilterContext, useSelectedParams } from "./hooks"

type DateFilterProps = DataTableFilterProps

type DateComparisonOperator = {
  gte?: string
  lte?: string
  lt?: string
  gt?: string
}

export const DateFilter = ({
  filter,
  prefix,
  openOnMount,
}: DateFilterProps) => {
  const [open, setOpen] = useState(openOnMount)
  const [showCustom, setShowCustom] = useState(false)
  const { key, label } = filter
  const { removeFilter } = useDataTableFacetedFilterContext()
  const identifier = prefix ? `${prefix}_${key}` : key
  const selectedParams = useSelectedParams({ title: identifier })

  const handleSelectPreset = (value: DateComparisonOperator) => {
    selectedParams.add(JSON.stringify(value))
    setShowCustom(false)
  }

  const handleSelectCustom = (e) => {
    e.stopPropagation()
    e.preventDefault()
    selectedParams.delete()
    setShowCustom((prev) => !prev)
  }

  const currentValue = selectedParams.get()
  const currentDateComparison = parseDateComparison(currentValue)
  const customStartValue = getDateFromComparison(currentDateComparison, "gte")
  const customEndValue = getDateFromComparison(currentDateComparison, "lte")

  const handleCustomDateChange = (
    value: Date | undefined,
    pos: "start" | "end"
  ) => {
    const key = pos === "start" ? "gte" : "lte"
    const dateValue = value ? value.toISOString() : undefined

    selectedParams.add(
      JSON.stringify({
        ...(currentDateComparison || {}),
        [key]: dateValue,
      })
    )
  }

  const getDisplayValueFromPresets = () => {
    const preset = presets.find((p) => isEqual(p.value, currentDateComparison))
    return preset?.label
  }

  const formatCustomDate = (date: Date | undefined) => {
    return date ? format(date, "MM/dd/yyyy") : undefined
  }

  const getCustomDisplayValue = () => {
    const formattedDates = [customStartValue, customEndValue].map(
      formatCustomDate
    )
    return formattedDates.filter(Boolean).join(" - ")
  }

  const displayValue = getDisplayValueFromPresets() || getCustomDisplayValue()

  const handleRemove = () => {
    selectedParams.delete()
  }

  return (
    <Popover.Root defaultOpen={openOnMount}>
      <DateDisplay label={label} value={displayValue} onRemove={handleRemove} />
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={24}
          className={clx(
            "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] w-[300px] overflow-hidden rounded-lg p-1",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
          onPointerDownOutside={(e) => {
            console.log(e.target)
          }}
          onInteractOutside={(e) => {
            console.log(e.target)
          }}
        >
          <ul className="w-full">
            {presets.map((preset) => {
              const isSelected = selectedParams
                .get()
                .includes(JSON.stringify(preset.value))
              return (
                <li key={preset.label} className="p-1">
                  <button
                    className="capitalize txt-compact-small flex items-center gap-x-2 py-1 px-2 select-none w-full"
                    type="button"
                    onClick={() => {
                      handleSelectPreset(preset.value)
                    }}
                  >
                    <div
                      className={clx(
                        "w-5 h-5 flex items-center justify-center transition-fg",
                        {
                          "[&_svg]:invisible": !isSelected,
                        }
                      )}
                    >
                      <EllipseMiniSolid />
                    </div>
                    {preset.label}
                  </button>
                </li>
              )
            })}
            <li className="p-1">
              <button
                className="capitalize txt-compact-small flex items-center gap-x-2 py-1 px-2 select-none w-full"
                type="button"
                onClick={handleSelectCustom}
              >
                <div
                  className={clx(
                    "w-5 h-5 flex items-center justify-center transition-fg",
                    {
                      "[&_svg]:invisible": !showCustom,
                    }
                  )}
                >
                  <EllipseMiniSolid />
                </div>
                Custom
              </button>
            </li>
          </ul>
          {showCustom && (
            <div className="border-t pt-1 px-1 pb-3">
              <div>
                <div className="px-2 py-1">
                  <Label>Starting</Label>
                </div>
                <div className="px-2 py-1">
                  <DatePicker
                    placeholder="MM/DD/YYYY"
                    value={customStartValue}
                    onChange={(d) => handleCustomDateChange(d, "start")}
                  />
                </div>
              </div>
              <div>
                <div className="px-2 py-1">
                  <Label>Ending</Label>
                </div>
                <div className="px-2 py-1">
                  <DatePicker
                    placeholder="MM/DD/YYYY"
                    value={customEndValue || undefined}
                    onChange={(d) => handleCustomDateChange(d, "end")}
                  />
                </div>
              </div>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

type DateDisplayProps = {
  label: string
  value?: string
  onRemove: () => void
}

const DateDisplay = ({ label, value, onRemove }: DateDisplayProps) => {
  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <Popover.Trigger asChild>
      <div
        className={clx(
          "bg-ui-bg-field transition-fg shadow-borders-base rounded-md flex items-center text-ui-fg-subtle select-none",
          "hover:bg-ui-bg-field-hover"
        )}
      >
        <div className="flex items-center justify-center px-2 py-1 border-r">
          <Text size="small" weight="plus" leading="compact">
            {label}
          </Text>
        </div>
        <div className="flex items-center">
          {value && (
            <div key={value} className="px-2 p-1 border-r">
              <Text size="small" weight="plus" leading="compact">
                {value}
              </Text>
            </div>
          )}
        </div>
        {value && (
          <div>
            <button
              onClick={handleRemove}
              className={clx(
                "flex items-center justify-center p-1 text-ui-fg-muted transition-fg",
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

const today = new Date()
today.setHours(0, 0, 0, 0)

const presets: { label: string; value: DateComparisonOperator }[] = [
  {
    label: "Today",
    value: {
      gte: today.toISOString(),
    },
  },
  {
    label: "Last 7 days",
    value: {
      gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
  },
  {
    label: "Last 30 days",
    value: {
      gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
  },
  {
    label: "Last 90 days",
    value: {
      gte: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    },
  },
  {
    label: "Last 12 months",
    value: {
      gte: new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 365 days ago
    },
  },
]

const parseDateComparison = (value: string[]) => {
  return value?.length
    ? (JSON.parse(value.join(",")) as DateComparisonOperator)
    : null
}

const getDateFromComparison = (
  comparison: DateComparisonOperator | null,
  key: "gte" | "lte"
) => {
  return comparison?.[key] ? new Date(comparison[key] as string) : undefined
}
