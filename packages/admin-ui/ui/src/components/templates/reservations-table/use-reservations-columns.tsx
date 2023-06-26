import moment from "moment"
import { useMemo } from "react"

const useReservationsTableColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "inventory_item.sku",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Order ID",
        accessor: "line_item.order.display_id",
        Cell: ({ cell: { value } }) => value ?? "-",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Created",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => moment(value).format("MMM Do YYYY"),
      },
      {
        Header: () => <div className="pr-2 text-right">Quantity</div>,
        accessor: "quantity",
        Cell: ({ cell: { value } }) => (
          <div className="w-full pr-2 text-right">{value}</div>
        ),
      },
    ],
    []
  )

  return [columns] as const
}

export default useReservationsTableColumns
