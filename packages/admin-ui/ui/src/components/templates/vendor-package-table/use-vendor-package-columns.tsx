import React, { useMemo } from "react"
import { Column } from "react-table"
import { Package } from "../../../hooks/admin/packages"
import Table from "../../molecules/table"
import {
  carrierOptions,
  packageTypeOptions,
} from "../vendor-package/package-modal"

export const useVendorPackageTableColumns: () => Column<Package>[] = () => {
  const columns = useMemo<Column<Package>[]>(
    () => [
      {
        Header: "Name",
        id: "package_name",
        Cell: ({ row }) => <Table.Cell>{row.original.package_name}</Table.Cell>,
      },
      {
        Header: "Package Type",
        id: "package_type",
        Cell: ({ row }) => (
          <Table.Cell>
            {packageTypeOptions.find(
              (type) => type.value === row.original.package_type
            )?.label ?? "Unknown"}
          </Table.Cell>
        ),
      },
      {
        Header: "Carrier",
        id: "carrier_code",
        Cell: ({ row }) => (
          <Table.Cell>
            {carrierOptions.find(
              (type) => type.value === row.original.carrier_code
            )?.label ?? "None"}
          </Table.Cell>
        ),
      },
      {
        Header: "Length (in)",
        id: "length",
        Cell: ({ row }) => <Table.Cell>{row.original.length}</Table.Cell>,
      },
      {
        Header: "Width (in)",
        id: "Width",
        Cell: ({ row }) => <Table.Cell>{row.original.width}</Table.Cell>,
      },
      {
        Header: "Height (in)",
        id: "height",
        Cell: ({ row }) => (
          <Table.Cell>{row.original.height ?? "Not Specified"}</Table.Cell>
        ),
      },
      {
        Header: "Empty Weight (oz)",
        id: "empty_weight",
        Cell: ({ row }) => (
          <Table.Cell>
            {row.original.empty_weight ?? "Not Specified"}
          </Table.Cell>
        ),
      },
      {
        Header: "Use In Estimates",
        id: "use_in_estimates",
        Cell: ({ row }) => (
          <Table.Cell>
            {row.original.use_in_estimates ? "Yes" : "No"}
          </Table.Cell>
        ),
      },
    ],
    []
  )
  return columns
}
