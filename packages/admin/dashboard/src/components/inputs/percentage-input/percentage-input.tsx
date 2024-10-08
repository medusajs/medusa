import { Input, Text, clx } from "@medusajs/ui"
import { ComponentProps, ElementRef, forwardRef } from "react"
import Primitive from "react-currency-input-field"

/**
 * @deprecated Use `PercentageInput` instead
 */
export const DeprecatedPercentageInput = forwardRef<
  ElementRef<typeof Input>,
  Omit<ComponentProps<typeof Input>, "type">
>(({ min = 0, max = 100, step = 0.0001, ...props }, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center border-r">
        <Text
          className="text-ui-fg-muted"
          size="small"
          leading="compact"
          weight="plus"
        >
          %
        </Text>
      </div>
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        {...props}
        className="pl-10"
      />
    </div>
  )
})
DeprecatedPercentageInput.displayName = "PercentageInput"

export const PercentageInput = forwardRef<
  ElementRef<"input">,
  ComponentProps<typeof Primitive>
>(({ min = 0, decimalScale = 2, className, ...props }, ref) => {
  return (
    <div className="relative">
      <Primitive
        ref={ref as any} // dependency is typed incorrectly
        min={min}
        autoComplete="off"
        decimalScale={decimalScale}
        decimalsLimit={decimalScale}
        {...props}
        className={clx(
          "caret-ui-fg-base bg-ui-bg-field shadow-buttons-neutral transition-fg txt-compact-small flex w-full select-none appearance-none items-center justify-between rounded-md px-2 py-1.5 pr-10 text-right outline-none",
          "placeholder:text-ui-fg-muted text-ui-fg-base",
          "hover:bg-ui-bg-field-hover",
          "focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active",
          "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error",
          "invalid::border-ui-border-error invalid:shadow-borders-error",
          "disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled",
          className
        )}
      />
      <div className="absolute inset-y-0 right-0 z-10 flex w-8 items-center justify-center border-l">
        <Text
          className="text-ui-fg-muted"
          size="small"
          leading="compact"
          weight="plus"
        >
          %
        </Text>
      </div>
    </div>
  )
})
PercentageInput.displayName = "PercentageInput"
