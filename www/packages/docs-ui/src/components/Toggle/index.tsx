import { Switch } from "@medusajs/ui"
import clsx from "clsx"
import React from "react"

export const Toggle = ({
  className,
  ...props
}: React.ComponentProps<typeof Switch>) => {
  return (
    <Switch
      {...props}
      className={clsx(
        className,
        "bg-ui-bg-switch-off hover:bg-ui-bg-switch-off-hover data-[state=unchecked]:hover:after:bg-switch-off-hover-gradient",
        "before:shadow-details-switch-background focus-visible:shadow-details-switch-background-focus data-[state=checked]:bg-ui-bg-interactive",
        "disabled:!bg-ui-bg-disabled group relative inline-flex items-center rounded-full outline-none transition-all before:absolute",
        "before:inset-0 before:rounded-full before:content-[''] after:absolute after:inset-0 after:rounded-full after:content-['']",
        "disabled:cursor-not-allowed",
        // eslint-disable-next-line react/prop-types
        props.size !== "small" &&
          "h-[18px] w-[32px] [&_span]:h-[14px] [&_span]:w-[14px]",
        "[&_span]:bg-medusa-fg-on-color [&_span]:shadow-details-switch-handle [&_span]:group-disabled:bg-ui-fg-disabled [&_span]:pointer-events-none",
        "[&_span]:rounded-full [&_span]:group-disabled:shadow-none [&_span]:transition-transform",
        "[&_span]:data-[state=checked]:translate-x-docs_1 [&_span]:data-[state=unchecked]:translate-x-docs_0.125"
      )}
    />
  )
}
