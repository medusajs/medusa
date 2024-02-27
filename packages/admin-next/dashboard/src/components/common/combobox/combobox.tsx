import { Combobox as Primitive } from "@headlessui/react"
import { EllipseMiniSolid, TrianglesMini } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { clx } from "@medusajs/ui"
import * as Popover from "@radix-ui/react-popover"
import { useAdminProducts } from "medusa-react"
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
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

type ComboboxProps = {
  size?: "base" | "small"
  options: ComboboxOption[]
  value: string
}

export const Combobox = ({ size = "base" }: ComboboxProps) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [query, setQuery] = useState("")
  const { products, count, isLoading } = useAdminProducts(
    {
      q: query,
    },
    {
      keepPreviousData: true,
    }
  )

  return (
    <Primitive by="id" value={product} onChange={setProduct}>
      <div className="relative">
        <div className="relative w-full">
          <Primitive.Input
            onChange={(e) => setQuery(e.target.value)}
            displayValue={(value: Product) => value?.title}
            className={clx(
              "bg-ui-bg-field shadow-buttons-neutral transition-fg flex w-full select-none items-center justify-between rounded-md outline-none",
              "placeholder:text-ui-fg-muted text-ui-fg-base",
              "hover:bg-ui-bg-field-hover",
              "focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active",
              "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error",
              "invalid:border-ui-border-error invalid:shadow-borders-error",
              "disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled",
              {
                "h-8 px-2 py-1.5 txt-compact-small": size === "base",
                "h-7 px-2 py-1 txt-compact-small": size === "small",
              }
            )}
          />
          <Primitive.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <TrianglesMini className="text-ui-fg-muted" aria-hidden="true" />
          </Primitive.Button>
        </div>
        <Primitive.Options className="absolute mt-2 max-h-[200px] w-full overflow-auto z-10 bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout rounded-lg p-1">
          {products?.map((p) => (
            <Primitive.Option
              key={p.id}
              value={p}
              className={clx(
                "bg-ui-bg-base grid cursor-pointer grid-cols-[20px_1fr] gap-x-2 items-center rounded-md px-3 py-2 outline-none transition-colors",
                "ui-active:bg-ui-bg-base-hover",
                {
                  "txt-compact-medium data-[state=checked]:txt-compact-medium-plus":
                    size === "base",
                  "txt-compact-small data-[state=checked]:txt-compact-medium-plus":
                    size === "small",
                }
              )}
            >
              <div
                className="w-5 h-5 flex items-center justify-center"
                aria-hidden="true"
              >
                <EllipseMiniSolid className="ui-selected:block hidden" />
              </div>
              <span className="block truncate ui-selected:font-medium">
                {p.title}
              </span>
            </Primitive.Option>
          ))}
        </Primitive.Options>
      </div>
    </Primitive>
  )
}

type ComboboxContextValue = {
  size: "base" | "small"
  open: boolean
  setOpen: (open: boolean) => void
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)

const useComboboxContext = () => {
  const context = useContext(ComboboxContext)

  if (!context) {
    throw new Error(
      "Combobox compound components cannot be rendered outside the Combobox component"
    )
  }

  return context
}

const Root = forwardRef<
  ElementRef<typeof Primitive>,
  Omit<ComponentPropsWithoutRef<typeof Primitive>, "children"> & {
    className?: string
    size?: "base" | "small"
    children: ReactNode
  }
>(({ children, className, size = "base", ...props }, ref) => {
  const [open, setOpen] = useState(false)

  const value = useMemo(() => ({ size, open, setOpen }), [size, open])

  return (
    <ComboboxContext.Provider value={value}>
      <Primitive {...props} ref={ref}>
        <Popover.Root open={open} onOpenChange={setOpen}>
          {children}
        </Popover.Root>
      </Primitive>
    </ComboboxContext.Provider>
  )
})
Root.displayName = "Combobox"

const Trigger = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { size } = useComboboxContext()

    return (
      <Popover.Trigger asChild>
        <div
          className={clx(
            "relative bg-ui-bg-field shadow-buttons-neutral transition-fg w-full select-none items-center justify-between rounded-md outline-none",
            "hover:bg-ui-bg-field-hover",
            "focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active",
            "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error",
            "invalid:border-ui-border-error invalid:shadow-borders-error",
            "disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled",
            {
              "h-8 px-2 py-1.5 txt-compact-small": size === "base",
              "h-7 px-2 py-1 txt-compact-small": size === "small",
            },
            className
          )}
          {...props}
          ref={ref}
        >
          {children}
          <Primitive.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <TrianglesMini className="text-ui-fg-muted" aria-hidden="true" />
          </Primitive.Button>
        </div>
      </Popover.Trigger>
    )
  }
)
Trigger.displayName = "Combobox.Trigger"

const Value = forwardRef<
  ElementRef<typeof Primitive.Input>,
  ComponentPropsWithoutRef<typeof Primitive.Input>
>(({ className, ...props }, ref) => {
  const { size } = useComboboxContext()

  return (
    <Primitive.Input
      {...props}
      ref={ref}
      className={clx(
        "placeholder:text-ui-fg-muted text-ui-fg-base outline-none bg-transparent w-full",
        "disabled:!text-ui-fg-disabled",
        {
          " txt-compact-small": size === "base",
          "txt-compact-small": size === "small",
        },
        className
      )}
    />
  )
})
Value.displayName = "Combobox.Value"

const Item = forwardRef<
  ElementRef<typeof Primitive.Option>,
  Omit<ComponentPropsWithoutRef<typeof Primitive.Option>, "children"> & {
    children?: ReactNode
  }
>(({ children, className, ...props }, ref) => {
  const { size } = useComboboxContext()

  return (
    <Primitive.Option
      {...props}
      ref={ref}
      className={clx(
        "bg-ui-bg-base grid cursor-pointer grid-cols-[20px_1fr] gap-x-2 items-center rounded-md px-2 py-1.5 outline-none transition-colors",
        "ui-active:bg-ui-bg-base-hover",
        {
          "txt-compact-medium data-[state=checked]:txt-compact-medium-plus":
            size === "base",
          "txt-compact-small data-[state=checked]:txt-compact-medium-plus":
            size === "small",
        },
        className
      )}
    >
      <div
        className="w-5 h-5 flex items-center justify-center"
        aria-hidden="true"
      >
        <EllipseMiniSolid className="ui-selected:block hidden" />
      </div>
      {children}
    </Primitive.Option>
  )
})
Item.displayName = "Combobox.Item"

const NoResults = forwardRef<
  ElementRef<"span">,
  ComponentPropsWithoutRef<"span">
>(({ children, className, ...props }, ref) => {
  const { size } = useComboboxContext()
  const { t } = useTranslation()

  return (
    <span
      {...props}
      ref={ref}
      className={clx(
        "bg-ui-bg-base items-center flex w-full justify-center rounded-md px-2 py-1.5 outline-none transition-colors",
        "ui-active:bg-ui-bg-base-hover",
        {
          "txt-compact-medium data-[state=checked]:txt-compact-medium-plus":
            size === "base",
          "txt-compact-small data-[state=checked]:txt-compact-medium-plus":
            size === "small",
        },
        className
      )}
    >
      {children ?? t("general.noResultsTitle")}
    </span>
  )
})
Item.displayName = "Combobox.NoResults"

const Content = forwardRef<
  ElementRef<typeof Popover.Content>,
  ComponentPropsWithoutRef<typeof Popover.Content>
>(
  (
    {
      children,
      className,
      side = "bottom",
      sideOffset = 8,
      collisionPadding = 24,
      ...props
    },
    ref
  ) => {
    return (
      <Popover.Portal>
        <Popover.Content
          ref={ref}
          className={clx(
            "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout relative max-h-[120px] h-full min-w-[var(--radix-popper-anchor-width)] overflow-hidden rounded-lg flex flex-col divide-y",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          side={side}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          {...props}
        >
          <Primitive.Options
            static={true}
            className={clx("p-1 flex-1 overflow-auto")}
          >
            {children}
          </Primitive.Options>
        </Popover.Content>
      </Popover.Portal>
    )
  }
)
Content.displayName = "Combobox.Content"

const Pagination = forwardRef<
  ElementRef<"div">,
  {
    isLoading?: boolean
    hasNext?: boolean
    onPaginate: () => void
    className?: string
  }
>(({ isLoading, hasNext, onPaginate, className, ...props }, ref) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Merge innerRef and ref
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => {
    return innerRef.current
  })

  useEffect(() => {
    if (innerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          onPaginate()
        }
      })

      observerRef.current.observe(innerRef.current)
    }

    return () => {
      if (observerRef.current && innerRef.current) {
        observerRef.current.unobserve(innerRef.current)
      }
    }
  }, [isLoading, hasNext, onPaginate, ref])

  return <div ref={innerRef} className="bg-transparent w-px h-px" {...props} />
})
Pagination.displayName = "Combobox.Pagination"

const Combo = Object.assign(Root, {
  Trigger,
  Value,
  Item,
  NoResults,
  Pagination,
  Content,
})

export const TestCombobox = () => {
  const [product, setProduct] = useState<Product[]>([])
  const [query, setQuery] = useState("")
  const { products, count, isLoading } = useAdminProducts(
    {
      q: query,
    },
    {
      keepPreviousData: true,
    }
  )

  return (
    <Combo value={product} onChange={setProduct}>
      <Combo.Trigger>
        <Combo.Value
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(value: Product[]) => `${value?.length}`}
        />
      </Combo.Trigger>
      <Combo.Content>
        {!products?.length && <Combo.NoResults />}
        <Combo.Pagination isLoading onPaginate={() => console.log("Heyo!")} />
        {products?.map((p) => (
          <Combo.Item key={p.id} value={p}>
            {p.title}
          </Combo.Item>
        ))}
      </Combo.Content>
    </Combo>
  )
}
