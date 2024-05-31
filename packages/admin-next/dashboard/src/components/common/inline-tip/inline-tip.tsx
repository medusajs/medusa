import { clx } from "@medusajs/ui"
import { ComponentPropsWithoutRef, forwardRef } from "react"

interface InlineTipProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The label to display in the tip.
   */
  label: string
  /**
   * The variant of the tip.
   */
  variant?: "info" | "warning"
}

/**
 * A component for rendering inline tips. Useful for providing additional information or context.
 *
 * @example
 * ```tsx
 * <InlineTip label="Info">
 *  This is an info tip.
 * </InlineTip>
 * ```
 *
 * TODO: Move to `@medusajs/ui` package.
 */
export const InlineTip = forwardRef<HTMLDivElement, InlineTipProps>(
  ({ variant = "info", label, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(
          "bg-ui-bg-component txt-small text-ui-fg-subtle grid grid-cols-[4px_1fr] items-start gap-3 rounded-lg border p-3",
          className
        )}
        {...props}
      >
        <div
          role="presentation"
          className={clx("w-4px bg-ui-tag-neutral-icon h-full rounded-full", {
            "bg-ui-tag-orange-icon": variant === "warning",
          })}
        />
        <div className="text-pretty">
          <strong className="txt-small-plus text-ui-fg-base">{label}:</strong>{" "}
          {children}
        </div>
      </div>
    )
  }
)

InlineTip.displayName = "InlineTip"
