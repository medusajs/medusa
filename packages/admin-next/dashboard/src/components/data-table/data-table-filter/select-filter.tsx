import { CheckMini, EllipseMiniSolid, XMarkMini } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { Command } from "cmdk"
import { MouseEvent, useState } from "react"
import { useTranslation } from "react-i18next"

import { useSelectedParams } from "../hooks"
import { useDataTableFilterContext } from "./context"
import { IFilter } from "./types"

interface SelectFilterProps extends IFilter {
  options: { label: string; value: unknown }[]
  multiple?: boolean
  searchable?: boolean
}

export const SelectFilter = ({
  filter,
  prefix,
  multiple,
  searchable,
  options,
  openOnMount,
}: SelectFilterProps) => {
  const [open, setOpen] = useState(openOnMount)
  const [search, setSearch] = useState("")
  const [searchRef, setSearchRef] = useState<HTMLInputElement | null>(null)

  const { t } = useTranslation()
  const { removeFilter } = useDataTableFilterContext()

  const { key, label } = filter
  const selectedParams = useSelectedParams({ param: key, prefix, multiple })
  const currentValue = selectedParams.get()

  const labelValues = currentValue
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[]

  const handleRemove = () => {
    selectedParams.delete()
    removeFilter(key)
  }

  let timeoutId: NodeJS.Timeout | null = null

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

  const handleClearSearch = () => {
    setSearch("")
    if (searchRef) {
      searchRef.focus()
    }
  }

  const handleSelect = (value: unknown) => {
    const isSelected = selectedParams.get().includes(String(value))

    if (isSelected) {
      selectedParams.delete(String(value))
    } else {
      selectedParams.add(String(value))
    }
  }

  return (
    <Popover.Root modal open={open} onOpenChange={handleOpenChange}>
      <SelectDisplay
        label={label}
        value={labelValues}
        onRemove={handleRemove}
      />
      <Popover.Portal>
        <Popover.Content
          hideWhenDetached
          align="start"
          sideOffset={8}
          collisionPadding={8}
          className={clx(
            "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout max-h-[200px] h-full w-[300px] overflow-hidden rounded-lg outline-none z-[1]"
          )}
          onInteractOutside={(e) => {
            if (e.target instanceof HTMLElement) {
              if (
                e.target.attributes.getNamedItem("data-name")?.value ===
                "filters_menu_content"
              ) {
                e.preventDefault()
                e.stopPropagation()
              }
            }
          }}
        >
          <Command>
            {searchable && (
              <div className="p-1 border-b">
                <div className="px-2 py-1 rounded-md grid grid-cols-[1fr_20px] gap-x-2">
                  <Command.Input
                    ref={setSearchRef}
                    value={search}
                    onValueChange={setSearch}
                    className="txt-compact-small placeholder:text-ui-fg-muted outline-none"
                    placeholder="Search"
                  />
                  <div className="w-5 h-5 flex items-center justify-center">
                    <button
                      disabled={!search}
                      onClick={handleClearSearch}
                      className={clx(
                        "transition-fg text-ui-fg-muted outline-none focus-visible:bg-ui-bg-base-pressed rounded-md",
                        {
                          invisible: !search,
                        }
                      )}
                    >
                      <XMarkMini />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <Command.Empty className="txt-compact-small p-1 flex items-center justify-center">
              <span className="px-2 py-1 w-full text-center">
                {t("general.noResultsTitle")}
              </span>
            </Command.Empty>
            <Command.Group className="p-1 overflow-auto outline-none">
              {options.map((option) => {
                const isSelected = selectedParams
                  .get()
                  .includes(String(option.value))

                return (
                  <Command.Item
                    key={String(option.value)}
                    className="bg-ui-bg-base hover:bg-ui-bg-base-hover aria-selected:bg-ui-bg-base-pressed focus-visible:bg-ui-bg-base-pressed text-ui-fg-base data-[disabled]:text-ui-fg-disabled txt-compact-small relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none gap-x-2"
                    value={option.label}
                    onSelect={() => {
                      handleSelect(option.value)
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
                      {multiple ? <CheckMini /> : <EllipseMiniSolid />}
                    </div>
                    {option.label}
                  </Command.Item>
                )
              })}
            </Command.Group>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

type SelectDisplayProps = {
  label: string
  value?: string | string[]
  onRemove: () => void
}

export const SelectDisplay = ({
  label,
  value,
  onRemove,
}: SelectDisplayProps) => {
  const v = value ? (Array.isArray(value) ? value : [value]) : null
  const count = v?.length || 0

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <Popover.Trigger asChild>
      <div
        className={clx(
          "bg-ui-bg-field transition-fg shadow-borders-base rounded-md flex items-center text-ui-fg-subtle select-none overflow-hidden cursor-pointer",
          "hover:bg-ui-bg-field-hover",
          "data-[state=open]:bg-ui-bg-field-hover"
        )}
      >
        <div
          className={clx(
            "flex items-center justify-center px-2 py-1 whitespace-nowrap",
            {
              "border-r": count > 0,
            }
          )}
        >
          <Text size="small" weight="plus" leading="compact">
            {label}
          </Text>
        </div>
        <div className="flex items-center w-full overflow-hidden">
          {count > 0 && (
            <div className="px-2 p-1 border-r">
              <Text
                size="small"
                weight="plus"
                leading="compact"
                className="text-ui-fg-muted"
              >
                is
              </Text>
            </div>
          )}
          {count > 0 && (
            <div className="px-2 p-1 flex-1 overflow-hidden border-r">
              <Text
                size="small"
                leading="compact"
                weight="plus"
                className="text-nowrap truncate"
              >
                {v?.join(", ")}
              </Text>
            </div>
          )}
        </div>
        {v && v.length > 0 && (
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
