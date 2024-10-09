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
  readonly?: boolean
  multiple?: boolean
  searchable?: boolean
}

export const SelectFilter = ({
  filter,
  prefix,
  readonly,
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

  const [previousValue, setPreviousValue] = useState<string | string[] | undefined>(labelValues)

  const handleRemove = () => {
    selectedParams.delete()
    removeFilter(key)
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const handleOpenChange = (open: boolean) => {
    setOpen(open)

    setPreviousValue(labelValues)

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
        previousValue={previousValue}
        readonly={readonly}
        label={label}
        value={labelValues}
        onRemove={handleRemove}
      />
      {!readonly && (
        <Popover.Portal>
          <Popover.Content
            hideWhenDetached
            align="start"
            sideOffset={8}
            collisionPadding={8}
            className={clx(
              "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout z-[1] h-full max-h-[200px] w-[300px] overflow-hidden rounded-lg outline-none"
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
            <Command className="h-full">
              {searchable && (
                <div className="border-b p-1">
                  <div className="grid grid-cols-[1fr_20px] gap-x-2 rounded-md px-2 py-1">
                    <Command.Input
                      ref={setSearchRef}
                      value={search}
                      onValueChange={setSearch}
                      className="txt-compact-small placeholder:text-ui-fg-muted bg-transparent outline-none"
                      placeholder="Search"
                    />
                    <div className="flex h-5 w-5 items-center justify-center">
                      <button
                        disabled={!search}
                        onClick={handleClearSearch}
                        className={clx(
                          "transition-fg text-ui-fg-muted focus-visible:bg-ui-bg-base-pressed rounded-md outline-none",
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
              <Command.Empty className="txt-compact-small flex items-center justify-center p-1">
                <span className="w-full px-2 py-1 text-center">
                  {t("general.noResultsTitle")}
                </span>
              </Command.Empty>
              <Command.List className="h-full max-h-[163px] min-h-[0] overflow-auto p-1 outline-none">
                {options.map((option) => {
                  const isSelected = selectedParams
                    .get()
                    .includes(String(option.value))

                  return (
                    <Command.Item
                      key={String(option.value)}
                      className="bg-ui-bg-base hover:bg-ui-bg-base-hover aria-selected:bg-ui-bg-base-pressed focus-visible:bg-ui-bg-base-pressed text-ui-fg-base data-[disabled]:text-ui-fg-disabled txt-compact-small relative flex cursor-pointer select-none items-center gap-x-2 rounded-md px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none"
                      value={option.label}
                      onSelect={() => {
                        handleSelect(option.value)
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
                        {multiple ? <CheckMini /> : <EllipseMiniSolid />}
                      </div>
                      {option.label}
                    </Command.Item>
                  )
                })}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      )}
    </Popover.Root>
  )
}

type SelectDisplayProps = {
  label: string
  readonly?: boolean
  value?: string | string[]
  previousValue?: string | string[]
  onRemove: () => void
}

export const SelectDisplay = ({
  label,
  value,
  previousValue,
  onRemove,
  readonly,
}: SelectDisplayProps) => {
  const { t } = useTranslation()
  const v = value ? (Array.isArray(value) ? value : [value]) : null
  const pv = previousValue ? (Array.isArray(previousValue) ? previousValue : [previousValue]) : null
  const count = v?.length || 0
  const previousCount = pv?.length || 0

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <div
      className="bg-ui-bg-field transition-fg shadow-borders-base text-ui-fg-subtle cursor-default flex select-none items-stretch overflow-hidden rounded-md"
    >
      {!previousCount && (
        <Popover.Anchor />
      )}
      <div
        className={clx(
          "text-ui-fg-muted flex items-center justify-center whitespace-nowrap px-2 py-1",
          {
            "border-r": count + previousCount > 0,
          }
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          {label}
        </Text>
      </div>
      <div className="flex w-full items-center overflow-hidden">
        {(count + previousCount > 0) && (
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
        {(count + previousCount > 0) && (
          <Popover.Trigger asChild className={clx("flex-1 overflow-hidden border-r p-1 px-2 cursor-pointer", {
            "hover:bg-ui-bg-field-hover": !readonly,
            "data-[state=open]:bg-ui-bg-field-hover": !readonly,
          })}>
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="truncate text-nowrap"
            >
              {v?.join(", ") || "\u00A0"}
            </Text>
          </Popover.Trigger>
        )}
      </div>
      {!readonly && count + previousCount > 0 && (
        <button
          onClick={handleRemove}
          className="p-1 active:bg-ui-bg-subtle-pressed active:text-ui-fg-base hover:bg-ui-bg-field-hover h-100"
        >
          <XMarkMini />
        </button>
      )}
    </div>
  )
}
