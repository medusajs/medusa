import { Customer, CustomerGroup } from "@medusajs/medusa"
import { Column } from "react-table"

import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import { getColor } from "../../../utils/color"
import SortingIcon from "../../fundamentals/icons/sorting-icon"
import CustomersGroupsSummary from "../../molecules/customers-groups-summary"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import Table from "../../molecules/table"
import moment from "moment"
import ReactCountryFlag from "react-country-flag"

export const CUSTOMER_GROUPS_TABLE_COLUMNS: Column<CustomerGroup>[] = [
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Title <SortingIcon size={16} />
      </div>
    ),
    accessor: "name",
  },
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Members <SortingIcon size={16} />
      </div>
    ),
    id: "members",
    accessor: (r) => r.customers?.length,
  },
]

export const CUSTOMER_GROUPS_CUSTOMERS_TABLE_COLUMNS: Column<Customer>[] = [
  {
    id: "selection",
    Header: ({ getToggleAllPageRowsSelectedProps }) => (
      <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
    ),
    Cell: ({ row }) => {
      return (
        <Table.Cell onClick={(e) => e.stopPropagation()} className="w-[100px]">
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </Table.Cell>
      )
    },
  },
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Name <SortingIcon size={16} />
      </div>
    ),
    id: "avatar",
    Cell: ({ row }) => (
      <CustomerAvatarItem customer={row.original} color={getColor(row.index)} />
    ),
  },
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Email <SortingIcon size={16} />
      </div>
    ),
    accessor: "email",
  },
  {
    accessor: "groups",
    Header: () => <div className="text-left">Segments</div>,
    Cell: ({ cell: { value } }) => <CustomersGroupsSummary groups={value} />,
  },
]

export const CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS: Column<Customer|any>[] =
  [
    {
      Header: "Date added",
      accessor: "created_at", // accessor is the "key" in the data
      Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
    },
    {
      Header: () => (
        <div className="flex items-center gap-1">
          Name <SortingIcon size={16} />
        </div>
      ),
      id: "avatar",
      Cell: ({ row }) => (
        <CustomerAvatarItem
          customer={row.original}
          color={getColor(row.index)}
        />
      ),
    },
    {
      Header: () => (
        <div className="flex items-center gap-1">
          Email <SortingIcon size={16} />
        </div>
      ),
      accessor: "email",
    },
    {
      accessor: "metadata.company",
      Header: "Company",
      Cell: ({ cell: { value } }) => <>{value}</>,
    },
    {
      Header: <div>Country</div>,
      accessor: "billing_address",
      Cell: ({ cell: { value } }) => (
          <div className="mr-4">
            <div className="flex flex-row justify-start items-center gap-1">
              {value?.country_code ?
                <ReactCountryFlag
                  className={"rounded"}
                  svg
                  countryCode={value?.country_code as string}
                />
                :
                ""
              }
              {value?.province ? <div>{value.province}</div> : ""}
              {value?.city ? <div>{value.city}</div> : ""}
            </div>
          </div>
      ),
    },
    {
      accessor: "metadata.description",
      Header: "Description",
      Cell: ({ cell: { value } }) => <div className="max-w-[400px] truncate">{value}</div>,
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
      id: "settings-col",
    },
  ]
