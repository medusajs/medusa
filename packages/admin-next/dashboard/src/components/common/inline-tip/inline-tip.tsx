import { clx } from "@medusajs/ui"
import { ComponentPropsWithoutRef, forwardRef } from "react"
import { useTranslation } from "react-i18next"

interface InlineTipProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The label to display in the tip.
   */
  label?: string
  /**
   * The variant of the tip.
   */
  variant?: "tip" | "warning"
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
  ({ variant = "tip", label, className, children, ...props }, ref) => {
    const { t } = useTranslation()
    const labelValue =
      label || (variant === "warning" ? t("general.warning") : t("general.tip"))

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
          <strong className="txt-small-plus text-ui-fg-base">
            {labelValue}:
          </strong>{" "}
          {children}
        </div>
      </div>
    )
  }
)

InlineTip.displayName = "InlineTip"
