import { CustomerGroup } from "@medusajs/medusa"
import { useMemo } from "react"
import { Column, HeaderGroup, Row } from "react-table"
import { useTranslation } from "react-i18next"
import SortingIcon from "../../../../../../components/fundamentals/icons/sorting-icon"
import Table from "../../../../../../components/molecules/table"

export const CustomerGroupsHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<CustomerGroup>
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

export const CustomerGroupsRow = ({ row }: { row: Row<CustomerGroup> }) => {
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

export const useGroupColumns = () => {
  const { t } = useTranslation()
  const columns = useMemo<Column<CustomerGroup>[]>(() => {
    return [
      {
        Header: () => (
          <div className="flex min-w-[540px] items-center gap-1">
            {t("shared-title", "Title")} <SortingIcon size={16} />
          </div>
        ),
        accessor: "name",
      },
      {
        Header: () => (
          <div className="flex items-center justify-end gap-1">
            {t("shared-members", "Members")} <SortingIcon size={16} />
          </div>
        ),
        id: "members",
        accessor: (r) => r.customers?.length,
        Cell: ({ cell: { value } }) => {
          return <div className="text-end">{value}</div>
        },
      },
    ]
  }, [])

  return columns
}
