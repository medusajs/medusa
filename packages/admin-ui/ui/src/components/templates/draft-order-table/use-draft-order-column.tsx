import moment from "moment"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "../../../utils/color"
import StatusDot from "../../fundamentals/status-indicator"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import Table from "../../molecules/table"

const useDraftOrderTableColumns = () => {
  const { t } = useTranslation()
  const decideStatus = (status) => {
    switch (status) {
      case "completed":
        return (
          <StatusDot
            variant="success"
            title={t("draft-order-table-completed", "Completed")}
          />
        )
      default:
        return (
          <StatusDot
            variant="primary"
            title={t("draft-order-table-open", "Open")}
          />
        )
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: t("draft-order-table-draft", "Draft"),
        accessor: "display_id",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell
            {...getCellProps()}
            className="pl-2"
          >{`#${value}`}</Table.Cell>
        ),
      },
      {
        Header: t("draft-order-table-order", "Order"),
        accessor: "order",
        Cell: ({ cell: { value, getCellProps } }) => {
          return (
            <Table.Cell {...getCellProps()}>
              {value?.display_id ? `#${value?.display_id}` : "-"}
            </Table.Cell>
          )
        },
      },
      {
        Header: t("draft-order-table-date-added", "Date added"),
        accessor: "created_at",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell {...getCellProps()}>
            {moment(value).format("DD MMM YYYY")}
          </Table.Cell>
        ),
      },
      {
        Header: t("draft-order-table-customer", "Customer"),
        accessor: "cart",
        Cell: ({ row, cell: { value, getCellProps } }) => (
          <Table.Cell {...getCellProps()}>
            <CustomerAvatarItem
              customer={{
                first_name: value?.first_name || "",
                last_name: value?.last_name || "",
                email: value.email,
              }}
              color={getColor(row.index)}
            />
          </Table.Cell>
        ),
      },
      {
        Header: t("draft-order-table-status", "Status"),
        accessor: "status",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell {...getCellProps()} className="pr-2">
            {decideStatus(value)}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useDraftOrderTableColumns
