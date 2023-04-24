import { Order } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminOrders } from "medusa-react"
import React from "react"
import { usePagination, useTable } from "react-table"
import Spinner from "../../../../components/atoms/spinner"
import Table from "../../../../components/molecules/table"
import { useSubOrderTableColumns } from "./use-sub-order-column"

const SubOrderTable: React.FC<{ orderParentId }> = ({ orderParentId }) => {
  const queryObject = {
    offset: 0,
    limit: 50,
    expand: "shipping_address,vendor",
    fields:
      "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
  }
  const { orders, isLoading } = useAdminOrders({
    ...queryObject,
    order_parent_id: orderParentId,
  })

  const columns = useSubOrderTableColumns()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Order>(
    {
      columns,
      data: orders || [],
      manualPagination: true,
      pageCount: 1,
      autoResetPage: false,
    },
    usePagination
  )

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-0 h-full ">
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
        {isLoading || !orders ? (
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
                  linkTo={
                    row?.original?.vendor
                      ? `/vendor/${row?.original?.vendor.id}/orders/${row.original.id}`
                      : undefined
                  }
                  {...row.getRowProps()}
                  className="group"
                  actions={[]}
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

export default SubOrderTable
