import { EllipseMiniSolid, XMarkMini } from "@medusajs/icons"
import { DatePicker, Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import isEqual from "lodash/isEqual"
import { MouseEvent, useMemo, useState } from "react"

import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../../hooks/use-date"
import { useSelectedParams } from "../hooks"
import { useDataTableFilterContext } from "./context"
import { IFilter } from "./types"

type DateFilterProps = IFilter

type DateComparisonOperator = {
  /**
   * The filtered date must be greater than or equal to this value.
   */
  $gte?: string
  /**
   * The filtered date must be less than or equal to this value.
   */
  $lte?: string
  /**
   * The filtered date must be less than this value.
   */
  $lt?: string
  /**
   * The filtered date must be greater than this value.
   */
  $gt?: string
}

export const DateFilter = ({
  filter,
  prefix,
  openOnMount,
}: DateFilterProps) => {
  const [open, setOpen] = useState(openOnMount)
  const [showCustom, setShowCustom] = useState(false)

  const { getFullDate } = useDate()

  const { key, label } = filter

  const { removeFilter } = useDataTableFilterContext()
  const selectedParams = useSelectedParams({ param: key, prefix })

  const presets = usePresets()

  const handleSelectPreset = (value: DateComparisonOperator) => {
    selectedParams.add(JSON.stringify(value))
    setShowCustom(false)
  }

  const handleSelectCustom = () => {
    selectedParams.delete()
    setShowCustom((prev) => !prev)
  }

  const currentValue = selectedParams.get()

  const currentDateComparison = parseDateComparison(currentValue)
  const customStartValue = getDateFromComparison(currentDateComparison, "$gte")
  const customEndValue = getDateFromComparison(currentDateComparison, "$lte")

  const handleCustomDateChange = (
    value: Date | undefined,
    pos: "start" | "end"
  ) => {
    const key = pos === "start" ? "$gte" : "$lte"
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
    return date ? getFullDate({ date: date }) : undefined
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
    removeFilter(key)
  }

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

  return (
    <Popover.Root modal open={open} onOpenChange={handleOpenChange}>
      <DateDisplay label={label} value={displayValue} onRemove={handleRemove} />
      <Popover.Portal>
        <Popover.Content
          data-name="date_filter_content"
          align="start"
          sideOffset={8}
          collisionPadding={24}
          className={clx(
            "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout h-full max-h-[var(--radix-popper-available-height)] w-[300px] overflow-auto rounded-lg"
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
          <ul className="w-full p-1">
            {presets.map((preset) => {
              const isSelected = selectedParams
                .get()
                .includes(JSON.stringify(preset.value))
              return (
                <li key={preset.label}>
                  <button
                    className="bg-ui-bg-base hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-pressed text-ui-fg-base data-[disabled]:text-ui-fg-disabled txt-compact-small relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none"
                    type="button"
                    onClick={() => {
                      handleSelectPreset(preset.value)
                    }}
                  >
                    <div
                      className={clx(
                        "transition-fg flex h-5 w-5 items-center justify-center",
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
            <li>
              <button
                className="bg-ui-bg-base hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-pressed text-ui-fg-base data-[disabled]:text-ui-fg-disabled txt-compact-small relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none"
                type="button"
                onClick={handleSelectCustom}
              >
                <div
                  className={clx(
                    "transition-fg flex h-5 w-5 items-center justify-center",
                    {
                      "[&_svg]:invisible": !showCustom,
                    }
                  )}
                >
                  <EllipseMiniSolid />
                </div>
                {t("filters.date.custom")}
              </button>
            </li>
          </ul>
          {showCustom && (
            <div className="border-t px-1 pb-3 pt-1">
              <div>
                <div className="px-2 py-1">
                  <Text size="xsmall" leading="compact" weight="plus">
                    {t("filters.date.from")}
                  </Text>
                </div>
                <div className="px-2 py-1">
                  <DatePicker
                    // placeholder="MM/DD/YYYY" TODO: Fix DatePicker component not working with placeholder
                    toDate={customEndValue}
                    value={customStartValue}
                    onChange={(d) => handleCustomDateChange(d, "start")}
                  />
                </div>
              </div>
              <div>
                <div className="px-2 py-1">
                  <Text size="xsmall" leading="compact" weight="plus">
                    {t("filters.date.to")}
                  </Text>
                </div>
                <div className="px-2 py-1">
                  <DatePicker
                    // placeholder="MM/DD/YYYY"
                    fromDate={customStartValue}
                    value={customEndValue || undefined}
                    onChange={(d) => {
                      handleCustomDateChange(d, "end")
                    }}
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

const today = new Date()
today.setHours(0, 0, 0, 0)

const usePresets = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      {
        label: t("filters.date.today"),
        value: {
          $gte: today.toISOString(),
        },
      },
      {
        label: t("filters.date.lastSevenDays"),
        value: {
          $gte: new Date(
            today.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days ago
        },
      },
      {
        label: t("filters.date.lastThirtyDays"),
        value: {
          $gte: new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days ago
        },
      },
      {
        label: t("filters.date.lastNinetyDays"),
        value: {
          $gte: new Date(
            today.getTime() - 90 * 24 * 60 * 60 * 1000
          ).toISOString(), // 90 days ago
        },
      },
      {
        label: t("filters.date.lastTwelveMonths"),
        value: {
          $gte: new Date(
            today.getTime() - 365 * 24 * 60 * 60 * 1000
          ).toISOString(), // 365 days ago
        },
      },
    ],
    [t]
  )
}

const parseDateComparison = (value: string[]) => {
  return value?.length
    ? (JSON.parse(value.join(",")) as DateComparisonOperator)
    : null
}

const getDateFromComparison = (
  comparison: DateComparisonOperator | null,
  key: "$gte" | "$lte"
) => {
  return comparison?.[key] ? new Date(comparison[key] as string) : undefined
}
