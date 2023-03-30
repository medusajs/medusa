import moment from "moment"
import { useMemo } from "react"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"

export const useCustomerColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Date added",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: "Name",
        accessor: "customer",
        Cell: ({ row }) => (
          <CustomerAvatarItem customer={row.original} color="bg-grey-80" />
        ),
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "",
        accessor: "col",
      },
      {
        accessor: "orders",
        Header: () => <div className="text-right">Orders</div>,
        Cell: ({ cell: { value } }) => (
          <div className="text-right">{value?.length || 0}</div>
        ),
      },
      {
        Header: "",
        accessor: "col-2",
      },
    ],
    []
  )

  return [columns]
}
