import { Vendor } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import moment from "moment"
import React, { useMemo } from "react"
import { useForm, UseFormRegister } from "react-hook-form"
import { Column, usePagination, useTable } from "react-table"
import { VendorFeesForm } from "../../../domain/settings/payouts-fees"
import { useGetVendors } from "../../../hooks/admin/vendors/queries"
import Spinner from "../../atoms/spinner"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import InputField from "../../molecules/input"
import Table from "../../molecules/table"

export const VendorFeesTable: React.FC<{
  isLoading: boolean
  vendors: Vendor[]
  register: UseFormRegister<VendorFeesForm>
}> = ({ vendors, isLoading, register }) => {
  const queryObject = {
    offset: 0,
    limit: 50,
    fields: "id,name",
  }

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
        Header: "Vendor Fee Percentage",
        id: "vendor_fee",
        Cell: ({ row }) => {
          return (
            <Table.Cell width={160}>
              <InputField
                prefix="%"
                type="number"
                placeholder="0"
                step={0.1}
                {...register(`vendors.${row.original.id}.percent_fee`, {
                  valueAsNumber: true,
                })}
                min={0}
              />
            </Table.Cell>
          )
        },
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable<Vendor>(
    {
      columns,
      data: vendors || [],
      manualPagination: true,
      pageCount: 1,
      autoResetPage: false,
    },
    usePagination
  )

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
      <InputField
        prefix="%"
        className="max-w-[220px] mb-8"
        type="number"
        label="Default Vendor Fee Percentage"
        placeholder="0"
        step={0.1}
        {...register(`default_store_percent_fee`, { valueAsNumber: true })}
        min={0}
      />
      <Table {...getTableProps()} className={clsx({ ["relative"]: isLoading })}>
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Table.Row
                color={"inherit"}
                {...row.getRowProps()}
                className="group h-16"
                actions={[]}
              >
                {row.cells.map((cell, index) => {
                  return cell.render("Cell", {
                    index,
                    key: `${cell.row.original.id}_${index}`,
                  })
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}
