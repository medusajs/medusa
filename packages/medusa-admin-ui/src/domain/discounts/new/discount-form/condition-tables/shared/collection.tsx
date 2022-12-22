import { ProductCollection } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Column, HeaderGroup, Row } from "react-table"
import SortingIcon from "../../../../../../components/fundamentals/icons/sorting-icon"
import Table from "../../../../../../components/molecules/table"

export const CollectionRow = ({ row }: { row: Row<ProductCollection> }) => {
  return (
    <Table.Row {...row.getRowProps()}>
      {row.cells.map((cell) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell")}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export const CollectionsHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<ProductCollection>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell
          className="w-[100px]"
          {...col.getHeaderProps(col.getSortByToggleProps())}
        >
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

export const useCollectionColumns = () => {
  const columns = useMemo<Column<ProductCollection>[]>(() => {
    return [
      {
        Header: () => (
          <div className="flex items-center gap-1 min-w-[546px]">
            Title <SortingIcon size={16} />
          </div>
        ),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return <span>{original.title}</span>
        },
      },
      {
        Header: () => (
          <div className="flex justify-end items-center gap-1">
            Products <SortingIcon size={16} />
          </div>
        ),
        id: "products",
        accessor: (row) => row?.products?.length,
        Cell: ({ cell: { value } }) => {
          return <div className="text-right">{value}</div>
        },
      },
    ]
  }, [])

  return columns
}
