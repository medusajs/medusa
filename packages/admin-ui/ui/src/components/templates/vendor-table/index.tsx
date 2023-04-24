import { Vendor } from "@medusajs/medusa"
import clsx from "clsx"
import React from "react"
import { usePagination, useTable } from "react-table"
import { useGetVendors } from "../../../hooks/admin/vendors/queries"
import Spinner from "../../atoms/spinner"
import { useAdminStore } from "medusa-react"
import Table from "../../molecules/table"

import { useVendorTableColumns } from "./use-vendor-columns"

const VendorTable: React.FC<{
  openArchiveModal: (vendor: Vendor) => void
}> = ({ openArchiveModal }) => {
  const queryObject = {
    offset: 0,
    limit: 50,
    fields: "id,name",
  }

  const { vendors, isLoading } = useGetVendors(queryObject)
  const { store } = useAdminStore()
  const primaryVendorId = store?.primary_vendor_id

  const columns = useVendorTableColumns()

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
        {isLoading || !vendors ? (
          <div className="flex w-full h-full absolute items-center justify-center mt-10">
            <div className="">
              <Spinner size={"large"} variant={"secondary"} />
            </div>
          </div>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Table.Row
                  color={"inherit"}
                  linkTo={`/vendor/${row.original.id}/settings`}
                  {...row.getRowProps()}
                  className="group"
                  actions={
                    row.original.id !== primaryVendorId
                      ? [
                          {
                            label: "Archive",
                            onClick: () => openArchiveModal(row.original),
                            icon: <></>,
                          },
                        ]
                      : []
                  }
                >
                  {row.cells.map((cell, index) => {
                    return cell.render("Cell", { index })
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        )}
      </Table>
    </div>
  )
}

export default VendorTable
