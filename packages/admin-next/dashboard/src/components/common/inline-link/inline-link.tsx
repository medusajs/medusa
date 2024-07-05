import { clx } from "@medusajs/ui"
import { ComponentPropsWithoutRef } from "react"
import { Link } from "react-router-dom"

export const InlineLink = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Link>) => {
  return (
    <Link
      onClick={(e) => {
        e.stopPropagation()
      }}
      className={clx(
        "text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover rounded-md outline-none",
        className
      )}
      {...props}
    />
  )
}
