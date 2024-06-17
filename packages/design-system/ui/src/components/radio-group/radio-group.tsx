"use client"

import * as Primitives from "@radix-ui/react-radio-group"
import * as React from "react"

import { clx } from "@/utils/clx"
import { Hint } from "../hint"
import { Label } from "../label"

/**
 * This component is based on the [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) primitives.
 */
const Root = React.forwardRef<
  React.ElementRef<typeof Primitives.Root>,
  React.ComponentPropsWithoutRef<typeof Primitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Root
      className={clx("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
Root.displayName = "RadioGroup"

const Indicator = React.forwardRef<
  React.ElementRef<typeof Primitives.Indicator>,
  React.ComponentPropsWithoutRef<typeof Primitives.Indicator>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Indicator
      ref={ref}
      className={clx("flex items-center justify-center", className)}
      {...props}
    >
      <div
        className={clx(
          "bg-ui-bg-base shadow-details-contrast-on-bg-interactive group-disabled:bg-ui-fg-disabled h-1.5 w-1.5 rounded-full group-disabled:shadow-none"
        )}
      />
    </Primitives.Indicator>
  )
})
Indicator.displayName = "RadioGroup.Indicator"

const Item = React.forwardRef<
  React.ElementRef<typeof Primitives.Item>,
  React.ComponentPropsWithoutRef<typeof Primitives.Item>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Item
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
          "group-hover:bg-ui-bg-base-hover",
          "group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow",
          "group-focus-visible:!shadow-borders-interactive-with-focus",
          "group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base"
        )}
      >
        <Indicator />
      </div>
    </Primitives.Item>
  )
})
Item.displayName = "RadioGroup.Item"

interface ChoiceBoxProps
  extends React.ComponentPropsWithoutRef<typeof Primitives.Item> {
  label: string
  description: string
}

const ChoiceBox = React.forwardRef<
  React.ElementRef<typeof Primitives.Item>,
  ChoiceBoxProps
>(({ className, id, label, description, ...props }, ref) => {
  const generatedId = React.useId()

  if (!id) {
    id = generatedId
  }

  const descriptionId = `${id}-description`

  return (
    <Primitives.Item
      ref={ref}
      className={clx(
        "shadow-borders-base bg-ui-bg-base focus-visible:shadow-borders-interactive-with-focus outline-none transition-fg disabled:bg-ui-bg-disabled group flex items-start gap-x-2 rounded-lg p-3 disabled:cursor-not-allowed data-[state=checked]:shadow-borders-interactive-with-shadow",
        className
      )}
      {...props}
      id={id}
      aria-describedby={descriptionId}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        <div className="shadow-borders-base bg-ui-bg-base group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow transition-fg group-disabled:!bg-ui-bg-disabled group-hover:bg-ui-bg-base-hover group-disabled:!shadow-borders-base flex h-3.5 w-3.5 items-center justify-center rounded-full">
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
          className="txt-compact-medium text-ui-fg-subtle group-disabled:text-ui-fg-disabled text-left"
          id={descriptionId}
        >
          {description}
        </Hint>
      </div>
    </Primitives.Item>
  )
})
ChoiceBox.displayName = "RadioGroup.ChoiceBox"

const RadioGroup = Object.assign(Root, { Item, ChoiceBox })

export { RadioGroup }
