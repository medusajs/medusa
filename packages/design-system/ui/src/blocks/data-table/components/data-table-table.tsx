"use client"

import * as React from "react"

import { Table } from "@/components/table"
import { flexRender } from "@tanstack/react-table"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"

import { useDataTableContext } from "@/blocks/data-table/context/use-data-table-context"
import { Skeleton } from "@/components/skeleton"
import { Text } from "@/components/text"
import { clx } from "@/utils/clx"
import {
  DataTableEmptyState,
  DataTableEmptyStateContent,
  DataTableEmptyStateProps,
} from "../types"
import { DataTableSortingIcon } from "./data-table-sorting-icon"
import { DataTableSortableHeaderCell } from "./data-table-sortable-header-cell"
import { DataTableNonSortableHeaderCell } from "./data-table-non-sortable-header-cell"

interface DataTableTableProps {
  /**
   * The empty state to display when the table is empty.
   */
  emptyState?: DataTableEmptyStateProps
}

/**
 * This component renders the table in a data table, supporting advanced features.
 */
const DataTableTable = (props: DataTableTableProps) => {
  const hoveredRowId = React.useRef<string | null>(null)
  const isKeyDown = React.useRef(false)

  const [showStickyBorder, setShowStickyBorder] = React.useState(false)
  const scrollableRef = React.useRef<HTMLDivElement>(null)

  const { instance } = useDataTableContext()

  const pageIndex = instance.pageIndex

  const columns = instance.getAllColumns()

  const hasSelect = columns.find((c) => c.id === "select")
  const hasActions = columns.find((c) => c.id === "action")

  // Create list of all column IDs for SortableContext
  // Use current order if available, otherwise use default order
  const sortableItems = React.useMemo(() => {
    if (instance.columnOrder && instance.columnOrder.length > 0) {
      return instance.columnOrder
    }
    return columns.map((col) => col.id)
  }, [columns, instance.columnOrder])

  // Setup drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over?.id) {
      const activeId = active.id as string
      const overId = over.id as string

      // Don't allow dragging fixed columns
      if (activeId === "select" || activeId === "action") {
        return
      }

      // Don't allow dropping on fixed columns
      if (overId === "select" || overId === "action") {
        return
      }

      // Use the current column order from the instance
      const currentOrder =
        instance.columnOrder && instance.columnOrder.length > 0
          ? instance.columnOrder
          : columns.map((col) => col.id)

      const oldIndex = currentOrder.indexOf(activeId)
      const newIndex = currentOrder.indexOf(overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex)
        instance.setColumnOrderFromArray(newOrder)
      }
    }
  }

  React.useEffect(() => {
    const onKeyDownHandler = (event: KeyboardEvent) => {
      // If an editable element is focused, we don't want to select a row
      const isEditableElementFocused = getIsEditableElementFocused()

      if (
        event.key.toLowerCase() === "x" &&
        hoveredRowId &&
        !isKeyDown.current &&
        !isEditableElementFocused
      ) {
        isKeyDown.current = true

        const row = instance
          .getRowModel()
          .rows.find((r) => r.id === hoveredRowId.current)

        if (row && row.getCanSelect()) {
          row.toggleSelected()
        }
      }
    }

    const onKeyUpHandler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "x") {
        isKeyDown.current = false
      }
    }

    document.addEventListener("keydown", onKeyDownHandler)
    document.addEventListener("keyup", onKeyUpHandler)
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler)
      document.removeEventListener("keyup", onKeyUpHandler)
    }
  }, [hoveredRowId, instance])

  const handleHorizontalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft

    if (scrollLeft > 0) {
      setShowStickyBorder(true)
    } else {
      setShowStickyBorder(false)
    }
  }

  React.useEffect(() => {
    scrollableRef.current?.scroll({ top: 0, left: 0 })
  }, [pageIndex])

  if (instance.showSkeleton) {
    return <DataTableTableSkeleton pageSize={instance.pageSize} />
  }

  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      {instance.emptyState === DataTableEmptyState.POPULATED &&
        (instance.enableColumnOrder ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div
              ref={scrollableRef}
              onScroll={handleHorizontalScroll}
              className="min-h-0 w-full flex-1 overflow-auto overscroll-auto border-y"
            >
              <Table className="relative isolate w-full">
                <Table.Header
                  className="shadow-ui-border-base sticky inset-x-0 top-0 z-[1] w-full border-b-0 border-t-0 shadow-[0_1px_1px_0]"
                  style={{ transform: "translate3d(0,0,0)" }}
                >
                  {instance.getHeaderGroups().map((headerGroup) => (
                    <Table.Row
                      key={headerGroup.id}
                      className={clx("border-b-0", {
                        "[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap":
                          hasActions,
                        "[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap":
                          hasSelect,
                      })}
                    >
                      <SortableContext
                        items={sortableItems}
                        strategy={horizontalListSortingStrategy}
                      >
                        {headerGroup.headers.map((header, idx) => {
                          const canSort = header.column.getCanSort()
                          const sortDirection = header.column.getIsSorted()
                          const sortHandler =
                            header.column.getToggleSortingHandler()

                          const isActionHeader = header.id === "action"
                          const isSelectHeader = header.id === "select"
                          const isSpecialHeader =
                            isActionHeader || isSelectHeader
                          const isDraggable = !isSpecialHeader

                          const Wrapper = canSort ? "button" : "div"
                          const isFirstColumn = hasSelect
                            ? idx === 1
                            : idx === 0

                          // Get header alignment from column metadata
                          const headerAlign =
                            (header.column.columnDef.meta as any)
                              ?.___alignMetaData?.headerAlign || "left"
                          const isRightAligned = headerAlign === "right"
                          const isCenterAligned = headerAlign === "center"

                          const HeaderCellComponent = isDraggable
                            ? DataTableSortableHeaderCell
                            : DataTableNonSortableHeaderCell

                          return (
                            <HeaderCellComponent
                              key={header.id}
                              id={header.id}
                              isFirstColumn={isFirstColumn}
                              className={clx("whitespace-nowrap", {
                                "w-[calc(20px+24px+24px)] min-w-[calc(20px+24px+24px)] max-w-[calc(20px+24px+24px)]":
                                  isSelectHeader,
                                "w-[calc(28px+24px+4px)] min-w-[calc(28px+24px+4px)] max-w-[calc(28px+24px+4px)]":
                                  isActionHeader,
                                "after:absolute after:inset-y-0 after:right-0 after:h-full after:w-px after:bg-transparent after:content-['']":
                                  isFirstColumn,
                                "after:bg-ui-border-base":
                                  showStickyBorder && isFirstColumn,
                                "bg-ui-bg-subtle sticky":
                                  isFirstColumn || isSelectHeader,
                                "left-0":
                                  isSelectHeader ||
                                  (isFirstColumn && !hasSelect),
                                "left-[calc(20px+24px+24px)]":
                                  isFirstColumn && hasSelect,
                              })}
                              style={
                                !isSpecialHeader
                                  ? {
                                      width: header.column.columnDef.size,
                                      maxWidth: header.column.columnDef.maxSize,
                                      minWidth: header.column.columnDef.minSize,
                                    }
                                  : undefined
                              }
                            >
                              <Wrapper
                                type={canSort ? "button" : undefined}
                                onClick={canSort ? sortHandler : undefined}
                                onMouseDown={
                                  canSort
                                    ? (e) => e.stopPropagation()
                                    : undefined
                                }
                                className={clx(
                                  "group flex cursor-default items-center gap-2",
                                  {
                                    "cursor-pointer": canSort,
                                    "w-full": isRightAligned || isCenterAligned,
                                    "w-fit":
                                      !isRightAligned && !isCenterAligned,
                                    "justify-end": isRightAligned,
                                    "justify-center": isCenterAligned,
                                  }
                                )}
                              >
                                {canSort && isRightAligned && (
                                  <DataTableSortingIcon
                                    direction={sortDirection}
                                  />
                                )}
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {canSort && !isRightAligned && (
                                  <DataTableSortingIcon
                                    direction={sortDirection}
                                  />
                                )}
                              </Wrapper>
                            </HeaderCellComponent>
                          )
                        })}
                      </SortableContext>
                    </Table.Row>
                  ))}
                </Table.Header>
                <Table.Body className="border-b-0 border-t-0">
                  {instance.getRowModel().rows.map((row) => {
                    return (
                      <Table.Row
                        key={row.id}
                        onMouseEnter={() => (hoveredRowId.current = row.id)}
                        onMouseLeave={() => (hoveredRowId.current = null)}
                        onClick={(e) => instance.onRowClick?.(e, row)}
                        className={clx("group/row last-of-type:border-b-0", {
                          "cursor-pointer": !!instance.onRowClick,
                        })}
                      >
                        {row.getVisibleCells().map((cell, idx) => {
                          const isSelectCell = cell.column.id === "select"
                          const isActionCell = cell.column.id === "action"
                          const isSpecialCell = isSelectCell || isActionCell

                          const isFirstColumn = hasSelect
                            ? idx === 1
                            : idx === 0

                          return (
                            <Table.Cell
                              key={cell.id}
                              className={clx(
                                "items-stretch truncate whitespace-nowrap",
                                {
                                  "w-[calc(20px+24px+24px)] min-w-[calc(20px+24px+24px)] max-w-[calc(20px+24px+24px)]":
                                    isSelectCell,
                                  "w-[calc(28px+24px+4px)] min-w-[calc(28px+24px+4px)] max-w-[calc(28px+24px+4px)]":
                                    isActionCell,
                                  "bg-ui-bg-base group-hover/row:bg-ui-bg-base-hover transition-fg sticky h-full":
                                    isFirstColumn || isSelectCell,
                                  "after:absolute after:inset-y-0 after:right-0 after:h-full after:w-px after:bg-transparent after:content-['']":
                                    isFirstColumn,
                                  "after:bg-ui-border-base":
                                    showStickyBorder && isFirstColumn,
                                  "left-0":
                                    isSelectCell ||
                                    (isFirstColumn && !hasSelect),
                                  "left-[calc(20px+24px+24px)]":
                                    isFirstColumn && hasSelect,
                                }
                              )}
                              style={
                                !isSpecialCell
                                  ? {
                                      width: cell.column.columnDef.size,
                                      maxWidth: cell.column.columnDef.maxSize,
                                      minWidth: cell.column.columnDef.minSize,
                                    }
                                  : undefined
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Table.Cell>
                          )
                        })}
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </div>
          </DndContext>
        ) : (
          <div
            ref={scrollableRef}
            onScroll={handleHorizontalScroll}
            className="min-h-0 w-full flex-1 overflow-auto overscroll-auto border-y"
          >
            <Table className="relative isolate w-full">
              <Table.Header
                className="shadow-ui-border-base sticky inset-x-0 top-0 z-[1] w-full border-b-0 border-t-0 shadow-[0_1px_1px_0]"
                style={{ transform: "translate3d(0,0,0)" }}
              >
                {instance.getHeaderGroups().map((headerGroup) => (
                  <Table.Row
                    key={headerGroup.id}
                    className={clx("border-b-0", {
                      "[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap":
                        hasActions,
                      "[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap":
                        hasSelect,
                    })}
                  >
                    {headerGroup.headers.map((header, idx) => {
                      const canSort = header.column.getCanSort()
                      const sortDirection = header.column.getIsSorted()
                      const sortHandler =
                        header.column.getToggleSortingHandler()

                      const isActionHeader = header.id === "action"
                      const isSelectHeader = header.id === "select"
                      const isSpecialHeader = isActionHeader || isSelectHeader

                      const Wrapper = canSort ? "button" : "div"
                      const isFirstColumn = hasSelect ? idx === 1 : idx === 0

                      // Get header alignment from column metadata
                      const headerAlign =
                        (header.column.columnDef.meta as any)?.___alignMetaData
                          ?.headerAlign || "left"
                      const isRightAligned = headerAlign === "right"
                      const isCenterAligned = headerAlign === "center"

                      return (
                        <Table.HeaderCell
                          key={header.id}
                          className={clx("whitespace-nowrap", {
                            "w-[calc(20px+24px+24px)] min-w-[calc(20px+24px+24px)] max-w-[calc(20px+24px+24px)]":
                              isSelectHeader,
                            "w-[calc(28px+24px+4px)] min-w-[calc(28px+24px+4px)] max-w-[calc(28px+24px+4px)]":
                              isActionHeader,
                            "after:absolute after:inset-y-0 after:right-0 after:h-full after:w-px after:bg-transparent after:content-['']":
                              isFirstColumn,
                            "after:bg-ui-border-base":
                              showStickyBorder && isFirstColumn,
                            "bg-ui-bg-subtle sticky":
                              isFirstColumn || isSelectHeader,
                            "left-0":
                              isSelectHeader || (isFirstColumn && !hasSelect),
                            "left-[calc(20px+24px+24px)]":
                              isFirstColumn && hasSelect,
                          })}
                          style={
                            !isSpecialHeader
                              ? {
                                  width: header.column.columnDef.size,
                                  maxWidth: header.column.columnDef.maxSize,
                                  minWidth: header.column.columnDef.minSize,
                                }
                              : undefined
                          }
                        >
                          <Wrapper
                            type={canSort ? "button" : undefined}
                            onClick={canSort ? sortHandler : undefined}
                            onMouseDown={
                              canSort ? (e) => e.stopPropagation() : undefined
                            }
                            className={clx(
                              "group flex cursor-default items-center gap-2",
                              {
                                "cursor-pointer": canSort,
                                "w-full": isRightAligned || isCenterAligned,
                                "w-fit": !isRightAligned && !isCenterAligned,
                                "justify-end": isRightAligned,
                                "justify-center": isCenterAligned,
                              }
                            )}
                          >
                            {canSort && isRightAligned && (
                              <DataTableSortingIcon direction={sortDirection} />
                            )}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {canSort && !isRightAligned && (
                              <DataTableSortingIcon direction={sortDirection} />
                            )}
                          </Wrapper>
                        </Table.HeaderCell>
                      )
                    })}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body className="border-b-0 border-t-0">
                {instance.getRowModel().rows.map((row) => {
                  return (
                    <Table.Row
                      key={row.id}
                      onMouseEnter={() => (hoveredRowId.current = row.id)}
                      onMouseLeave={() => (hoveredRowId.current = null)}
                      onClick={(e) => instance.onRowClick?.(e, row)}
                      className={clx("group/row last-of-type:border-b-0", {
                        "cursor-pointer": !!instance.onRowClick,
                      })}
                    >
                      {row.getVisibleCells().map((cell, idx) => {
                        const isSelectCell = cell.column.id === "select"
                        const isActionCell = cell.column.id === "action"
                        const isSpecialCell = isSelectCell || isActionCell

                        const isFirstColumn = hasSelect ? idx === 1 : idx === 0

                        return (
                          <Table.Cell
                            key={cell.id}
                            className={clx(
                              "items-stretch truncate whitespace-nowrap",
                              {
                                "w-[calc(20px+24px+24px)] min-w-[calc(20px+24px+24px)] max-w-[calc(20px+24px+24px)]":
                                  isSelectCell,
                                "w-[calc(28px+24px+4px)] min-w-[calc(28px+24px+4px)] max-w-[calc(28px+24px+4px)]":
                                  isActionCell,
                                "bg-ui-bg-base group-hover/row:bg-ui-bg-base-hover transition-fg sticky h-full":
                                  isFirstColumn || isSelectCell,
                                "after:absolute after:inset-y-0 after:right-0 after:h-full after:w-px after:bg-transparent after:content-['']":
                                  isFirstColumn,
                                "after:bg-ui-border-base":
                                  showStickyBorder && isFirstColumn,
                                "left-0":
                                  isSelectCell || (isFirstColumn && !hasSelect),
                                "left-[calc(20px+24px+24px)]":
                                  isFirstColumn && hasSelect,
                              }
                            )}
                            style={
                              !isSpecialCell
                                ? {
                                    width: cell.column.columnDef.size,
                                    maxWidth: cell.column.columnDef.maxSize,
                                    minWidth: cell.column.columnDef.minSize,
                                  }
                                : undefined
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Table.Cell>
                        )
                      })}
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </div>
        ))}
      <DataTableEmptyStateDisplay
        state={instance.emptyState}
        props={props.emptyState}
      />
    </div>
  )
}
DataTableTable.displayName = "DataTable.Table"

interface DataTableEmptyStateDisplayProps {
  state: DataTableEmptyState
  props?: DataTableEmptyStateProps
}

const DefaultEmptyStateContent = ({
  heading,
  description,
}: DataTableEmptyStateContent) => (
  <div className="flex size-full flex-col items-center justify-center gap-2">
    <Text size="base" weight="plus">
      {heading}
    </Text>
    <Text>{description}</Text>
  </div>
)

const DataTableEmptyStateDisplay = ({
  state,
  props,
}: DataTableEmptyStateDisplayProps) => {
  if (state === DataTableEmptyState.POPULATED) {
    return null
  }

  const content =
    state === DataTableEmptyState.EMPTY ? props?.empty : props?.filtered

  return (
    <div className="flex min-h-[250px] w-full flex-1 flex-col items-center justify-center border-y px-6 py-4">
      {content?.custom ?? (
        <DefaultEmptyStateContent
          heading={content?.heading}
          description={content?.description}
        />
      )}
    </div>
  )
}

interface DataTableTableSkeletonProps {
  pageSize?: number
}

const DataTableTableSkeleton = ({
  pageSize = 10,
}: DataTableTableSkeletonProps) => {
  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      <div className="min-h-0 w-full flex-1 overscroll-auto border-y">
        <div className="flex flex-col divide-y">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: pageSize }, (_, i) => i).map((row) => (
            <Skeleton key={row} className="h-12 w-full rounded-none" />
          ))}
        </div>
      </div>
    </div>
  )
}

function getIsEditableElementFocused() {
  const activeElement = !!document ? document.activeElement : null
  const isEditableElementFocused =
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement?.getAttribute("contenteditable") === "true"

  return isEditableElementFocused
}

export { DataTableTable }
export type { DataTableEmptyStateProps, DataTableTableProps }
