import { Vendor } from "@medusajs/medusa"
import moment from "moment"
import React, { useMemo } from "react"
import { Column } from "react-table"
import Table from "../../molecules/table"

export const useVendorTableColumns: () => Column<Vendor>[] = () => {
  const columns = useMemo<Column<Vendor>[]>(
    () => [
      {
        Header: "Vendor",
        id: "vendor",
        Cell: ({ row }) => {
          return <Table.Cell>{row.original.name}</Table.Cell>
        },
      },
      {
        Header: "Last Updated",
        id: "updated_at",
        Cell: ({ row }) => {
          return (
            <Table.Cell>
              {moment(row.original.updated_at).format("DD MMM YYYY hh:mm a")}
            </Table.Cell>
          )
        },
      },
    ],
    []
  )
  return columns
}
