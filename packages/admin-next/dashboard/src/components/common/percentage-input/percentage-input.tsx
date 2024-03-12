import { Input, Text } from "@medusajs/ui"
import { ComponentProps, ElementRef, forwardRef } from "react"

export const PercentageInput = forwardRef<
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
PercentageInput.displayName = "HandleInput"
