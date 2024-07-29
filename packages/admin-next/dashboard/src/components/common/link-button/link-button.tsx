import { clx } from "@medusajs/ui"
import { ComponentPropsWithoutRef } from "react"
import { Link } from "react-router-dom"

interface LinkButtonProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: "primary" | "interactive"
}

export const LinkButton = ({
  className,
  variant = "interactive",
  ...props
}: LinkButtonProps) => {
  return (
    <Link
      className={clx(
        "transition-fg txt-compact-small-plus rounded-[4px] outline-none",
        "focus-visible:shadow-borders-focus",
        {
          "text-ui-fg-interactive hover:text-ui-fg-interactive-hover":
            variant === "interactive",
          "text-ui-fg-base hover:text-ui-fg-subtle": variant === "primary",
        },
        className
      )}
      {...props}
    />
  )
}
