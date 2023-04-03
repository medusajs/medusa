import { ProductVariant } from "@medusajs/medusa"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Table from "../../molecules/table"
import { useDenominationColumns } from "./use-denominations-columns"

type DenominationsTableProps = {
  denominations: ProductVariant[]
}

const DenominationsTable = ({ denominations }: DenominationsTableProps) => {
  const columns = useDenominationColumns()

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: denominations,
    getCoreRowModel: getCoreRowModel(),
  })

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

export default DenominationsTable
