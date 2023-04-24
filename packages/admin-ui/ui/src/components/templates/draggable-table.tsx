import update from "immutability-helper"
import { debounce } from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useTable } from "react-table"
import Button from "../fundamentals/button"
import GripIcon from "../fundamentals/icons/grip-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import Table from "../molecules/table"

type DraggableTableProps = {
  entities: any[]
  setEntities: (entities: any[]) => void
  onDelete?: (any) => void
  columns: any[]
}

const DraggableTable: React.FC<DraggableTableProps> = ({
  entities,
  setEntities,
  onDelete,
  columns,
}) => {
  const [records, setRecords] = useState(entities)
  useEffect(() => {
    setRecords(entities)
  }, [entities])

  useEffect(() => setEntities(records), [records])

  const DND_ITEM_TYPE = "row"

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    })

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex]
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    )
    setEntities(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    )
  }

  const debouncedMoveRow = useMemo(() => debounce(moveRow, 100), [])

  useEffect(() => {
    return () => {
      debouncedMoveRow.cancel()
    }
  }, [])

  const Row = ({ row, index, moveRow }) => {
    const dropRef = useRef(null)
    const dragRef = useRef(null)

    const [_, drop] = useDrop(() => ({
      accept: DND_ITEM_TYPE,
      hover: (item, monitor) => {
        if (!dropRef.current) {
          return
        }

        const dragIndex = item.index
        const hoverIndex = index
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return
        }

        // return // TODO: fix hover/drop action
        // if (latestMoved?.from === dragIndex && latestMoved?.to === hoverIndex) {
        //   return
        // }
        // Determine rectangle on screen
        const hoverBoundingRect = dropRef.current.getBoundingClientRect()
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        // Determine mouse position
        const clientOffset = monitor.getClientOffset()
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }

        // Time to actually perform the action

        // setLatestMoved({ from: dragIndex, to: hoverIndex })
        moveRow(dragIndex, hoverIndex)
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
      },
    }))

    const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: "row",
      item: { index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }))

    const opacity = isDragging ? 0 : 1

    preview(drop(dropRef))
    drag(dragRef)

    return (
      <Table.Row ref={dropRef} style={{ opacity }}>
        <Table.Cell className="medium:w-[72px] small:w-auto">
          <Button
            ref={dragRef}
            variant="ghost"
            size="small"
            className="h-6 w-6 cursor-grab active:cursor-grabbing text-grey-40 mx-6"
          >
            <GripIcon size={20} />
          </Button>
        </Table.Cell>
        {row.cells.map((cell) => {
          return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
        })}
        {onDelete && (
          <Table.Cell className="text-right">
            <Button
              onClick={() => onDelete(row.original)}
              variant="ghost"
              size="small"
              className="inline-block p-1 text-grey-40 cursor-pointer mx-6"
            >
              <TrashIcon size={20} />
            </Button>
          </Table.Cell>
        )}
      </Table.Row>
    )
  }

  return (
    <div className="w-full h-full">
      <DndProvider backend={HTML5Backend}>
        <Table {...getTableProps()}>
          <Table.Head>
            {headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                <Table.HeadCell> </Table.HeadCell>
                {headerGroup.headers.map((col) => (
                  <Table.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>
          <Table.Body {...getTableBodyProps()}>
            {rows.map(
              (row, index) =>
                prepareRow(row) || (
                  <Row
                    index={index}
                    row={row}
                    moveRow={moveRow}
                    {...row.getRowProps()}
                  />
                )
            )}
          </Table.Body>
        </Table>
      </DndProvider>
    </div>
  )
}

export default DraggableTable
