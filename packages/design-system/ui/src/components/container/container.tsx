import * as React from "react"

import { clx } from "@/utils/clx"

const Container = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clx(
        "shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg px-8 pb-8 pt-6",
        className
      )}
      {...props}
    />
  )
})
Container.displayName = "Container"

export { Container }
