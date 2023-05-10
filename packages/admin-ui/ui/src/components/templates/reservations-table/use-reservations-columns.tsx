import { useMemo } from "react"

const useReservationsTableColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "sku",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Order ID",
        accessor: "order_id",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Location",
        accessor: "location",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Created",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => value,
      },
    ],
    []
  )

  return [columns] as const
}

export default useReservationsTableColumns
