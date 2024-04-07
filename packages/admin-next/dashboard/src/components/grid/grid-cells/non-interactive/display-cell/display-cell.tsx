import { clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

type DisplayCellProps = PropsWithChildren<{
  variant?: "base" | "subtle"
}>

/**
 * Field for displaying non-editable data in a grid.
 * @deprecated Use `VoidCell` or `ReadonlyCell` instead.
 */
export const DisplayCell = ({
  children,
  variant = "base",
}: DisplayCellProps) => {
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
