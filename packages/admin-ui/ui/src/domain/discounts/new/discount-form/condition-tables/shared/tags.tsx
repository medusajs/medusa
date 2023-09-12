import { ProductTag } from "@medusajs/medusa"
import { Column, HeaderGroup, Row } from "react-table"
import { Translation } from "react-i18next"
import SortingIcon from "../../../../../../components/fundamentals/icons/sorting-icon"
import Table from "../../../../../../components/molecules/table"

export const TagColumns: Column<ProductTag>[] = [
  {
    Header: () => (
      <div className="flex items-center gap-1">
        <Translation>
          {(t) => (
            <>
              {t("shared-tag", "Tag")} <SortingIcon size={16} />
            </>
          )}
        </Translation>
      </div>
    ),
    accessor: "value",
    Cell: ({ row: { original } }) => {
      return (
        <div className="w-[220px]">
          <span className="bg-grey-10 rounded-rounded px-2 py-0.5">
            #{original.value}
          </span>
        </div>
      )
    },
  },
]

export const TagHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<ProductTag>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell
          {...col.getHeaderProps(col.getSortByToggleProps())}
          className="w-[20px]"
        >
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

export const TagRow = ({ row }: { row: Row<ProductTag> }) => {
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
