import {
  Combobox as PrimitiveCombobox,
  ComboboxItem as PrimitiveComboboxItem,
  ComboboxItemCheck as PrimitiveComboboxItemCheck,
  ComboboxItemValue as PrimitiveComboboxItemValue,
  ComboboxList as PrimitiveComboboxList,
  ComboboxProvider as PrimitiveComboboxProvider,
} from "@ariakit/react"
import { EllipseMiniSolid, TrianglesMini, XMarkMini } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { matchSorter } from "match-sorter"
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"

type ComboboxOption = {
  value: string
  label: string
}

interface ComboboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "value"> {
  value?: string[]
  onChange?: (value?: string[]) => void
  options: ComboboxOption[]
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      value: controlledValue,
      onChange,
      options,
      className,
      placeholder,
      ...inputProps
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()

    const comboboxRef = useRef<HTMLInputElement>(null)
    const listboxRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => comboboxRef.current!)

    const isControlled = controlledValue !== undefined
    const [searchValue, setSearchValue] = useState("")
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>([])

    const selectedValues = isControlled ? controlledValue : uncontrolledValue

    const handleValueChange = (newValues?: string[]) => {
      if (!isControlled) {
        setUncontrolledValue(newValues || [])
      }
      if (onChange) {
        onChange(newValues)
      }
    }

    /**
     * Filter and sort the options based on the search value,
     * and whether the value is already selected.
     */
    const matches = useMemo(() => {
      return matchSorter(options, searchValue, {
        keys: ["label"],
        baseSort: (a, b) => {
          const aIndex = selectedValues.indexOf(a.item.value)
          const bIndex = selectedValues.indexOf(b.item.value)

          if (aIndex === -1 && bIndex === -1) {
            return 0
          }

          if (aIndex === -1) {
            return 1
          }

          if (bIndex === -1) {
            return -1
          }

          return aIndex - bIndex
        },
      })
    }, [options, searchValue, selectedValues])

    const hasValues = selectedValues.length > 0
    const showSelected = hasValues && !searchValue && !open
    const hidePlaceholder = showSelected || open

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <PrimitiveComboboxProvider
          open={open}
          setOpen={setOpen}
          selectedValue={selectedValues}
          setSelectedValue={handleValueChange}
          setValue={(value) => {
            setSearchValue(value)
          }}
        >
          <Popover.Anchor asChild>
            <div
              className={clx(
                "relative flex cursor-pointer items-center gap-x-2 overflow-hidden",
                "h-8 w-full rounded-md px-2 py-0.5",
                "bg-ui-bg-field transition-fg shadow-borders-base",
                "hover:bg-ui-bg-field-hover",
                "has-[input:focus]:shadow-borders-interactive-with-active",
                "has-[:invalid]:shadow-borders-error",
                "has-[:disabled]:bg-ui-bg-disabled has-[:disabled]:text-ui-fg-disabled has-[:disabled]:cursor-not-allowed",
                {
                  "pl-0.5": hasValues,
                },
                className
              )}
            >
              {hasValues && (
                <div className="bg-ui-bg-base txt-compact-small-plus text-ui-fg-subtle focus-within:border-ui-fg-interactive relative flex h-[28px] items-center rounded-[4px] border py-[3px] pl-1.5 pr-1">
                  <span>{selectedValues.length}</span>
                  <button
                    type="button"
                    className="size-fit outline-none"
                    onClick={(e) => {
                      e.preventDefault()
                      handleValueChange(undefined)
                    }}
                  >
                    <XMarkMini className="text-ui-fg-muted" />
                  </button>
                </div>
              )}
              <div className="relative flex size-full items-center">
                {showSelected && (
                  <Text size="small" leading="compact">
                    {t("general.selected")}
                  </Text>
                )}
                <PrimitiveCombobox
                  ref={comboboxRef}
                  className="txt-compact-small text-ui-fg-base placeholder:text-ui-fg-subtle size-full cursor-pointer bg-transparent pr-7 outline-none focus:cursor-text"
                  placeholder={hidePlaceholder ? undefined : placeholder}
                  {...inputProps}
                />
              </div>
              <button
                type="button"
                tabIndex={-1}
                className="text-ui-fg-muted pointer-events-none absolute right-2 size-fit outline-none"
              >
                <TrianglesMini />
              </button>
            </div>
          </Popover.Anchor>
          <Popover.Portal>
            <Popover.Content
              asChild
              align="center"
              side="bottom"
              sideOffset={8}
              onOpenAutoFocus={(event) => event.preventDefault()}
              onInteractOutside={(event) => {
                const target = event.target as Element | null
                const isCombobox = target === comboboxRef.current
                const inListbox = target && listboxRef.current?.contains(target)

                if (isCombobox || inListbox) {
                  event.preventDefault()
                }
              }}
            >
              <PrimitiveComboboxList
                ref={listboxRef}
                role="listbox"
                className={clx(
                  "shadow-elevation-flyout bg-ui-bg-base w-[var(--radix-popper-anchor-width)] rounded-[8px] p-1",
                  "max-h-[200px] overflow-y-auto",
                  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                )}
              >
                {matches.map(({ value, label }) => (
                  <PrimitiveComboboxItem
                    key={value}
                    value={value}
                    focusOnHover
                    className="transition-fg bg-ui-bg-base data-[active-item=true]:bg-ui-bg-base-hover group flex items-center gap-x-2 rounded-[4px] px-2 py-1.5"
                  >
                    <PrimitiveComboboxItemCheck className="flex !size-5 items-center justify-center">
                      <EllipseMiniSolid />
                    </PrimitiveComboboxItemCheck>
                    <PrimitiveComboboxItemValue className="txt-compact-small group-aria-selected:txt-compact-small-plus">
                      {label}
                    </PrimitiveComboboxItemValue>
                  </PrimitiveComboboxItem>
                ))}
                {!matches.length && (
                  <div className="flex items-center gap-x-2 rounded-[4px] px-2 py-1.5">
                    <Text
                      size="small"
                      leading="compact"
                      className="text-ui-fg-subtle"
                    >
                      {t("general.noResultsTitle")}
                    </Text>
                  </div>
                )}
              </PrimitiveComboboxList>
            </Popover.Content>
          </Popover.Portal>
        </PrimitiveComboboxProvider>
      </Popover.Root>
    )
  }
)
Combobox.displayName = "Combobox"
