import React, { useMemo } from "react"
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from "../../../../components/molecules/order-status"
import Table from "../../../../components/molecules/table"
import { formatAmountWithSymbol } from "../../../../utils/prices"

export const useSubOrderTableColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Vendor",
        accessor: "vendor",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>{value?.name}</Table.Cell>
        ),
      },

      {
        Header: <Table.HeadCell className="pl-2">Status</Table.HeadCell>,
        accessor: "status",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="min-w-[100px] pl-2">
            {<OrderStatus className="h-10" orderStatus={value} />}
          </Table.Cell>
        ),
      },
      {
        Header: "Fulfillment",
        accessor: "fulfillment_status",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="min-w-[120px] pl-2">
            <FulfillmentStatus className="h-10" fulfillmentStatus={value} />
          </Table.Cell>
        ),
      },
      {
        Header: "Payment",
        accessor: "payment_status",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="min-w-[80px] pl-2">
            <PaymentStatus className="h-10" paymentStatus={value} />
          </Table.Cell>
        ),
      },
      {
        Header: () => <div className="text-right">Total</div>,
        accessor: "total",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            <div className="text-right">
              {formatAmountWithSymbol({
                amount: value,
                currency: row.original.currency_code,
                digits: 2,
              })}
            </div>
          </Table.Cell>
        ),
      },
      {
        Header: "",
        accessor: "currency_code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="w-[5%]">
            <div className="text-right text-grey-40">{value.toUpperCase()}</div>
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return columns
}
