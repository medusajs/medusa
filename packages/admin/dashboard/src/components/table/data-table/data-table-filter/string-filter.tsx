import { Input, Label, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { debounce } from "lodash"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useSelectedParams } from "../hooks"
import { useDataTableFilterContext } from "./context"
import { IFilter } from "./types"
import FilterChip from "./filter-chip"

type StringFilterProps = IFilter

export const StringFilter = ({
  filter,
  prefix,
  readonly,
  openOnMount,
}: StringFilterProps) => {
  const [open, setOpen] = useState(openOnMount)

  const { key, label } = filter

  const { removeFilter } = useDataTableFilterContext()
  const selectedParams = useSelectedParams({ param: key, prefix })

  const query = selectedParams.get()

  const [previousValue, setPreviousValue] = useState<string | undefined>(query?.[0])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (!value) {
        selectedParams.delete()
      } else {
        selectedParams.add(value)
      }
    }, 500),
    [selectedParams]
  )

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    setPreviousValue(query?.[0])

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (!open && !query.length) {
      timeoutId = setTimeout(() => {
        removeFilter(key)
      }, 200)
    }
  }

  const handleRemove = () => {
    selectedParams.delete()
    removeFilter(key)
  }

  return (
    <Popover.Root modal open={open} onOpenChange={handleOpenChange}>
      <FilterChip
        hasOperator
        hadPreviousValue={!!previousValue}
        label={label}
        value={query?.[0]}
        onRemove={handleRemove}
        readonly={readonly}
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
            <div className="px-1 pb-3 pt-1">
              <div className="px-2 py-1.5">
                <Label size="xsmall" weight="plus" htmlFor={key}>
                  {label}
                </Label>
              </div>
              <div className="px-2 py-0.5">
                <Input
                  name={key}
                  size="small"
                  defaultValue={query?.[0] || undefined}
                  onChange={debouncedOnChange}
                />
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      )}
    </Popover.Root>
  )
}
