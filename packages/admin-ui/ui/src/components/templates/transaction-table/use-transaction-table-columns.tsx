import React, { useMemo } from "react"
import { Column } from "react-table"
import Table from "../../molecules/table"
import { BalanceTransaction } from "@medusajs/medusa"
import { formatAmountWithSymbol } from "../../../utils/prices"
import clsx from "clsx"

const formatTransactionType = (type: string) =>
  type
    .split("_")
    .map((word) => word.toLowerCase())
    .map((word, index) =>
      index === 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word
    )
    .join(" ")

const useTransactionTableColumns: (
  balanceId: string
) => Column<BalanceTransaction>[] = (balanceId) =>
  useMemo<Column<BalanceTransaction>[]>(
    () => [
      {
        Header: "Date",
        accessor: "created_at",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="w-[25%]">
            {new Date(value).toLocaleDateString()}
          </Table.Cell>
        ),
      },
      {
        Header: <div className="px-4">Description</div>,
        accessor: "description",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="w-[25%]">
            <div className="px-4">{value}</div>
          </Table.Cell>
        ),
      },
      {
        Header: <div className="px-4">Type</div>,
        accessor: "type",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="w-[25%]">
            <div className="px-4 text-grey-50">
              {formatTransactionType(value)}
            </div>
          </Table.Cell>
        ),
      },
      {
        Header: <div className="px-4">Status</div>,
        accessor: "status",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="w-[25%]">
            <div className="px-4 text-grey-50">{value}</div>
          </Table.Cell>
        ),
      },
      {
        Header: <div className="text-right">Amount</div>,
        accessor: "amount",
        Cell: ({ cell: { value }, row: { index, original } }) => (
          <Table.Cell
            key={index}
            className={clsx(
              { "text-red-400": original.to_balance_id !== balanceId },
              "w-[25%] text-right"
            )}
          >
            {original.to_balance_id === balanceId
              ? formatAmountWithSymbol({
                  amount: value,
                  currency: "USD",
                })
              : `(${formatAmountWithSymbol({
                  amount: value,
                  currency: "USD",
                })})`}
          </Table.Cell>
        ),
      },
      {
        Header: "",
        id: "settings-col",
      },
    ],
    []
  )

export default useTransactionTableColumns
