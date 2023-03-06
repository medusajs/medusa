import { flexRender, Table as Instance } from "@tanstack/react-table"
import clsx from "clsx"
import { Fragment } from "react"
import { ItemsToReturnFormType, ReturnItemObject } from "."
import Table from "../../../../components/molecules/table"
import { NestedForm } from "../../../../utils/nested-form"
import AddReturnReason from "./add-return-reason"

type Props = {
  instance: Instance<ReturnItemObject>
  form: NestedForm<ItemsToReturnFormType>
  isClaim?: boolean
}

export const ItemsToReturnTable = ({ instance, form, isClaim }: Props) => {
  const { getRowModel, getHeaderGroups } = instance

  return (
    <Table>
      <Table.Head>
        {getHeaderGroups().map((headerGroup) => (
          <Table.HeadRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Table.HeadCell
                  key={header.id}
                  className="inter-small-semibold text-grey-50"
                  style={{
                    width: header.getSize(),
                    maxWidth: header.getSize(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Table.HeadCell>
              )
            })}
          </Table.HeadRow>
        ))}
      </Table.Head>
      <Table.Body>
        {getRowModel().rows.map((row) => {
          return (
            <Fragment key={row.id}>
              <Table.Row
                className={clsx("last-of-type:border-b-0", {
                  "border-b-0": row.getIsExpanded(),
                })}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Table.Cell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
              {row.getIsExpanded() && (
                <Table.Row
                  className={clsx("border-t-0", {
                    "border-b-0": row.index === getRowModel().rows.length - 1,
                  })}
                >
                  <Table.Cell colSpan={row.getVisibleCells().length}>
                    <AddReturnReason row={row} form={form} isClaim={isClaim} />
                  </Table.Cell>
                </Table.Row>
              )}
            </Fragment>
          )
        })}
      </Table.Body>
    </Table>
  )
}
