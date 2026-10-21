"use client"

import { RadioGroup as RadixRadioGroup } from "radix-ui"
import * as React from "react"

import { Hint } from "@/components/hint"
import { Label } from "@/components/label"
import { clx } from "@/utils/clx"

/**
 * This component is based on the [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) primitives.
 */
const Root = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Root>,
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadixRadioGroup.Root
      className={clx("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
Root.displayName = "RadioGroup"

const Indicator = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Indicator>,
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Indicator>
>(({ className, ...props }, ref) => {
  return (
    <RadixRadioGroup.Indicator
      ref={ref}
      className={clx("flex items-center justify-center", className)}
      {...props}
    >
      <div
        className={clx(
          "bg-ui-bg-base shadow-details-contrast-on-bg-interactive h-1.5 w-1.5 rounded-full"
        )}
      />
    </RadixRadioGroup.Indicator>
  )
})
Indicator.displayName = "RadioGroup.Indicator"

const Item = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadixRadioGroup.Item
      ref={ref}
      className={clx(
        "group relative flex h-5 w-5 items-center justify-center outline-none",
        className
      )}
      {...props}
    >
      <div
        className={clx(
          "shadow-borders-base bg-ui-bg-base transition-fg flex h-[14px] w-[14px] items-center justify-center rounded-full",
          "group-hover:group-enabled:group-data-[state=unchecked]:bg-ui-bg-base-hover",
          "group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow",
          "group-focus-visible:!shadow-borders-interactive-with-focus",
          "group-disabled:cursor-not-allowed group-disabled:opacity-50"
        )}
      >
        <Indicator />
      </div>
    </RadixRadioGroup.Item>
  )
})
Item.displayName = "RadioGroup.Item"

interface ChoiceBoxProps
  extends React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item> {
  label: string
  description: string
}

/**
 * This component is based on the [Radix UI Radio Group Item](https://www.radix-ui.com/primitives/docs/components/radio-group#item) primitives.
 */
const ChoiceBox = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Item>,
  ChoiceBoxProps
>(({ 
  className, 
  id, 
  /**
   * The label for the radio button.
   */
  label, 
  /**
   * The description for the radio button.
   */
  description,
  /**
   * The value of the radio button.
   */
  value,
  ...props
}: ChoiceBoxProps, ref) => {
  const generatedId = React.useId()

  if (!id) {
    id = generatedId
  }

  const descriptionId = `${id}-description`

  return (
    <RadixRadioGroup.Item
      ref={ref}
      className={clx(
        "shadow-borders-base bg-ui-bg-base focus-visible:shadow-borders-interactive-with-focus transition-fg group flex items-start gap-x-2 rounded-lg p-3 outline-none",
        "hover:enabled:bg-ui-bg-base-hover",
        "data-[state=checked]:shadow-borders-interactive-with-shadow",
        "group-disabled:cursor-not-allowed group-disabled:opacity-50",
        className
      )}
      {...props}
      value={value}
      id={id}
      aria-describedby={descriptionId}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        <div
          className={clx(
            "shadow-borders-base bg-ui-bg-base group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow transition-fg flex h-3.5 w-3.5 items-center justify-center rounded-full",
            "group-hover:group-enabled:group-data-[state=unchecked]:bg-ui-bg-base-hover"
          )}
        >
          <Indicator />
        </div>
      </div>
      <div className="flex flex-col items-start">
        <Label
          htmlFor={id}
          size="small"
          weight="plus"
          className="group-disabled:text-ui-fg-disabled cursor-pointer group-disabled:cursor-not-allowed"
        >
          {label}
        </Label>
        <Hint
          className="txt-small text-ui-fg-subtle group-disabled:text-ui-fg-disabled text-start"
          id={descriptionId}
        >
          {description}
        </Hint>
      </div>
    </RadixRadioGroup.Item>
  )
})
ChoiceBox.displayName = "RadioGroup.ChoiceBox"

const RadioGroup = Object.assign(Root, { Item, ChoiceBox })

export { RadioGroup }
