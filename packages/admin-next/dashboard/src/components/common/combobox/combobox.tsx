import {
  Combobox as PrimitiveCombobox,
  ComboboxItem as PrimitiveComboboxItem,
  ComboboxItemCheck as PrimitiveComboboxItemCheck,
  ComboboxItemValue as PrimitiveComboboxItemValue,
  ComboboxList as PrimitiveComboboxList,
  ComboboxProvider as PrimitiveComboboxProvider,
} from "@ariakit/react"
import {
  EllipseMiniSolid,
  PlusMini,
  TrianglesMini,
  XMarkMini,
} from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { matchSorter } from "match-sorter"
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react"
import { useTranslation } from "react-i18next"

import { genericForwardRef } from "../generic-forward-ref"

type ComboboxOption = {
  value: string
  label: string
}

type Value = string[] | string

interface ComboboxProps<T extends Value = Value>
  extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "value"> {
  value?: T
  onChange?: (value?: T) => void
  searchValue?: string
  onSearchValueChange?: (value: string) => void
  options: ComboboxOption[]
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
  onCreateOption?: (value: string) => void
}

const ComboboxImpl = <T extends Value = string>(
  {
    value: controlledValue,
    onChange,
    searchValue: controlledSearchValue,
    onSearchValueChange,
    options,
    className,
    placeholder,
    fetchNextPage,
    isFetchingNextPage,
    onCreateOption,
    ...inputProps
  }: ComboboxProps<T>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { t } = useTranslation()

  const comboboxRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => comboboxRef.current!)

  const isValueControlled = controlledValue !== undefined
  const isSearchControlled = controlledSearchValue !== undefined

  const isArrayValue = Array.isArray(controlledValue)
  const emptyState = (isArrayValue ? [] : "") as T

  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(
    controlledSearchValue || ""
  )
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(emptyState)

  const searchValue = isSearchControlled
    ? controlledSearchValue
    : uncontrolledSearchValue
  const selectedValues = isValueControlled ? controlledValue : uncontrolledValue

  const handleValueChange = (newValues?: T) => {
    if (!isArrayValue) {
      const label = options.find((o) => o.value === newValues)?.label

      setUncontrolledSearchValue(label || "")
    }

    if (!isValueControlled) {
      setUncontrolledValue(newValues || emptyState)
    }
    if (onChange) {
      onChange(newValues)
    }

    setUncontrolledSearchValue("")
  }

  const handleSearchChange = (query: string) => {
    setUncontrolledSearchValue(query)

    if (onSearchValueChange) {
      onSearchValueChange(query)
    }
  }

  /**
   * Filter and sort the options based on the search value,
   * and whether the value is already selected.
   *
   * This is only used when the search value is uncontrolled.
   */
  const matches = useMemo(() => {
    if (isSearchControlled) {
      return []
    }

    return matchSorter(options, uncontrolledSearchValue, {
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
  }, [options, uncontrolledSearchValue, selectedValues, isSearchControlled])

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          fetchNextPage?.()
        }
      },
      { threshold: 1 }
    )
  )

  const lastOptionRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) {
        return
      }
      if (observer.current) {
        observer.current.disconnect()
      }
      if (node) {
        observer.current.observe(node)
      }
    },
    [isFetchingNextPage]
  )

  const createOption = () => {
    if (!onCreateOption) {
      return
    }

    onCreateOption(uncontrolledSearchValue || "")
    handleValueChange(uncontrolledSearchValue as T)
    setOpen(false)
  }

  const hasValue = selectedValues.length > 0

  const showTag = hasValue && isArrayValue
  const showSelected = showTag && !searchValue && !open

  const hideInput = !isArrayValue && !open
  const selectedLabel = options.find((o) => o.value === selectedValues)?.label

  const hidePlaceholder = showSelected || open

  const results = isSearchControlled ? options : matches

  return (
    <Popover.Root modal open={open} onOpenChange={setOpen}>
      <PrimitiveComboboxProvider
        open={open}
        setOpen={setOpen}
        selectedValue={selectedValues}
        setSelectedValue={(value) => handleValueChange(value as T)}
        value={uncontrolledSearchValue}
        setValue={(query) => {
          startTransition(() => handleSearchChange(query))
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
              "has-[:invalid]:shadow-borders-error has-[[aria-invalid=true]]:shadow-borders-error",
              "has-[:disabled]:bg-ui-bg-disabled has-[:disabled]:text-ui-fg-disabled has-[:disabled]:cursor-not-allowed",
              {
                "pl-0.5": hasValue && isArrayValue,
              },
              className
            )}
          >
            {showTag && (
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
              {hideInput && (
                <div className="absolute inset-y-0 left-0 flex size-full items-center overflow-hidden">
                  <Text size="small" leading="compact" className="truncate">
                    {selectedLabel}
                  </Text>
                </div>
              )}
              <PrimitiveCombobox
                ref={comboboxRef}
                className={clx(
                  "txt-compact-small text-ui-fg-base placeholder:text-ui-fg-subtle size-full cursor-pointer bg-transparent pr-7 outline-none focus:cursor-text",
                  {
                    "opacity-0": hideInput,
                  }
                )}
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
            aria-busy={isPending}
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
              {results.map(({ value, label }) => (
                <PrimitiveComboboxItem
                  key={value}
                  value={value}
                  focusOnHover
                  setValueOnClick={false}
                  className="transition-fg bg-ui-bg-base data-[active-item=true]:bg-ui-bg-base-hover group flex cursor-pointer items-center gap-x-2 rounded-[4px] px-2 py-1.5"
                >
                  <PrimitiveComboboxItemCheck className="flex !size-5 items-center justify-center">
                    <EllipseMiniSolid />
                  </PrimitiveComboboxItemCheck>
                  <PrimitiveComboboxItemValue className="txt-compact-small">
                    {label}
                  </PrimitiveComboboxItemValue>
                </PrimitiveComboboxItem>
              ))}
              {!!fetchNextPage && <div ref={lastOptionRef} className="w-px" />}
              {isFetchingNextPage && (
                <div className="transition-fg bg-ui-bg-base flex items-center rounded-[4px] px-2 py-1.5">
                  <div className="bg-ui-bg-component size-full h-5 w-full animate-pulse rounded-[4px]" />
                </div>
              )}
              <NoResultsDisplay
                results={results}
                onCreateOption={createOption}
                searchValue={uncontrolledSearchValue}
              />
            </PrimitiveComboboxList>
          </Popover.Content>
        </Popover.Portal>
      </PrimitiveComboboxProvider>
    </Popover.Root>
  )
}

const NoResultsDisplay = ({
  results,
  onCreateOption,
  searchValue,
}: {
  results: ComboboxOption[]
  onCreateOption?: () => void
  searchValue?: string
}) => {
  const { t } = useTranslation()

  if (results.length) {
    return null
  }

  if (!onCreateOption) {
    return (
      <div className="flex items-center gap-x-2 rounded-[4px] px-2 py-1.5">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {t("general.noResultsTitle")}
        </Text>
      </div>
    )
  }

  return (
    <button
      onClick={onCreateOption}
      type="button"
      className="text-ui-fg-subtle flex items-center gap-x-2 rounded-[4px] px-2 py-1.5"
    >
      <PlusMini />
      <Text size="small" leading="compact">
        {t("actions.create")} &quot;{searchValue}&quot;
      </Text>
    </button>
  )
}

export const Combobox = genericForwardRef(ComboboxImpl)
