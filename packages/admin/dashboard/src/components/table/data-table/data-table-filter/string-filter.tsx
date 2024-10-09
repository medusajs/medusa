import { XMarkMini } from "@medusajs/icons"
import { Input, Label, Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { debounce } from "lodash"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelectedParams } from "../hooks"
import { useDataTableFilterContext } from "./context"
import { IFilter } from "./types"

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
      <StringDisplay
        previousValue={previousValue}
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

const StringDisplay = ({
  previousValue,
  label,
  value,
  readonly,
  onRemove,
}: {
  previousValue?: string
  label: string
  value?: string
  readonly?: boolean
  onRemove: () => void
}) => {
  const { t } = useTranslation()

  return (
    <div
      className="bg-ui-bg-field transition-fg shadow-borders-base text-ui-fg-subtle flex cursor-default select-none items-stretch overflow-hidden rounded-md"
    >
      {!previousValue && (
        <Popover.Anchor />
      )}
      <div
        className={clx(
          "flex items-center justify-center whitespace-nowrap px-2 py-1",
          {
            "border-r": !!(value || previousValue),
          }
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          {label}
        </Text>
      </div>
      <div className="flex w-full items-center overflow-hidden">
        {!!(value || previousValue) && (
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
        {!!(value || previousValue) && (
          <Popover.Trigger asChild className={clx("flex-1 cursor-pointer overflow-hidden border-r p-1 px-2",
            {
              "hover:bg-ui-bg-field-hover": !readonly,
              "data-[state=open]:bg-ui-bg-field-hover": !readonly,
            }
          )}>
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="truncate text-nowrap"
            >
              {value}
            </Text>
          </Popover.Trigger>
        )}
      </div>
      {!readonly && !!(value || previousValue) && (
        <button
          onClick={onRemove}
          className={clx(
            "text-ui-fg-muted transition-fg flex items-center justify-center p-1",
            "hover:bg-ui-bg-subtle-hover",
            "active:bg-ui-bg-subtle-pressed active:text-ui-fg-base"
          )}
        >
          <XMarkMini />
        </button>
      )}
    </div>
  )
}
