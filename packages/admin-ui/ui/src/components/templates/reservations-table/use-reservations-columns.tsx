import moment from "moment"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const useReservationsTableColumns = () => {
  const { t } = useTranslation()
  const columns = useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "inventory_item.sku",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: t("reservations-table-order-id", "Order ID"),
        accessor: "line_item.order.display_id",
        Cell: ({ cell: { value } }) => value ?? "-",
      },
      {
        Header: t("reservations-table-description", "Description"),
        accessor: "description",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: t("reservations-table-created", "Created"),
        accessor: "created_at",
        Cell: ({ cell: { value } }) => moment(value).format("MMM Do YYYY"),
      },
      {
        Header: () => (
          <div className="pe-2 text-end">
            {t("reservations-table-quantity", "Quantity")}
          </div>
        ),
        accessor: "quantity",
        Cell: ({ cell: { value } }) => (
          <div className="w-full pe-2 text-end">{value}</div>
        ),
      },
    ],
    []
  )

  return [columns] as const
}

export default useReservationsTableColumns
