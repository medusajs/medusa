import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import { Column, HeaderGroup, Row } from "react-table"
import { Translation } from "react-i18next"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import Table from "../../molecules/table"
import { decideStatus } from "../collection-product-table/utils"

export const columns: Column<Product>[] = [
  {
    Header: (
      <div className="ps-4">
        <Translation>
          {(t) => t("add-products-modal-product-details", "Product Details")}
        </Translation>
      </div>
    ),
    accessor: "title",
    Cell: ({ row: { original } }) => (
      <div className="flex w-[400px] items-center ps-4">
        <div className="my-1.5 me-4 flex h-[40px] w-[30px] items-center">
          {original.thumbnail ? (
            <img
              src={original.thumbnail}
              className="rounded-soft h-full object-cover"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex flex-col">
          <span>
            {original.title}{" "}
            {original.subtitle && (
              <span className="text-grey-50">({original.subtitle})</span>
            )}
          </span>
        </div>
      </div>
    ),
  },
  {
    Header: (
      <div>
        <Translation>
          {(t) => t("add-products-modal-status", "Status")}
        </Translation>
      </div>
    ),
    accessor: "status",
    Cell: ({ cell: { value } }) => (
      <Table.Cell className="pe-base w-[10%]">
        <div className="flex items-center">{decideStatus(value)}</div>
      </Table.Cell>
    ),
  },
  {
    Header: (
      <div className="flex items-center justify-end pe-4">
        <Translation>
          {(t) => t("add-products-modal-variants", "Variants")}
        </Translation>
      </div>
    ),
    accessor: "variants",
    Cell: ({ row: { original } }) => (
      <Table.Cell className="flex items-center justify-end pe-4">
        {original.variants.length}
      </Table.Cell>
    ),
  },
]

export const ProductRow = ({ row }: { row: Row<Product> }) => {
  const { isSelected } = row
  return (
    <Table.Row
      {...row.getRowProps()}
      className={clsx({ "bg-grey-5": isSelected })}
    >
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

export const ProductHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<Product>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell {...col.getHeaderProps(col.getSortByToggleProps())}>
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}
