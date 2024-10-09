import { EllipseMiniSolid } from "@medusajs/icons"
import { Input, Label, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import * as RadioGroup from "@radix-ui/react-radio-group"
import { debounce } from "lodash"
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useTranslation } from "react-i18next"

import { useSelectedParams } from "../hooks"
import { useDataTableFilterContext } from "./context"
import { IFilter } from "./types"
import { TFunction } from "i18next"
import FilterChip from "./filter-chip"

type NumberFilterProps = IFilter

type Comparison = "exact" | "range"
type Operator = "lt" | "gt" | "eq"

export const NumberFilter = ({
  filter,
  prefix,
  readonly,
  openOnMount,
}: NumberFilterProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(openOnMount)

  const { key, label } = filter

  const { removeFilter } = useDataTableFilterContext()
  const selectedParams = useSelectedParams({
    param: key,
    prefix,
    multiple: false,
  })

  const currentValue = selectedParams.get()
  const [previousValue, setPreviousValue] = useState<string[] | undefined>(
    currentValue
  )

  const [operator, setOperator] = useState<Comparison | undefined>(
    getOperator(currentValue)
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>, operator: Operator) => {
      const value = e.target.value
      const curr = JSON.parse(currentValue?.join(",") || "{}")
      const isCurrentNumber = !isNaN(Number(curr))

      const handleValue = (operator: Operator) => {
        if (!value && isCurrentNumber) {
          selectedParams.delete()
          return
        }

        if (curr && !value) {
          delete curr[operator]
          selectedParams.add(JSON.stringify(curr))
          return
        }

        if (!curr) {
          selectedParams.add(JSON.stringify({ [operator]: value }))
          return
        }

        selectedParams.add(JSON.stringify({ ...curr, [operator]: value }))
      }

      switch (operator) {
        case "eq":
          if (!value) {
            selectedParams.delete()
          } else {
            selectedParams.add(value)
          }
          break
        case "lt":
        case "gt":
          handleValue(operator)
          break
      }
    }, 500),
    [selectedParams, currentValue]
  )

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    setPreviousValue(currentValue)

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

  const operators: { operator: Comparison; label: string }[] = [
    {
      operator: "exact",
      label: t("filters.compare.exact"),
    },
    {
      operator: "range",
      label: t("filters.compare.range"),
    },
  ]

  const GT_KEY = `${key}-gt`
  const LT_KEY = `${key}-lt`
  const EQ_KEY = key

  const displayValue = parseDisplayValue(currentValue, t)
  const previousDisplayValue = parseDisplayValue(previousValue, t)

  return (
    <Popover.Root modal open={open} onOpenChange={handleOpenChange}>
      <FilterChip
        hasOperator
        hadPreviousValue={!!previousDisplayValue}
        label={label}
        value={displayValue}
        onRemove={handleRemove}
        readonly={readonly}
      />
      {!readonly && (
        <Popover.Portal>
          <Popover.Content
            data-name="number_filter_content"
            align="start"
            sideOffset={8}
            collisionPadding={24}
            className={clx(
              "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] w-[300px] divide-y overflow-y-auto rounded-lg outline-none"
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
              <RadioGroup.Root
                value={operator}
                onValueChange={(val) => setOperator(val as Comparison)}
                className="flex flex-col items-start"
                orientation="vertical"
                autoFocus
              >
                {operators.map((o) => (
                  <RadioGroup.Item
                    key={o.operator}
                    value={o.operator}
                    className="txt-compact-small hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed transition-fg grid w-full grid-cols-[20px_1fr] gap-2 rounded-[4px] px-2 py-1.5 text-left outline-none"
                  >
                    <div className="size-5">
                      <RadioGroup.Indicator>
                        <EllipseMiniSolid />
                      </RadioGroup.Indicator>
                    </div>
                    <span className="w-full">{o.label}</span>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>
            <div>
              {operator === "range" ? (
                <div className="px-1 pb-3 pt-1" key="range">
                  <div className="px-2 py-1.5">
                    <Label size="xsmall" weight="plus" htmlFor={GT_KEY}>
                      {t("filters.compare.greaterThan")}
                    </Label>
                  </div>
                  <div className="px-2 py-0.5">
                    <Input
                      name={GT_KEY}
                      size="small"
                      type="number"
                      defaultValue={getValue(currentValue, "gt")}
                      onChange={(e) => debouncedOnChange(e, "gt")}
                    />
                  </div>
                  <div className="px-2 py-1.5">
                    <Label size="xsmall" weight="plus" htmlFor={LT_KEY}>
                      {t("filters.compare.lessThan")}
                    </Label>
                  </div>
                  <div className="px-2 py-0.5">
                    <Input
                      name={LT_KEY}
                      size="small"
                      type="number"
                      defaultValue={getValue(currentValue, "lt")}
                      onChange={(e) => debouncedOnChange(e, "lt")}
                    />
                  </div>
                </div>
              ) : (
                <div className="px-1 pb-3 pt-1" key="exact">
                  <div className="px-2 py-1.5">
                    <Label size="xsmall" weight="plus" htmlFor={EQ_KEY}>
                      {label}
                    </Label>
                  </div>
                  <div className="px-2 py-0.5">
                    <Input
                      name={EQ_KEY}
                      size="small"
                      type="number"
                      defaultValue={getValue(currentValue, "eq")}
                      onChange={(e) => debouncedOnChange(e, "eq")}
                    />
                  </div>
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      )}
    </Popover.Root>
  )
}

const parseDisplayValue = (value: string[] | null | undefined, t: TFunction) => {
  const parsed = JSON.parse(value?.join(",") || "{}")
  let displayValue = ""

  if (typeof parsed === "object") {
    const parts = []
    if (parsed.gt) {
      parts.push(t("filters.compare.greaterThanLabel", { value: parsed.gt }))
    }

    if (parsed.lt) {
      parts.push(
        t("filters.compare.lessThanLabel", {
          value: parsed.lt,
        })
      )
    }

    displayValue = parts.join(` ${t("filters.compare.andLabel")} `)
  }

  if (typeof parsed === "number") {
    displayValue = parsed.toString()
  }

  return displayValue
}

const parseValue = (value: string[] | null | undefined) => {
  if (!value) {
    return undefined
  }

  const val = value.join(",")
  if (!val) {
    return undefined
  }

  return JSON.parse(val)
}

const getValue = (
  value: string[] | null | undefined,
  key: Operator
): number | undefined => {
  const parsed = parseValue(value)

  if (typeof parsed === "object") {
    return parsed[key]
  }
  if (typeof parsed === "number" && key === "eq") {
    return parsed
  }

  return undefined
}

const getOperator = (value?: string[] | null): Comparison | undefined => {
  const parsed = parseValue(value)

  return typeof parsed === "object" ? "range" : "exact"
}
