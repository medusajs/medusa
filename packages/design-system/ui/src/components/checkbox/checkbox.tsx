"use client"

import { CheckMini, MinusMini } from "@zjedene-medusa/icons"
import { Checkbox as RadixCheckbox } from "radix-ui"
import * as React from "react"

import { clx } from "@/utils/clx"
import { CheckboxCheckedState } from "./types"

/**
 * This component is based on the [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) primitive.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root> & {
    checked?: CheckboxCheckedState | undefined
  }
>(({ className, checked, ...props }, ref) => {
  return (
    <RadixCheckbox.Root
      {...props}
      ref={ref}
      checked={checked}
      className={clx(
        "group inline-flex h-5 w-5 items-center justify-center outline-none ",
        className
      )}
    >
      <div
        className={clx(
          "text-ui-fg-on-inverted bg-ui-bg-base shadow-borders-base [&_path]:shadow-details-contrast-on-bg-interactive transition-fg h-[15px] w-[15px] rounded-[3px]",
          "group-disabled:cursor-not-allowed group-disabled:opacity-50",
          "group-focus-visible:!shadow-borders-interactive-with-focus",
          "group-hover:group-enabled:group-data-[state=unchecked]:bg-ui-bg-base-hover",
          "group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow",
          "group-data-[state=indeterminate]:bg-ui-bg-interactive group-data-[state=indeterminate]:shadow-borders-interactive-with-shadow"
        )}
      >
        <RadixCheckbox.Indicator>
          {checked === "indeterminate" ? <MinusMini /> : <CheckMini />}
        </RadixCheckbox.Indicator>
      </div>
    </RadixCheckbox.Root>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
