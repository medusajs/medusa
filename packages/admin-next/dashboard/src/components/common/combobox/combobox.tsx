import {
  Combobox as PrimitiveCombobox,
  ComboboxDisclosure as PrimitiveComboboxDisclosure,
  ComboboxItem as PrimitiveComboboxItem,
  ComboboxItemCheck as PrimitiveComboboxItemCheck,
  ComboboxItemValue as PrimitiveComboboxItemValue,
  ComboboxPopover as PrimitiveComboboxPopover,
  ComboboxProvider as PrimitiveComboboxProvider,
  Separator as PrimitiveSeparator,
} from "@ariakit/react"
import {
  EllipseMiniSolid,
  PlusMini,
  TrianglesMini,
  XMarkMini,
} from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import { matchSorter } from "match-sorter"
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  Fragment,
  useCallback,
  useDeferredValue,
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
  const defferedSearchValue = useDeferredValue(uncontrolledSearchValue)

  const [uncontrolledValue, setUncontrolledValue] = useState<T>(emptyState)

  const searchValue = isSearchControlled
    ? controlledSearchValue
    : uncontrolledSearchValue
  const selectedValues = isValueControlled ? controlledValue : uncontrolledValue

  const handleValueChange = (newValues?: T) => {
    // check if the value already exists in options
    const exists = options.find((o) => {
      if (isArrayValue) {
        return newValues?.includes(o.value)
      }

      return o.value === newValues
    })

    // If the value does not exist in the options, and the component has a handler
    // for creating new options, call it.
    if (!exists && onCreateOption && newValues) {
      onCreateOption(newValues as string)
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

    return matchSorter(options, defferedSearchValue, {
      keys: ["label"],
    })
  }, [options, defferedSearchValue, isSearchControlled])

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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setUncontrolledSearchValue("")
    }

    setOpen(open)
  }

  const hasValue = selectedValues.length > 0

  const showTag = hasValue && isArrayValue
  const showSelected = showTag && !searchValue && !open

  const hideInput = !isArrayValue && !open
  const selectedLabel = options.find((o) => o.value === selectedValues)?.label

  const hidePlaceholder = showSelected || open

  const results = useMemo(() => {
    return isSearchControlled ? options : matches
  }, [matches, options, isSearchControlled])

  return (
    <PrimitiveComboboxProvider
      open={open}
      setOpen={handleOpenChange}
      selectedValue={selectedValues}
      setSelectedValue={(value) => handleValueChange(value as T)}
      value={uncontrolledSearchValue}
      setValue={(query) => {
        startTransition(() => handleSearchChange(query))
      }}
    >
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
            autoSelect
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
        <PrimitiveComboboxDisclosure
          render={() => {
            return (
              <button
                type="button"
                className="text-ui-fg-muted pointer-events-none absolute right-2 size-fit outline-none"
              >
                <TrianglesMini />
              </button>
            )
          }}
        />
      </div>
      <PrimitiveComboboxPopover
        gutter={4}
        ref={listboxRef}
        role="listbox"
        className={clx(
          "shadow-elevation-flyout bg-ui-bg-base -left-2 z-50 w-[calc(var(--popover-anchor-width)+16px)] rounded-[8px] p-1",
          "max-h-[200px] overflow-y-auto",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        )}
        style={{
          pointerEvents: open ? "auto" : "none",
        }}
        aria-busy={isPending}
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
        {!results.length && (
          <div className="flex items-center gap-x-2 rounded-[4px] px-2 py-1.5">
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {t("general.noResultsTitle")}
            </Text>
          </div>
        )}
        {!results.length && onCreateOption && (
          <Fragment>
            <PrimitiveSeparator className="bg-ui-border-base -mx-1" />
            <PrimitiveComboboxItem
              value={uncontrolledSearchValue}
              focusOnHover
              setValueOnClick={false}
              className="transition-fg bg-ui-bg-base data-[active-item=true]:bg-ui-bg-base-hover group mt-1 flex cursor-pointer items-center gap-x-2 rounded-[4px] px-2 py-1.5"
            >
              <PlusMini className="text-ui-fg-subtle" />
              <Text size="small" leading="compact">
                {t("actions.create")} &quot;{searchValue}&quot;
              </Text>
            </PrimitiveComboboxItem>
          </Fragment>
        )}
      </PrimitiveComboboxPopover>
    </PrimitiveComboboxProvider>
  )
}

export const Combobox = genericForwardRef(ComboboxImpl)
