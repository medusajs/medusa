import Table from "../components/molecules/table"
import React from "react"
export const tableColumn = (columnName, accessor, cellStyle = null) => {
  if (!accessor) return

  return {
    Header: <Table.HeadCell className="pl-2">{columnName}</Table.HeadCell>,
    accessor: accessor ?? "name",
    Cell: ({ cell: { value }, index }) => (
      <Table.Cell
        key={index}
        className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2"
      >{`${value}`}</Table.Cell>
    ),
  }
}
