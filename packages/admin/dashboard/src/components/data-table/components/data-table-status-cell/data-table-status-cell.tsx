import { clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

type StatusColor = "green" | "red" | "blue" | "orange" | "grey" | "purple"

type DataTableStatusIndicatorProps = PropsWithChildren<{
  color?: StatusColor
  /**
   * Extra classes for the root. `DataTableStatusCell` passes `w-full` so it
   * fills the cell (default left-aligned layout); omit it to let the indicator
   * shrink to its content so a surrounding `align` wrapper can center/right it.
   */
  className?: string
}>

/**
 * Colored status dot + label. Shrink-to-fit by default so it can be aligned by
 * the surrounding cell (e.g. a center-aligned configurable table column).
 */
export const DataTableStatusIndicator = ({
  color,
  className,
  children,
}: DataTableStatusIndicatorProps) => {
  return (
    <div
      className={clx(
        "txt-compact-small text-ui-fg-subtle flex h-full items-center gap-x-2",
        className
      )}
    >
      <div
        role="presentation"
        className="flex h-5 w-2 items-center justify-center"
      >
        <div
          className={clx(
            "h-2 w-2 rounded-sm shadow-[0px_0px_0px_1px_rgba(0,0,0,0.12)_inset]",
            {
              "bg-ui-tag-neutral-icon": color === "grey",
              "bg-ui-tag-green-icon": color === "green",
              "bg-ui-tag-red-icon": color === "red",
              "bg-ui-tag-blue-icon": color === "blue",
              "bg-ui-tag-orange-icon": color === "orange",
              "bg-ui-tag-purple-icon": color === "purple",
            }
          )}
        />
      </div>
      <span className="truncate">{children}</span>
    </div>
  )
}

type DataTableStatusCellProps = PropsWithChildren<{
  color?: StatusColor
}>

export const DataTableStatusCell = ({
  color,
  children,
}: DataTableStatusCellProps) => {
  return (
    <DataTableStatusIndicator color={color} className="w-full overflow-hidden">
      {children}
    </DataTableStatusIndicator>
  )
}
