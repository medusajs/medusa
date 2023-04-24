import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from "../../molecules/order-status"
import moment from "moment"
import React, { useMemo } from "react"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import Table from "../../molecules/table"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import { getColor } from "../../../utils/color"
import { isoAlpha2Countries } from "../../../utils/countries"
import ReactCountryFlag from "react-country-flag"

const useOrderTableColumns = (isVendorView: boolean) => {
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">ID</div>,
        accessor: "display_id",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 min-w-[50px] pl-2"
          >{`#${
            row.original?.children?.length > 1
              ? value
              : row.original?.children[0]?.display_id ?? value
          }`}</Table.Cell>
        ),
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <div>
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </div>
        ),
      },
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => (
          <div>
            <CustomerAvatarItem
              customer={{
                first_name:
                  value?.first_name ||
                  row.original.shipping_address?.first_name,
                last_name:
                  value?.last_name || row.original.shipping_address?.last_name,
                email: row.original.email,
              }}
              color={getColor(row.index)}
            />
          </div>
        ),
      },
      {
        Header: <Table.HeadCell className="pl-1.5">Status</Table.HeadCell>,
        accessor: "status",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="min-w-[120px] pl-2">
            {<OrderStatus className="h-10" orderStatus={value} />}
          </Table.Cell>
        ),
      },
      {
        Header: <Table.HeadCell className="pl-1.5">Fulfillment</Table.HeadCell>,
        accessor: "fulfillment_status",
        Cell: ({ cell: { value }, index }) => (
          <FulfillmentStatus className="h-10" fulfillmentStatus={value} />
        ),
      },
      {
        Header: <Table.HeadCell className="pl-1.5">Payment</Table.HeadCell>,
        accessor: "payment_status",
        Cell: ({ cell: { value }, index }) => (
          <PaymentStatus className="h-10" paymentStatus={value} />
        ),
      },

      {
        Header: "Vendors",
        accessor: "vendor",
        Cell: ({ row, cell: { value }, index }) => (
          <>
            {value?.name ??
              (row.original?.children?.length > 1
                ? "Multiple"
                : row.original?.children[0]?.vendor?.name)}
          </>
        ),
      },
      {
        Header: () => <div className="text-right">Total</div>,
        accessor: "total",
        Cell: ({ row, cell: { value }, index }) => (
          <div className="min-w-[80px] text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </div>
        ),
      },
      {
        Header: "",
        accessor: "country_code",
        Cell: ({ row }) => (
          <div className="pr-2">
            <div className="flex rounded-rounded w-full justify-end">
              <Tooltip
                content={
                  isoAlpha2Countries[
                    row.original.shipping_address?.country_code?.toUpperCase()
                  ] ||
                  row.original.shipping_address?.country_code?.toUpperCase()
                }
              >
                <ReactCountryFlag
                  className={"rounded"}
                  svg
                  countryCode={row.original.shipping_address?.country_code}
                />
              </Tooltip>
            </div>
          </div>
        ),
      },
    ],
    []
  )

  if (isVendorView) {
    const vendorColumnIndex = columns.findIndex((c) => c.Header === "Vendors")
    columns.splice(vendorColumnIndex, 1)
  }

  return [columns]
}

export default useOrderTableColumns
