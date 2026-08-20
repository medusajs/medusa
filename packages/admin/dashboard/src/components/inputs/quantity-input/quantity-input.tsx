import { clx, Input, Text } from "@medusajs/ui"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

type QuantityInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  "type"
> & {
  /**
   * The unit the quantity is counted in, e.g. `lb`. When omitted the input is
   * rendered unchanged.
   */
  unitOfMeasure?: string | null
}

/**
 * A number input that renders an inventory item's unit of measure as a suffix,
 * so a fractional quantity reads as `0.25 | lb`.
 *
 * The unit is a sibling of the input rather than an overlay on top of it:
 * padding the input to make room would shrink its content box, and browsers
 * anchor the native number stepper to that box, leaving the stepper floating
 * short of the separator.
 */
export const QuantityInput = forwardRef<
  ElementRef<typeof Input>,
  QuantityInputProps
>(({ unitOfMeasure, className, size = "base", ...props }, ref) => {
  if (!unitOfMeasure) {
    return (
      <Input
        ref={ref}
        type="number"
        size={size}
        className={className}
        {...props}
      />
    )
  }

  const isInvalid =
    props["aria-invalid"] === true || props["aria-invalid"] === "true"

  return (
    <div
      className={clx(
        "bg-ui-bg-field shadow-borders-base transition-fg flex w-full items-center overflow-hidden rounded-md",
        "hover:bg-ui-bg-field-hover",
        "focus-within:shadow-borders-interactive-with-active",
        size === "small" ? "h-7" : "h-8",
        isInvalid && "!shadow-borders-error",
        className
      )}
    >
      <input
        ref={ref}
        type="number"
        className={clx(
          "txt-compact-small text-ui-fg-base placeholder-ui-fg-muted",
          "size-full min-w-0 flex-1 appearance-none bg-transparent px-2 outline-none",
          "disabled:text-ui-fg-disabled disabled:cursor-not-allowed",
          size === "small" ? "py-1" : "py-1.5"
        )}
        {...props}
      />
      <div className="flex h-full max-w-16 shrink-0 items-center border-l px-2">
        <Text
          className="text-ui-fg-muted truncate"
          size="small"
          leading="compact"
          weight="plus"
        >
          {unitOfMeasure}
        </Text>
      </div>
    </div>
  )
})
QuantityInput.displayName = "QuantityInput"
