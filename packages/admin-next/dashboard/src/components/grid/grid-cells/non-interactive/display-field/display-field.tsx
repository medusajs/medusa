import { clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

type DisplayFieldProps = PropsWithChildren<{
  variant?: "base" | "subtle"
}>

/**
 * Field for displaying non-editable data in a grid.
 */
export const DisplayField = ({
  children,
  variant = "base",
}: DisplayFieldProps) => {
  return (
    <div
      className={clx(
        "flex size-full cursor-not-allowed items-center justify-center px-4 py-2.5",
        {}
      )}
      data-role="presentation"
    >
      {children}
    </div>
  )
}
