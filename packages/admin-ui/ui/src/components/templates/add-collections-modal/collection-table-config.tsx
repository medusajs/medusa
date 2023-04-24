import { ProductCollection } from "@medusajs/medusa"
import { Column, HeaderGroup, Row } from "react-table"
import clsx from "clsx"
import Table from "../../molecules/table"

export const columns: Column<ProductCollection>[] = [
  {
    Header: "Title",
    accessor: "title",
    Cell: ({ row: { original } }) => {
      return <div className="flex items-center">{original.title}</div>
    },
  },
  {
    Header: "Products",
    accessor: "products",
    Cell: ({ cell: { value } }) => {
      return <div>{value?.length || "-"}</div>
    },
  },
]

export const ProductCollectionRow = ({
  row,
}: {
  row: Row<ProductCollection>
}) => (
  <Table.Row
    {...row.getRowProps()}
    className={clsx({ "bg-grey-5": row.isSelected })}
  >
    {row.cells.map((cell) => (
      <Table.Cell {...cell.getCellProps()}>{cell.render("Cell")}</Table.Cell>
    ))}
  </Table.Row>
)

export const ProductCollectionHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<ProductCollection>
}) => (
  <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
    {headerGroup.headers.map((col, index) => (
      <Table.HeadCell
        {...col.getHeaderProps(col.getSortByToggleProps())}
        className={index === 0 ? "w-6" : "w-[45%]"}
      >
        {col.render("Header")}
      </Table.HeadCell>
    ))}
  </Table.HeadRow>
)
