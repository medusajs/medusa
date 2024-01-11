import * as React from "react"

import { clx } from "@/utils/clx"

interface StatusBadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "color"> {
  color?: "green" | "red" | "blue" | "orange" | "grey" | "purple"
}

/**
 * This component is based on the span element and supports all of its props
 */
const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      children,
      className,
      /**
       * The status's color.
       */
      color = "grey",
      ...props
    }: StatusBadgeProps,
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={clx(
          "bg-ui-bg-base border-ui-border-base txt-compact-small text-ui-fg-base inline-flex items-center justify-center rounded-full border py-1 pl-1 pr-2.5",
          className
        )}
        {...props}
      >
        <span
          role="presentation"
          className="mr-0.5 flex h-5 w-5 items-center justify-center"
        >
          <span
            role="presentation"
            className="bg-ui-bg-base shadow-borders-base flex h-2.5 w-2.5 items-center justify-center rounded-full"
          >
            <span
              className={clx("h-1.5 w-1.5 rounded-full", {
                "bg-ui-tag-neutral-icon": color === "grey",
                "bg-ui-tag-green-icon": color === "green",
                "bg-ui-tag-red-icon": color === "red",
                "bg-ui-tag-orange-icon": color === "orange",
                "bg-ui-tag-blue-icon": color === "blue",
                "bg-ui-tag-purple-icon": color === "purple",
              })}
            />
          </span>
        </span>
        {children}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge }
