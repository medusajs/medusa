import { CheckMini, EllipseMiniSolid, XMark, XMarkMini, MagnifyingGlass } from "@zjedene-medusa/icons"
import * as React from "react"

import { useDataTableContext } from "@/blocks/data-table/context/use-data-table-context"
import type {
  DataTableDateComparisonOperator,
  DataTableNumberComparisonOperator,
  DataTableDateFilterProps,
  DataTableMultiselectFilterProps,
  DataTableStringFilterProps,
  DataTableNumberFilterProps,
  DataTableCustomFilterProps,
  DataTableFilterOption,
} from "@/blocks/data-table/types"
import { isDateComparisonOperator } from "@/blocks/data-table/utils/is-date-comparison-operator"
import { DatePicker } from "@/components/date-picker"
import { Label } from "@/components/label"
import { Popover } from "@/components/popover"
import { Input } from "@/components/input"
import { Select } from "@/components/select"
import { Checkbox } from "@/components/checkbox"
import { clx } from "@/utils/clx"

interface DataTableFilterProps {
  id: string
  filter: unknown
  isNew?: boolean
  onUpdate?: (value: unknown) => void
  onRemove?: () => void
}

const DEFAULT_FORMAT_DATE_VALUE = (d: Date) =>
  d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
const DEFAULT_RANGE_OPTION_LABEL = "Custom"
const DEFAULT_RANGE_OPTION_START_LABEL = "Starting"
const DEFAULT_RANGE_OPTION_END_LABEL = "Ending"

const DataTableFilter = ({ id, filter, isNew = false, onUpdate, onRemove }: DataTableFilterProps) => {
  const { instance } = useDataTableContext()

  // Initialize open state based on isNew prop
  const [open, setOpen] = React.useState(isNew)
  const [hasInteracted, setHasInteracted] = React.useState(false)

  const meta = instance.getFilterMeta(id)

  if (!meta) {
    return null
  }

  const { type, label, ...rest } = meta
  const options = (meta as any).options

  // Helper to check if filter has a meaningful value
  const hasValue = React.useMemo(() => {
    if (filter === null || filter === undefined) return false
    if (typeof filter === "string" && filter === "") return false
    if (Array.isArray(filter) && filter.length === 0) return false
    if (typeof filter === "number") return true
    if (isDateComparisonOperator(filter)) {
      return !!(filter.$gte || filter.$lte || filter.$gt || filter.$lt)
    }
    if (typeof filter === "object" && filter !== null) {
      // For number comparison operators
      const keys = Object.keys(filter)
      return keys.length > 0 && (filter as any)[keys[0]] !== null && (filter as any)[keys[0]] !== undefined
    }
    return true
  }, [filter])

  const onOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)

      // Mark as interacted when user closes
      if (!newOpen && open) {
        setHasInteracted(true)
      }

      // If closing without a value, remove filter
      // For new filters that haven't been interacted with, remove immediately
      if (!newOpen && !hasValue) {
        // Only remove if it's a new filter being closed without interaction,
        // or if it's an existing filter with no value
        if ((isNew && !hasInteracted) || !isNew) {
          if (onRemove) {
            onRemove()
          } else {
            instance.removeFilter(id)
          }
        }
      }
    },
    [instance, id, open, hasInteracted, isNew, hasValue, onRemove]
  )

  const removeFilter = React.useCallback(() => {
    if (onRemove) {
      onRemove()
    } else {
      instance.removeFilter(id)
    }
  }, [instance, id, onRemove])

  const { displayValue, isCustomRange } = React.useMemo(() => {
    let displayValue: string | null = null
    let isCustomRange = false

    if (typeof filter === "string") {
      // For string filters without options, just show the value
      if (!options || options.length === 0) {
        displayValue = filter
      } else {
        displayValue = options?.find((o: any) => o.value === filter)?.label ?? null
      }
    }

    if (typeof filter === "number") {
      displayValue = String(filter)
    }

    if (Array.isArray(filter)) {
      displayValue =
        filter
          .map((v) => options?.find((o: any) => o.value === v)?.label)
          .join(", ") ?? null
    }

    if (isDateComparisonOperator(filter)) {
      // First check if it matches a predefined option
      displayValue =
        options?.find((o: any) => {
          if (!isDateComparisonOperator(o.value)) {
            return false
          }

          return (
            (filter.$gte === o.value.$gte || (!filter.$gte && !o.value.$gte)) &&
            (filter.$lte === o.value.$lte || (!filter.$lte && !o.value.$lte)) &&
            (filter.$gt === o.value.$gt || (!filter.$gt && !o.value.$gt)) &&
            (filter.$lt === o.value.$lt || (!filter.$lt && !o.value.$lt))
          )
        })?.label ?? null

      // If no match found, it's a custom range
      if (!displayValue && isDateFilterProps(meta)) {
        isCustomRange = true
        const formatDateValue = meta.formatDateValue
          ? meta.formatDateValue
          : DEFAULT_FORMAT_DATE_VALUE

        if (filter.$gte && !filter.$lte) {
          displayValue = `${meta.rangeOptionStartLabel || DEFAULT_RANGE_OPTION_START_LABEL
            } ${formatDateValue(new Date(filter.$gte))}`
        }

        if (filter.$lte && !filter.$gte) {
          displayValue = `${meta.rangeOptionEndLabel || DEFAULT_RANGE_OPTION_END_LABEL
            } ${formatDateValue(new Date(filter.$lte))}`
        }

        if (filter.$gte && filter.$lte) {
          displayValue = `${formatDateValue(
            new Date(filter.$gte)
          )} - ${formatDateValue(new Date(filter.$lte))}`
        }
      }
    }

    // Handle number comparison operators
    if (typeof filter === "object" && filter !== null && !Array.isArray(filter) && !isDateComparisonOperator(filter)) {
      const operators: Record<string, string> = {
        $eq: "=",
        $gt: ">",
        $gte: "≥",
        $lt: "<",
        $lte: "≤",
      }

      const op = Object.keys(filter)[0]
      const opLabel = operators[op] || op
      const value = (filter as any)[op]

      if (typeof value === "number") {
        displayValue = `${opLabel} ${value}`
      }
    }

    return { displayValue, isCustomRange }
  }, [filter, options, meta])

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <div
        className={clx(
          "bg-ui-bg-field flex flex-shrink-0 items-stretch overflow-hidden rounded-md",
          "txt-compact-small-plus shadow-borders-base"
        )}
      >
        {!hasValue && isNew && <Popover.Anchor />}
        <div
          className={clx(
            "flex items-center px-2 py-1 text-ui-fg-muted",
            {
              "border-r": hasValue
            }
          )}
        >
          {label || id}
        </div>
        {hasValue && (
          <>
            {(type === "select" || type === "multiselect" || type === "radio") && (
              <div className="flex items-center border-r px-2 py-1 text-ui-fg-muted">
                is
              </div>
            )}
            <Popover.Trigger asChild>
              <button
                className={clx(
                  "flex flex-1 items-center px-2 py-1 outline-none",
                  "hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed transition-fg",
                  {
                    "text-ui-fg-subtle": displayValue,
                    "text-ui-fg-muted": !displayValue,
                    "min-w-[80px] justify-center": !displayValue,
                    "border-r": true
                  }
                )}
              >
                {displayValue || "\u00A0"}
              </button>
            </Popover.Trigger>
            <button
              type="button"
              className="flex size-7 items-center justify-center text-ui-fg-muted outline-none hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed transition-fg"
              onClick={removeFilter}
            >
              <XMark />
            </button>
          </>
        )}
      </div>
      <Popover.Content
        align="start"
        sideOffset={8}
        collisionPadding={16}
        hideWhenDetached
        className="bg-ui-bg-component p-0 outline-none"
        onOpenAutoFocus={(e) => {
          if (isNew) {
            // For new filters, ensure the first input gets focus
            const target = e.currentTarget as HTMLElement
            if (target) {
              const firstInput = target.querySelector(
                'input:not([type="hidden"]), [role="list"][tabindex="0"]'
              ) as HTMLElement | null
              firstInput?.focus()
            }
          }
        }}
        onCloseAutoFocus={(e) => {
          // Prevent focus from going to the trigger when closing
          e.preventDefault()
        }}
        onInteractOutside={(e) => {
          // Check if the click is on a filter menu item
          const target = e.target as HTMLElement
          if (target.closest('[role="menuitem"]')) {
            e.preventDefault()
          }
        }}
      >
        {(() => {
          switch (type) {
            case "select":
              return (
                <DataTableFilterSelectContent
                  id={id}
                  filter={filter as string[] | undefined}
                  options={options as DataTableFilterOption<string>[]}
                  isNew={isNew}
                  onUpdate={onUpdate}
                />
              )
            case "radio":
              return (
                <DataTableFilterRadioContent
                  id={id}
                  filter={filter}
                  options={options as DataTableFilterOption<string>[]}
                  onUpdate={onUpdate}
                />
              )
            case "date":
              const dateRest = rest as Omit<DataTableDateFilterProps, 'id' | 'type' | 'label' | 'options'>
              return (
                <DataTableFilterDateContent
                  id={id}
                  filter={filter}
                  options={
                    options as DataTableFilterOption<DataTableDateComparisonOperator>[]
                  }
                  isCustomRange={isCustomRange}
                  format={dateRest.format}
                  rangeOptionLabel={dateRest.rangeOptionLabel}
                  disableRangeOption={dateRest.disableRangeOption}
                  rangeOptionStartLabel={dateRest.rangeOptionStartLabel}
                  rangeOptionEndLabel={dateRest.rangeOptionEndLabel}
                  onUpdate={onUpdate}
                />
              )
            case "multiselect":
              const multiselectRest = rest as Omit<DataTableMultiselectFilterProps, 'id' | 'type' | 'label' | 'options'>
              return (
                <DataTableFilterMultiselectContent
                  id={id}
                  filter={filter as string[] | undefined}
                  options={options as DataTableFilterOption<string>[]}
                  searchable={multiselectRest.searchable}
                  onUpdate={onUpdate}
                />
              )
            case "string":
              const stringRest = rest as Omit<DataTableStringFilterProps, 'id' | 'type' | 'label'>
              return (
                <DataTableFilterStringContent
                  id={id}
                  filter={filter as string | undefined}
                  placeholder={stringRest.placeholder}
                  onUpdate={onUpdate}
                />
              )
            case "number":
              const numberRest = rest as Omit<DataTableNumberFilterProps, 'id' | 'type' | 'label'>
              return (
                <DataTableFilterNumberContent
                  id={id}
                  filter={filter}
                  placeholder={numberRest.placeholder}
                  includeOperators={numberRest.includeOperators}
                  onUpdate={onUpdate}
                />
              )
            case "custom":
              const customRest = rest as Omit<DataTableCustomFilterProps, 'id' | 'type' | 'label'>
              return (
                <DataTableFilterCustomContent
                  id={id}
                  filter={filter}
                  onRemove={removeFilter}
                  render={customRest.render}
                  onUpdate={onUpdate}
                />
              )
            default:
              return null
          }
        })()}
      </Popover.Content>
    </Popover>
  )
}
DataTableFilter.displayName = "DataTable.Filter"

type DataTableFilterDateContentProps = {
  id: string
  filter: unknown
  options: DataTableFilterOption<DataTableDateComparisonOperator>[]
  isCustomRange: boolean
  onUpdate?: (value: unknown) => void
} & Pick<
  DataTableDateFilterProps,
  | "format"
  | "rangeOptionLabel"
  | "disableRangeOption"
  | "rangeOptionStartLabel"
  | "rangeOptionEndLabel"
>

const DataTableFilterDateContent = ({
  id,
  filter,
  options,
  format = "date",
  rangeOptionLabel = DEFAULT_RANGE_OPTION_LABEL,
  rangeOptionStartLabel = DEFAULT_RANGE_OPTION_START_LABEL,
  rangeOptionEndLabel = DEFAULT_RANGE_OPTION_END_LABEL,
  disableRangeOption = false,
  isCustomRange,
  onUpdate,
}: DataTableFilterDateContentProps) => {
  const currentValue = filter as DataTableDateComparisonOperator | undefined
  const { instance } = useDataTableContext()
  const [isCustom, setIsCustom] = React.useState(isCustomRange)

  // Sync isCustom state when isCustomRange changes
  React.useEffect(() => {
    setIsCustom(isCustomRange)
  }, [isCustomRange])

  const selectedValue = React.useMemo(() => {
    if (!currentValue || isCustom) {
      return undefined
    }

    return JSON.stringify(currentValue)
  }, [currentValue, isCustom])

  const onValueChange = React.useCallback(
    (valueStr: string) => {
      setIsCustom(false)

      const value = JSON.parse(valueStr) as DataTableDateComparisonOperator
      if (onUpdate) {
        onUpdate(value)
      } else {
        instance.updateFilter({ id, value })
      }
    },
    [instance, id, onUpdate]
  )

  const onSelectCustom = React.useCallback(() => {
    setIsCustom(true)
    // Don't clear the value when selecting custom - keep the current value
  }, [])

  const onCustomValueChange = React.useCallback(
    (input: "$gte" | "$lte", value: Date | null) => {
      const newCurrentValue = { ...currentValue }
      newCurrentValue[input] = value ? value.toISOString() : undefined
      if (onUpdate) {
        onUpdate(newCurrentValue)
      } else {
        instance.updateFilter({ id, value: newCurrentValue })
      }
    },
    [instance, id, currentValue, onUpdate]
  )

  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation(
    options,
    (index) => {
      if (index === options.length && !disableRangeOption) {
        onSelectCustom()
      } else {
        onValueChange(JSON.stringify(options[index].value))
      }
    },
    disableRangeOption ? 0 : 1
  )

  const granularity = format === "date-time" ? "minute" : "day"

  const maxDate = currentValue?.$lte
    ? granularity === "minute"
      ? new Date(currentValue.$lte)
      : new Date(new Date(currentValue.$lte).setHours(23, 59, 59, 999))
    : undefined

  const minDate = currentValue?.$gte
    ? granularity === "minute"
      ? new Date(currentValue.$gte)
      : new Date(new Date(currentValue.$gte).setHours(0, 0, 0, 0))
    : undefined

  const initialFocusedIndex = isCustom ? options.length : 0

  const onListFocus = React.useCallback(() => {
    if (focusedIndex === -1) {
      setFocusedIndex(initialFocusedIndex)
    }
  }, [focusedIndex, initialFocusedIndex])

  return (
    <React.Fragment>
      <div
        className="flex flex-col p-1 outline-none"
        tabIndex={0}
        role="list"
        onFocus={onListFocus}
        autoFocus
      >
        {options.map((option, idx) => {
          const value = JSON.stringify(option.value)
          const isSelected = selectedValue === value

          return (
            <OptionButton
              key={idx}
              index={idx}
              option={option}
              isSelected={isSelected}
              isFocused={focusedIndex === idx}
              onClick={() => onValueChange(value)}
              onMouseEvent={setFocusedIndex}
              icon={EllipseMiniSolid}
            />
          )
        })}
        {!disableRangeOption && (
          <OptionButton
            index={options.length}
            option={{
              label: rangeOptionLabel,
              value: "__custom",
            }}
            icon={EllipseMiniSolid}
            isSelected={isCustom}
            isFocused={focusedIndex === options.length}
            onClick={onSelectCustom}
            onMouseEvent={setFocusedIndex}
          />
        )}
      </div>
      {!disableRangeOption && isCustom && (
        <React.Fragment>
          <div className="flex flex-col py-[3px]">
            <div className="bg-ui-border-menu-top h-px w-full" />
            <div className="bg-ui-border-menu-bot h-px w-full" />
          </div>
          <div className="flex flex-col gap-2 px-2 pb-3 pt-1">
            <div className="flex flex-col gap-1">
              <Label id="custom-start-date-label" size="xsmall" weight="plus">
                {rangeOptionStartLabel}
              </Label>
              <DatePicker
                aria-labelledby="custom-start-date-label"
                granularity={granularity}
                maxValue={maxDate}
                value={currentValue?.$gte ? new Date(currentValue.$gte) : null}
                onChange={(value) => onCustomValueChange("$gte", value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label id="custom-end-date-label" size="xsmall" weight="plus">
                {rangeOptionEndLabel}
              </Label>
              <DatePicker
                aria-labelledby="custom-end-date-label"
                granularity={granularity}
                minValue={minDate}
                value={currentValue?.$lte ? new Date(currentValue.$lte) : null}
                onChange={(value) => onCustomValueChange("$lte", value)}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

type DataTableFilterSelectContentProps = {
  id: string
  filter?: string[]
  options: DataTableFilterOption<string>[]
  isNew?: boolean
  onUpdate?: (value: unknown) => void
}

const DataTableFilterSelectContent = ({
  id,
  filter = [],
  options,
  isNew = false,
  onUpdate,
}: DataTableFilterSelectContentProps) => {
  const { instance } = useDataTableContext()
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!search) return options

    const searchLower = search.toLowerCase()
    return options.filter(opt =>
      opt.label.toLowerCase().includes(searchLower)
    )
  }, [options, search])

  const onValueChange = React.useCallback(
    (value: string) => {
      if (filter?.includes(value)) {
        const newValues = filter?.filter((v) => v !== value)
        const newValue = newValues.length > 0 ? newValues : undefined
        if (onUpdate) {
          onUpdate(newValue)
        } else {
          instance.updateFilter({
            id,
            value: newValue,
          })
        }
      } else {
        const newValue = [...(filter ?? []), value]
        if (onUpdate) {
          onUpdate(newValue)
        } else {
          instance.updateFilter({
            id,
            value: newValue,
          })
        }
      }
    },
    [instance, id, filter, onUpdate]
  )

  return (
    <div className="w-[250px]">
      <div className="flex items-center gap-x-2 border-b px-3 py-1.5">
        <MagnifyingGlass className="h-4 w-4 text-ui-fg-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-ui-fg-muted"
          autoFocus
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            <XMarkMini className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="max-h-[300px] overflow-auto p-1">
        {filteredOptions.length === 0 && (
          <div className="py-6 text-center text-sm text-ui-fg-muted">
            No results found
          </div>
        )}

        {filteredOptions.map(option => {
          const isSelected = filter?.includes(option.value)

          return (
            <button
              key={String(option.value)}
              onClick={() => onValueChange(option.value)}
              className={clx(
                "flex w-full cursor-pointer items-center gap-x-2 rounded-md px-2 py-1.5 text-sm text-left",
                "hover:bg-ui-bg-base-hover"
              )}
            >
              <div className="flex size-[15px] items-center justify-center">
                {isSelected && <CheckMini />}
              </div>
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

type DataTableFilterRadioContentProps = {
  id: string
  filter: unknown
  options: DataTableFilterOption<string>[]
  onUpdate?: (value: unknown) => void
}

const DataTableFilterRadioContent = ({
  id,
  filter,
  options,
  onUpdate,
}: DataTableFilterRadioContentProps) => {
  const { instance } = useDataTableContext()

  const onValueChange = React.useCallback(
    (value: string) => {
      if (onUpdate) {
        onUpdate(value)
      } else {
        instance.updateFilter({ id, value })
      }
    },
    [instance, id, onUpdate]
  )

  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation(
    options,
    (index) => onValueChange(options[index].value)
  )

  const onListFocus = React.useCallback(() => {
    if (focusedIndex === -1) {
      setFocusedIndex(0)
    }
  }, [focusedIndex])

  return (
    <div
      className="flex flex-col p-1 outline-none"
      role="list"
      tabIndex={0}
      onFocus={onListFocus}
      autoFocus
    >
      {options.map((option, idx) => {
        const isSelected = filter === option.value

        return (
          <OptionButton
            key={idx}
            index={idx}
            option={option}
            isSelected={isSelected}
            isFocused={focusedIndex === idx}
            onClick={() => onValueChange(option.value)}
            onMouseEvent={setFocusedIndex}
            icon={EllipseMiniSolid}
          />
        )
      })}
    </div>
  )
}

function isDateFilterProps(props?: unknown | null): props is DataTableDateFilterProps {
  if (!props) {
    return false
  }

  return (props as DataTableDateFilterProps).type === "date"
}

function isMultiselectFilterProps(props?: unknown | null): props is DataTableMultiselectFilterProps {
  if (!props) {
    return false
  }

  return (props as DataTableMultiselectFilterProps).type === "multiselect"
}

function isStringFilterProps(props?: unknown | null): props is DataTableStringFilterProps {
  if (!props) {
    return false
  }

  return (props as DataTableStringFilterProps).type === "string"
}

function isNumberFilterProps(props?: unknown | null): props is DataTableNumberFilterProps {
  if (!props) {
    return false
  }

  return (props as DataTableNumberFilterProps).type === "number"
}

function isCustomFilterProps(props?: unknown | null): props is DataTableCustomFilterProps {
  if (!props) {
    return false
  }

  return (props as DataTableCustomFilterProps).type === "custom"
}

type OptionButtonProps = {
  index: number
  option: DataTableFilterOption<string | DataTableDateComparisonOperator>
  isSelected: boolean
  isFocused: boolean
  onClick: () => void
  onMouseEvent: (idx: number) => void
  icon: React.ElementType
}

const OptionButton = React.memo(
  ({
    index,
    option,
    isSelected,
    isFocused,
    onClick,
    onMouseEvent,
    icon: Icon,
  }: OptionButtonProps) => (
    <button
      type="button"
      role="listitem"
      className={clx(
        "bg-ui-bg-component txt-compact-small transition-fg flex items-center gap-2 rounded px-2 py-1 outline-none",
        { "bg-ui-bg-component-hover": isFocused }
      )}
      onClick={onClick}
      onMouseEnter={() => onMouseEvent(index)}
      onMouseLeave={() => onMouseEvent(-1)}
      tabIndex={-1}
    >
      <div className="flex size-[15px] items-center justify-center">
        {isSelected && <Icon />}
      </div>
      <span>{option.label}</span>
    </button>
  )
)

function useKeyboardNavigation(
  options: unknown[],
  onSelect: (index: number) => void,
  extraItems: number = 0
) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1)

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      const totalLength = options.length + extraItems

      if ((document.activeElement as HTMLElement).contentEditable === "true") {
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((prev) => (prev < totalLength - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case " ":
        case "Enter":
          e.preventDefault()
          if (focusedIndex >= 0) {
            onSelect(focusedIndex)
          }
          break
      }
    },
    [options.length, extraItems, focusedIndex, onSelect]
  )

  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown])

  return { focusedIndex, setFocusedIndex }
}

type DataTableFilterMultiselectContentProps = {
  id: string
  filter?: string[]
  options: DataTableFilterOption<string>[]
  searchable?: boolean
  onUpdate?: (value: unknown) => void
}

const DataTableFilterMultiselectContent = ({
  id,
  filter = [],
  options,
  searchable = true,
  onUpdate,
}: DataTableFilterMultiselectContentProps) => {
  const { instance } = useDataTableContext()
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !search) return options

    const searchLower = search.toLowerCase()
    return options.filter(opt =>
      opt.label.toLowerCase().includes(searchLower)
    )
  }, [options, search, searchable])

  const onValueChange = React.useCallback(
    (value: string) => {
      if (filter?.includes(value)) {
        const newValues = filter?.filter((v) => v !== value)
        const newValue = newValues.length > 0 ? newValues : undefined
        if (onUpdate) {
          onUpdate(newValue)
        } else {
          instance.updateFilter({
            id,
            value: newValue,
          })
        }
      } else {
        const newValue = [...(filter ?? []), value]
        if (onUpdate) {
          onUpdate(newValue)
        } else {
          instance.updateFilter({
            id,
            value: newValue,
          })
        }
      }
    },
    [instance, id, filter, onUpdate]
  )

  if (!searchable) {
    return (
      <div className="w-[250px]">
        <div className="max-h-[300px] overflow-auto p-1">
          {options.map(option => {
            const isSelected = filter?.includes(option.value)

            return (
              <button
                key={String(option.value)}
                onClick={() => onValueChange(option.value)}
                className={clx(
                  "flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-sm",
                  "hover:bg-ui-bg-base-hover cursor-pointer text-left"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  className="pointer-events-none"
                />
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-[250px]">
      <div className="flex items-center gap-x-2 border-b px-3 py-1.5">
        <MagnifyingGlass className="h-4 w-4 text-ui-fg-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-ui-fg-muted"
          autoFocus
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            <XMarkMini className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="max-h-[300px] overflow-auto p-1">
        {filteredOptions.length === 0 && (
          <div className="py-6 text-center text-sm text-ui-fg-muted">
            No results found
          </div>
        )}

        {filteredOptions.map(option => {
          const isSelected = filter?.includes(option.value)

          return (
            <button
              key={String(option.value)}
              onClick={() => onValueChange(option.value)}
              className={clx(
                "flex w-full cursor-pointer items-center gap-x-2 rounded-md px-2 py-1.5 text-sm text-left",
                "hover:bg-ui-bg-base-hover"
              )}
            >
              <Checkbox
                checked={isSelected}
                className="pointer-events-none"
              />
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

type DataTableFilterStringContentProps = {
  id: string
  filter?: string
  placeholder?: string
  onUpdate?: (value: unknown) => void
}

const DataTableFilterStringContent = ({
  id,
  filter,
  placeholder = "Enter value...",
  onUpdate,
}: DataTableFilterStringContentProps) => {
  const { instance } = useDataTableContext()
  const [value, setValue] = React.useState(filter || "")
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = React.useCallback((newValue: string) => {
    setValue(newValue)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce the update
    timeoutRef.current = setTimeout(() => {
      const updateValue = newValue.trim() || undefined
      if (onUpdate) {
        onUpdate(updateValue)
      } else {
        instance.updateFilter({
          id,
          value: updateValue,
        })
      }
    }, 500)
  }, [instance, id, onUpdate])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Clear timeout and apply immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      const updateValue = value.trim() || undefined
      if (onUpdate) {
        onUpdate(updateValue)
      } else {
        instance.updateFilter({
          id,
          value: updateValue,
        })
      }
    }
  }, [instance, id, value, onUpdate])

  return (
    <div className="p-3 w-[250px]">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}

type DataTableFilterNumberContentProps = {
  id: string
  filter: any
  placeholder?: string
  includeOperators?: boolean
  onUpdate?: (value: unknown) => void
}

const DataTableFilterNumberContent = ({
  id,
  filter,
  placeholder = "Enter number...",
  includeOperators = true,
  onUpdate,
}: DataTableFilterNumberContentProps) => {
  const { instance } = useDataTableContext()
  const [operator, setOperator] = React.useState<string>("eq")
  const [value, setValue] = React.useState("")
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (filter) {
      if (typeof filter === "number") {
        setOperator("eq")
        setValue(String(filter))
      } else if (typeof filter === "object") {
        const op = Object.keys(filter)[0] as string
        setOperator(op.replace("$", ""))
        setValue(String(filter[op]))
      }
    }
  }, [filter])

  const handleValueChange = React.useCallback((newValue: string) => {
    setValue(newValue)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce the update
    timeoutRef.current = setTimeout(() => {
      const num = parseFloat(newValue)
      if (!isNaN(num)) {
        const filterValue = includeOperators && operator !== "eq"
          ? { [`$${operator}`]: num }
          : num

        if (onUpdate) {
          onUpdate(filterValue)
        } else {
          instance.updateFilter({
            id,
            value: filterValue,
          })
        }
      } else if (newValue === "") {
        if (onUpdate) {
          onUpdate(undefined)
        } else {
          instance.updateFilter({
            id,
            value: undefined,
          })
        }
      }
    }, 500)
  }, [instance, id, operator, includeOperators, onUpdate])

  const handleOperatorChange = React.useCallback((newOperator: string) => {
    setOperator(newOperator)

    // If we have a value, update immediately with new operator
    const num = parseFloat(value)
    if (!isNaN(num)) {
      const filterValue = includeOperators && newOperator !== "eq"
        ? { [`$${newOperator}`]: num }
        : num

      if (onUpdate) {
        onUpdate(filterValue)
      } else {
        instance.updateFilter({
          id,
          value: filterValue,
        })
      }
    }
  }, [instance, id, value, includeOperators, onUpdate])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Clear timeout and apply immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      const num = parseFloat(value)
      if (!isNaN(num)) {
        const filterValue = includeOperators && operator !== "eq"
          ? { [`$${operator}`]: num }
          : num

        if (onUpdate) {
          onUpdate(filterValue)
        } else {
          instance.updateFilter({
            id,
            value: filterValue,
          })
        }
      }
    }
  }, [instance, id, value, operator, includeOperators, onUpdate])

  const operators = [
    { value: "eq", label: "Equals" },
    { value: "gt", label: "Greater than" },
    { value: "gte", label: "Greater than or equal" },
    { value: "lt", label: "Less than" },
    { value: "lte", label: "Less than or equal" },
  ]

  return (
    <div className="p-3 space-y-3 w-[250px]">
      {includeOperators && (
        <Select value={operator} onValueChange={handleOperatorChange}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {operators.map(op => (
              <Select.Item key={op.value} value={op.value}>
                {op.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      )}

      <Input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={!includeOperators}
      />
    </div>
  )
}

type DataTableFilterCustomContentProps = {
  id: string
  filter: any
  onRemove: () => void
  render: (props: {
    value: any
    onChange: (value: any) => void
    onRemove: () => void
  }) => React.ReactNode
  onUpdate?: (value: unknown) => void
}

const DataTableFilterCustomContent = ({
  id,
  filter,
  onRemove,
  render,
  onUpdate,
}: DataTableFilterCustomContentProps) => {
  const { instance } = useDataTableContext()

  const handleChange = React.useCallback((value: any) => {
    if (onUpdate) {
      onUpdate(value)
    } else {
      instance.updateFilter({
        id,
        value,
      })
    }
  }, [instance, id, onUpdate])

  return (
    <>
      {render({
        value: filter,
        onChange: handleChange,
        onRemove,
      })}
    </>
  )
}

export { DataTableFilter }
export type { DataTableFilterProps }

