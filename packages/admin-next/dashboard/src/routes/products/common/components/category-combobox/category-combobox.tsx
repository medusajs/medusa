import {
  ArrowUturnLeft,
  CheckMini,
  TriangleRightMini,
  TrianglesMini,
  XMarkMini,
} from "@medusajs/icons"
import { AdminProductCategoryResponse } from "@medusajs/types"
import { Text, clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import {
  ComponentPropsWithoutRef,
  Fragment,
  MouseEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { Trans, useTranslation } from "react-i18next"
import { Divider } from "../../../../../components/common/divider"
import { TextSkeleton } from "../../../../../components/common/skeleton"
import { useCategories } from "../../../../../hooks/api/categories"
import { useDebouncedSearch } from "../../../../../hooks/use-debounced-search"

interface CategoryComboboxProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "onChange"
  > {
  value: string[]
  onChange: (value: string[]) => void
}

type Level = {
  id: string
  label: string
}

export const CategoryCombobox = forwardRef<
  HTMLInputElement,
  CategoryComboboxProps
>(({ value, onChange, className, ...props }, ref) => {
  const innerRef = useRef<HTMLInputElement>(null)

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
    ref,
    () => innerRef.current,
    []
  )

  const [open, setOpen] = useState(false)

  const { i18n, t } = useTranslation()

  const [level, setLevel] = useState<Level[]>([])
  const { searchValue, onSearchValueChange, query } = useDebouncedSearch()

  const { product_categories, isPending, isError, error } = useCategories(
    {
      q: query,
      parent_category_id: !searchValue ? getParentId(level) : undefined,
      include_descendants_tree: !searchValue ? true : false,
    },
    {
      enabled: open,
    }
  )

  const [showLoading, setShowLoading] = useState(false)

  /**
   * We add a small artificial delay to the end of the loading state,
   * this is done to prevent the popover from flickering too much when
   * navigating between levels or searching.
   */
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (isPending) {
      setShowLoading(true)
    } else {
      timeoutId = setTimeout(() => {
        setShowLoading(false)
      }, 150)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isPending])

  useEffect(() => {
    if (searchValue) {
      setLevel([])
    }
  }, [searchValue])

  function handleLevelUp(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    setLevel(level.slice(0, level.length - 1))

    innerRef.current?.focus()
  }

  function handleLevelDown(option: ProductCategoryOption) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setLevel([...level, { id: option.value, label: option.label }])

      innerRef.current?.focus()
    }
  }

  function handleSelect(option: ProductCategoryOption) {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (isSelected(value, option.value)) {
        onChange(value.filter((v) => v !== option.value))
      } else {
        onChange([...value, option.value])
      }

      innerRef.current?.focus()
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      onSearchValueChange("")
      setLevel([])
    }

    if (open) {
      requestAnimationFrame(() => {
        innerRef.current?.focus()
      })
    }

    setOpen(open)
  }

  const options = getOptions(product_categories || [])

  const showTag = value.length > 0 && !open

  if (isError) {
    throw error
  }

  return (
    <Popover.Root modal open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
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
              // Fake the focus state as long as the popover is open,
              // this prevents the styling from flickering when navigating
              // between levels.
              "shadow-borders-interactive-with-active": open,
              "pl-0.5": showTag,
            },
            className
          )}
        >
          {open ? (
            <input
              ref={innerRef}
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              className={clx(
                "txt-compact-small w-full appearance-none bg-transparent outline-none",
                "placeholder:text-ui-fg-muted"
              )}
              {...props}
            />
          ) : showTag ? (
            <div className="flex w-full items-center gap-x-2">
              <div className="flex w-fit items-center gap-x-1">
                <div className="bg-ui-bg-base txt-compact-small-plus text-ui-fg-subtle focus-within:border-ui-fg-interactive relative flex h-[28px] items-center rounded-[4px] border py-[3px] pl-1.5 pr-1">
                  <span>{value.length}</span>
                  <button
                    type="button"
                    className="size-fit outline-none"
                    onClick={(e) => {
                      e.preventDefault()
                      onChange([])
                    }}
                  >
                    <XMarkMini className="text-ui-fg-muted" />
                  </button>
                </div>
              </div>
              <Text size="small" leading="compact">
                {t("general.selected")}
              </Text>
            </div>
          ) : (
            <div className="w-full"></div>
          )}
          <div className="flex size-5 items-center justify-center">
            <TrianglesMini className="text-ui-fg-muted" />
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          role="listbox"
          className={clx(
            "shadow-elevation-flyout bg-ui-bg-base -left-2 z-50 w-[var(--radix-popper-anchor-width)] rounded-[8px]",
            "max-h-[200px] overflow-y-auto",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
          }}
        >
          {!searchValue && level.length > 0 && (
            <Fragment>
              <div className="p-1">
                <button
                  className={clx(
                    "transition-fg grid w-full appearance-none grid-cols-[20px_1fr] items-center justify-center gap-2 rounded-md px-2 py-1.5 text-left outline-none",
                    "hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed"
                  )}
                  type="button"
                  onClick={handleLevelUp}
                >
                  <ArrowUturnLeft className="text-ui-fg-muted" />
                  <Text size="small" leading="compact">
                    {getParentLabel(level)}
                  </Text>
                </button>
              </div>
              <Divider />
            </Fragment>
          )}
          <div className="p-1">
            {options.length > 0 &&
              !showLoading &&
              options.map((option) => (
                <div
                  key={option.value}
                  className={clx(
                    "transition-fg bg-ui-bg-base grid cursor-pointer grid-cols-1 items-center gap-2 overflow-hidden",
                    {
                      "grid-cols-[1fr_32px]":
                        option.has_children && !searchValue,
                    }
                  )}
                >
                  <button
                    type="button"
                    role="option"
                    className={clx(
                      "grid h-full w-full appearance-none grid-cols-[20px_1fr] items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left",
                      "hover:bg-ui-bg-base-hover"
                    )}
                    onClick={handleSelect(option)}
                  >
                    <div className="flex size-5 items-center justify-center">
                      {isSelected(value, option.value) && <CheckMini />}
                    </div>
                    <Text
                      as="span"
                      size="small"
                      leading="compact"
                      className="w-full truncate"
                    >
                      {option.label}
                    </Text>
                  </button>
                  {option.has_children && !searchValue && (
                    <button
                      className={clx(
                        "text-ui-fg-muted flex size-8 appearance-none items-center justify-center rounded-md outline-none",
                        "hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed"
                      )}
                      type="button"
                      onClick={handleLevelDown(option)}
                    >
                      <TriangleRightMini />
                    </button>
                  )}
                </div>
              ))}
            {showLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[20px_1fr_20px] gap-2 px-2 py-1.5"
                >
                  <div />
                  <TextSkeleton size="small" leading="compact" />
                  <div />
                </div>
              ))}
            {options.length === 0 && !showLoading && (
              <div className="px-2 py-1.5">
                <Text size="small" leading="compact">
                  {query ? (
                    <Trans
                      i18n={i18n}
                      i18nKey={"general.noSearchResultsFor"}
                      tOptions={{
                        query: query,
                      }}
                      components={[
                        <span className="font-medium" key="query" />,
                      ]}
                    />
                  ) : (
                    t("general.noRecordsFound")
                  )}
                </Text>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
})

CategoryCombobox.displayName = "CategoryCombobox"

type ProductCategoryOption = {
  value: string
  label: string
  has_children: boolean
}

function getParentId(level: Level[]): string {
  if (!level.length) {
    return "null"
  }

  return level[level.length - 1].id
}

function getParentLabel(level: Level[]): string | null {
  if (!level.length) {
    return null
  }

  return level[level.length - 1].label
}

function getOptions(
  categories: AdminProductCategoryResponse["product_category"][]
): ProductCategoryOption[] {
  return categories.map((cat) => {
    return {
      value: cat.id,
      label: cat.name,
      has_children: cat.category_children?.length > 0,
    }
  })
}

function isSelected(values: string[], value: string): boolean {
  return values.includes(value)
}
