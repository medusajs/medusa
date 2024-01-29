import { CheckMini, EllipseMiniSolid, XMarkMini } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { Command } from "cmdk"
import { MouseEvent, useState } from "react"

import { DataTableFilterProps } from "../types"
import { useDataTableFacetedFilterContext, useSelectedParams } from "./hooks"

interface SelectFilterProps extends DataTableFilterProps {
  options: { label: string; value: unknown }[]
  multiple?: boolean
}

export const SelectFilter = ({
  filter,
  prefix,
  multiple,
  options,
  openOnMount,
}: SelectFilterProps) => {
  const [open, setOpen] = useState(openOnMount)
  const [search, setSearch] = useState("")
  const { removeFilter } = useDataTableFacetedFilterContext()

  const { key, label } = filter
  const identifier = prefix ? `${prefix}_${key}` : key
  const selectedParams = useSelectedParams({ title: identifier, multiple })
  const currentValue = selectedParams.get()
  const labelValues = selectedParams
    .get()
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[]

  const handleRemove = () => {
    selectedParams.delete()
    removeFilter(key)
  }

  let timeoutId: NodeJS.Timeout | null = null

  const onOpenChange = (open: boolean) => {
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
    <Popover.Root open={open} onOpenChange={onOpenChange}>
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
            "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] w-[300px] overflow-hidden rounded-lg p-1",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <Command>
            <div className="p-1 border-b">
              <div className="px-2 py-1 rounded-md grid grid-cols-[1fr_20px]">
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  className="txt-compact-small placeholder:text-ui-fg-muted outline-none"
                  placeholder="Search"
                />
                <div className="w-5 h-5 flex items-center justify-center">
                  <button
                    disabled={!search}
                    onClick={() => setSearch("")}
                    className={clx("transition-fg text-ui-fg-muted", {
                      invisible: !search,
                    })}
                  >
                    <XMarkMini />
                  </button>
                </div>
              </div>
            </div>
            <Command.Empty className="txt-compact-small p-1 flex items-center justify-center">
              <span className="px-2 py-1 w-full text-center">No results</span>
            </Command.Empty>
            <Command.Group className="p-1">
              {options.map((option) => {
                const isSelected = selectedParams
                  .get()
                  .includes(String(option.value))

                return (
                  <Command.Item
                    key={String(option.value)}
                    className="capitalize txt-compact-small flex items-center gap-x-2 py-1 px-2 select-none"
                    value={String(option.value)}
                    onSelect={() => {
                      if (isSelected) {
                        selectedParams.delete(String(option.value))
                      } else {
                        selectedParams.add(String(option.value))
                      }
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
          {v?.map((value) => {
            return (
              <div key={value} className="px-2 p-1 border-r">
                <Text size="small" weight="plus" leading="compact">
                  {value}
                </Text>
              </div>
            )
          })}
        </div>
        {v && v.length > 0 && (
          <div>
            <button
              onClick={v ? handleRemove : undefined}
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
