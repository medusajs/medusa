import {
  Adjustments,
  CheckMini,
  ChevronUpDown,
  XMarkMini,
} from "@medusajs/icons"
import { DateComparisonOperator } from "@medusajs/medusa"
import {
  Badge,
  Button,
  DatePicker,
  DateRange,
  Select,
  Switch,
  clx,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as React from "react"
import { useTranslation } from "react-i18next"

interface FilterMenuProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenu.Root> {
  onClearFilters: () => void
}

interface FilterMenuContextValue {
  onClearFilters: () => void
}

const FilterMenuContext = React.createContext<FilterMenuContextValue | null>(
  null
)

const useFilterMenuContext = () => {
  const context = React.useContext(FilterMenuContext)

  if (!context) {
    throw new Error(
      "FilterMenu compound components cannot be rendered outside the FilterMenu component"
    )
  }

  return context
}

const Root = ({ children, onClearFilters, ...props }: FilterMenuProps) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger data-filter-component={true} asChild>
        <Button variant="secondary" className="relative overflow-visible">
          <Adjustments className="text-ui-fg-subtle" />
          {t("filter-menu-trigger", "View")}
        </Button>
      </DropdownMenu.Trigger>
      <FilterMenuContext.Provider
        value={React.useMemo(
          () => ({
            onClearFilters,
          }),
          [onClearFilters]
        )}
      >
        {children}
      </FilterMenuContext.Provider>
    </DropdownMenu.Root>
  )
}
Root.displayName = "FilterMenu"

const Content = ({
  children,
  sideOffset = 8,
  side = "bottom",
  alignOffset = -32,
  align = "start",
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>) => {
  const { onClearFilters } = useFilterMenuContext()

  const { t } = useTranslation()

  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        data-filter-component={true}
        sideOffset={sideOffset}
        side={side}
        alignOffset={alignOffset}
        align={align}
        className={clx(
          "shadow-elevation-flyout bg-ui-bg-base min-w-[320px] rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <div className="border-ui-border-base border-t p-3" {...props}>
          <Button
            variant="secondary"
            type="button"
            className="w-full"
            onClick={onClearFilters}
          >
            {t("filter-menu-clear-button", "Clear")}
          </Button>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}
Content.displayName = "FilterMenu.Content"

type SelectItemProps = {
  name: string
  placeholder?: string
  options: {
    value: string
    label: string
  }[]
  value?: string[]
  onChange: (value: string[]) => void
}

const SelectItem = ({
  name,
  placeholder = "Select filter",
  options,
  value = [],
  onChange,
}: SelectItemProps) => {
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)

  const { t } = useTranslation()

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const placeholderValue = placeholder
    ? placeholder
    : t("filter-menu-select-item-default-placeholder", "Select filter")

  return (
    <DropdownMenu.Sub open={open} data-filter-component={true}>
      <div className="flex w-full items-center justify-between px-3 py-3">
        <span className="txt-compact-xsmall-plus text-ui-fg-base">{name}</span>
        <DropdownMenu.SubTrigger
          className={clx(
            "bg-ui-bg-field hover:bg-ui-bg-field-hover transition-fg border-ui-border-base shadow-buttons-neutral flex h-8 w-[152px] items-center gap-x-2 rounded-md border py-1 pr-2 text-left",
            "focus:shadow-borders-active focus:border-ui-border-interactive data-[state=open]:!shadow-borders-active data-[state=open]:!border-ui-border-interactive outline-none",
            {
              "pl-2": value.length === 0,
              "pl-1": value.length > 0,
            }
          )}
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}
          asChild
        >
          <button>
            {value.length > 0 ? (
              <Badge className="flex items-center tabular-nums">
                {value.length}
                <span
                  className="bg-ui-tag-neutral-bg focus:bg-ui-tag-neutral-bg-hover transition-fg flex h-5 w-5 items-center justify-center rounded-sm outline-none"
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange([])
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation()
                      onChange([])
                    }
                  }}
                >
                  <span className="sr-only">
                    {t(
                      "filter-menu-select-item-clear-button",
                      "Clear the selected options"
                    )}
                  </span>
                  <XMarkMini />
                </span>
              </Badge>
            ) : null}
            <div className="flex-1">
              {value.length > 0 ? (
                <span className="text-ui-fg-base txt-compact-medium">
                  {t("filter-menu-select-item-selected", "Selected")}
                </span>
              ) : (
                <span className="text-ui-fg-muted txt-compact-medium">
                  {placeholderValue}
                </span>
              )}
            </div>
            <ChevronUpDown className="text-ui-fg-muted" />
          </button>
        </DropdownMenu.SubTrigger>
      </div>

      <DropdownMenu.SubContent
        ref={menuRef}
        sideOffset={8}
        className="shadow-elevation-flyout bg-ui-bg-base min-w-[220px] overflow-hidden rounded-lg p-1"
        data-filter-child={true}
      >
        {options.map((opt, index) => {
          return (
            <DropdownMenu.CheckboxItem
              checked={value.includes(opt.value)}
              onCheckedChange={() => {
                if (value.includes(opt.value)) {
                  const newValue = value.filter((v) => v !== opt.value)
                  onChange(newValue)
                  return
                }

                const newValue = [...value, opt.value]
                onChange(newValue)
              }}
              className="hover:bg-ui-bg-field-hover transition-fg txt-compact-xsmall-plus flex cursor-pointer items-center gap-x-2 rounded-md px-3 py-2 outline-none"
              key={index}
            >
              <div className="h-5 w-5">
                <DropdownMenu.ItemIndicator>
                  <CheckMini />
                </DropdownMenu.ItemIndicator>
              </div>
              {opt.label}
            </DropdownMenu.CheckboxItem>
          )
        })}
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  )
}
SelectItem.displayName = "FilterMenu.SelectItem"

type DateItemProps = {
  name: string
  value?: DateComparisonOperator
  onChange: (value?: DateComparisonOperator) => void
}

const DateItem = ({ name, value, onChange }: DateItemProps) => {
  const [operator, setOperator] = React.useState<string>("lt")
  const [expanded, setExpanded] = React.useState<boolean>(!!value)

  const { t } = useTranslation()

  const handleExpandChange = (expanded: boolean) => {
    setExpanded(expanded)

    if (!expanded) {
      onChange(undefined)
    }
  }

  const handleSingleDateChange = React.useCallback(
    (date?: Date) => {
      if (!date) {
        onChange(undefined)
        return
      }

      const payload: DateComparisonOperator = {
        lt: undefined,
        gt: undefined,
        gte: undefined,
        lte: undefined,
      }

      switch (operator) {
        case "lt":
          payload.lt = date
          break
        case "gt":
          payload.gt = date
          break
        default:
          break
      }

      onChange(payload)
    },
    [operator, onChange]
  )

  const handleOperatorChange = React.useCallback(
    (value: string) => {
      setOperator(value)
      onChange(undefined)
    },
    [onChange]
  )

  const handleRangeDateChange = React.useCallback(
    (range?: DateRange) => {
      if (!range) {
        onChange(undefined)
        return
      }

      const payload: DateComparisonOperator = {
        gte: range.from,
        lte: range.to,
      }

      payload.gte = range.from
      payload.lte = range.to

      onChange(payload)
    },
    [onChange]
  )

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <span className="txt-compact-xsmall-plus text-ui-fg-base">{name}</span>
        <Switch checked={expanded} onCheckedChange={handleExpandChange} />
      </div>
      <Collapsible.Root open={expanded}>
        <Collapsible.Content data-filter-component={true} className="z-[1]">
          <div className="flex flex-col gap-y-2 py-2">
            <Select
              size="small"
              onValueChange={handleOperatorChange}
              value={operator}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content className="z-10">
                <Select.Item value="lt">
                  {t("filter-menu-date-item-before", "Before")}
                </Select.Item>
                <Select.Item value="gt">
                  {t("filter-menu-date-item-after", "After")}
                </Select.Item>
                <Select.Item value="btwn">
                  {t("filter-menu-date-item-between", "Between")}
                </Select.Item>
              </Select.Content>
            </Select>
            {["lt", "gt"].includes(operator) ? (
              <DatePicker
                size="small"
                value={
                  value
                    ? value[operator as keyof DateComparisonOperator]
                    : undefined
                }
                onChange={handleSingleDateChange}
              />
            ) : (
              <DatePicker
                size="small"
                mode="range"
                value={
                  value
                    ? {
                        from: value.gte,
                        to: value.lte,
                      }
                    : undefined
                }
                onChange={handleRangeDateChange}
              />
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
DateItem.displayName = "FilterMenu.DateItem"

type ListItemProps = {
  name: string
  value: string[]
  query?: string
  setQuery?: (query: string) => void
  onChange: (value: string[]) => void
  onNext: () => void
  onPrevious: () => void
  canNext?: boolean
  canPrevious?: boolean
  setPage: (page: number) => void
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(() => {
  return (
    <div>
      <ul></ul>
    </div>
  )
})
ListItem.displayName = "FilterMenu.ListItem"

const Seperator = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>) => {
  return (
    <DropdownMenu.Separator
      className={clx("bg-ui-border-base my-[3.5px] h-px w-full", className)}
      {...props}
    />
  )
}
Seperator.displayName = "FilterMenu.Seperator"

const FilterMenu = Object.assign(Root, {
  Content,
  SelectItem,
  DateItem,
  Seperator,
})

export { FilterMenu }
