import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import { flexRender, Table as Instance } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import LoadingContainer from "../../../../../components/atoms/loading-container"
import Table from "../../../../../components/molecules/table"

type Props = {
  instance: Instance<PricedVariant>
  isLoadingData: boolean
  setSearchTerm: (searchTerm?: string) => void
}

export const AddAdditionalItemsTable = ({
  instance,
  isLoadingData,
  setSearchTerm,
}: Props) => {
  const [query, setQuery] = useState<string | undefined>(undefined)
  const { getHeaderGroups, getRowModel } = instance

  useEffect(() => {
    setSearchTerm(query)
  }, [query, setSearchTerm])

  return (
    <LoadingContainer isLoading={isLoadingData}>
      <Table
        enableSearch
        searchPlaceholder="Search products"
        searchValue={query}
        handleSearch={setQuery}
      >
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </LoadingContainer>
  )
}
