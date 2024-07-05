import { Spinner } from "@medusajs/icons"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const iconButtonVariants = cva({
  base: clx(
    "transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden rounded-md outline-none",
    "disabled:bg-ui-bg-disabled disabled:shadow-buttons-neutral disabled:text-ui-fg-disabled disabled:after:hidden"
  ),
  variants: {
    variant: {
      primary: clx(
        "shadow-buttons-neutral text-ui-fg-subtle bg-ui-button-neutral after:button-neutral-gradient",
        "hover:bg-ui-button-neutral-hover hover:after:button-neutral-hover-gradient",
        "active:bg-ui-button-neutral-pressed active:after:button-neutral-pressed-gradient",
        "focus-visible:shadow-buttons-neutral-focus",
        "after:absolute after:inset-0 after:content-['']"
      ),
      transparent: clx(
        "text-ui-fg-subtle bg-ui-button-transparent",
        "hover:bg-ui-button-transparent-hover",
        "active:bg-ui-button-transparent-pressed",
        "focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base",
        "disabled:!bg-transparent disabled:!shadow-none"
      ),
    },
    size: {
      "2xsmall": "h-5 w-5",
      xsmall: "h-6 w-6 p-1",
      small: "h-7 w-7 p-1",
      base: "h-8 w-8 p-1.5",
      large: "h-10 w-10 p-2.5",
      xlarge: "h-12 w-12 p-3.5",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "base",
  },
})

interface IconButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

/**
 * This component is based on the `button` element and supports all of its props
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      /**
       * The button's style.
       */
      variant = "primary",
      /**
       * The button's size.
       */
      size = "base",
      /**
       * Whether to remove the wrapper `button` element and use the
       * passed child element instead.
       */
      asChild = false,
      className,
      children,
      /**
       * Whether to show a loading spinner.
       */
      isLoading = false,
      disabled,
      ...props
    }: IconButtonProps,
    ref
  ) => {
    const Component = asChild ? Slot : "button"

    /**
     * In the case of a button where asChild is true, and isLoading is true, we ensure that
     * only on element is passed as a child to the Slot component. This is because the Slot
     * component only accepts a single child.
     */
    const renderInner = () => {
      if (isLoading) {
        return (
          <span className="pointer-events-none">
            <div
              className={clx(
                "bg-ui-bg-disabled absolute inset-0 flex items-center justify-center rounded-md"
              )}
            >
              <Spinner className="animate-spin" />
            </div>
            {children}
          </span>
        )
      }

      return children
    }

    return (
      <Component
        ref={ref}
        {...props}
        className={clx(iconButtonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
      >
        {renderInner()}
      </Component>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }
