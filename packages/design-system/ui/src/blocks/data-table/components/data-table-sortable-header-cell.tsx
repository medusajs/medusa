import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { clx } from "@/utils/clx"
import { Table } from "@/components/table"

interface DataTableSortableHeaderCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string
  children: React.ReactNode
  isFirstColumn?: boolean
}

export const DataTableSortableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  DataTableSortableHeaderCellProps
>(
  (
    { id, children, className, style: propStyle, isFirstColumn, ...props },
    ref
  ) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id,
    })

    // Only apply horizontal transform, ignore vertical movement
    const transformStyle = transform
      ? {
          x: transform.x,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        }
      : null

    const style: React.CSSProperties = {
      ...propStyle,
      transform: transformStyle
        ? CSS.Transform.toString(transformStyle)
        : undefined,
      transition,
      opacity: isDragging ? 0.9 : 1,
      zIndex: isDragging ? 50 : isFirstColumn ? 1 : undefined,
    }

    const combineRefs = (element: HTMLTableCellElement | null) => {
      setNodeRef(element)
      if (ref) {
        if (typeof ref === "function") {
          ref(element)
        } else {
          ref.current = element
        }
      }
    }

    return (
      <Table.HeaderCell
        ref={combineRefs}
        style={style}
        className={clx(className, "group/header-cell bg-ui-bg-subtle", {
          "bg-ui-bg-base border-ui-border-interactive shadow-elevation-flyout":
            isDragging,
        })}
        {...attributes}
        {...listeners}
        {...props}
      >
        {children}
      </Table.HeaderCell>
    )
  }
)

DataTableSortableHeaderCell.displayName = "DataTableSortableHeaderCell"
