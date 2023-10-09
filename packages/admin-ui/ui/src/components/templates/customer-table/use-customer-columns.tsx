import moment from "moment"
import { useMemo } from "react"
import { getColor } from "../../../utils/color"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import ReactCountryFlag from "react-country-flag"

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
          <CustomerAvatarItem
            customer={row.original}
            color={getColor(row.index)}
          />
        ),
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Company",
        accessor: "metadata.company",
      },
      {
        accessor: "groups",
        Header: () => <div>Groups</div>,
        Cell: ({ cell: { value } }) => (
          <div className="flex flex-col gap-y-2">{value?.map(v=><div>{v.name}</div>) || ''}</div>
        ),
      },
      {
        accessor: "orders",
        Header: () => <div className="text-right">Orders</div>,
        Cell: ({ cell: { value } }) => (
          <div className="text-right">{value?.length || 0}</div>
        ),
      },
      {
        Header: <div className="text-right">Country</div>,
        accessor: "billing_address",
        Cell: ({ cell: { value } }) => (
            <div className="rounded-rounded flex w-full justify-end">
                <ReactCountryFlag
                  className={"rounded"}
                  svg
                  countryCode={value?.country_code}
                />
            </div>
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
