import { flexRender, Table as Instance } from "@tanstack/react-table"
import Table from "../../../../components/molecules/table"
import { ReceiveReturnObject } from "./items-to-receive-form"

type Props = {
  instance: Instance<ReceiveReturnObject>
}

export const ItemsToReceiveTable = ({ instance }: Props) => {
  const { getRowModel, getHeaderGroups } = instance

  return (
    <Table>
      <Table.Head>
        {getHeaderGroups().map((headerGroup) => {
          return (
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
          )
        })}
      </Table.Head>
      <Table.Body>
        {getRowModel().rows.map((row) => {
          return (
            <Table.Row key={row.id} className="last-of-type:border-b-0">
              {row.getVisibleCells().map((cell) => {
                return (
                  <Table.Cell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
