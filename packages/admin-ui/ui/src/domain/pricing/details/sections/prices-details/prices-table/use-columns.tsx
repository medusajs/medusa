import { Product } from "@medusajs/medusa"
import * as React from "react"
import { Column } from "react-table"
import ImagePlaceholder from "../../../../../../components/fundamentals/image-placeholder"
import Table from "../../../../../../components/molecules/table"

const usePricesColumns = () => {
  const columns = React.useMemo<Column<Product>[]>(
    () => [
      {
        Header: <div className="pl-4">Name</div>,
        accessor: "title",
        Cell: ({ row: { original } }) => (
          <div className="pl-4 flex items-center">
            <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
              {original.thumbnail ? (
                <img
                  src={original.thumbnail}
                  className="h-full object-cover rounded-soft"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="flex flex-col">
              <span>{original.title}</span>
            </div>
          </div>
        ),
      },
      {
        Header: <div className="w-[400px]">Collection</div>,
        accessor: "collection",
        Cell: ({ cell: { value } }) => (
          <Table.Cell>
            {value?.title ? (
              value.title
            ) : (
              <span className="text-grey-40">No collection</span>
            )}
          </Table.Cell>
        ),
      },
      {
        Header: "Variants",
        Cell: ({ row: { original } }) => (
          <Table.Cell>{original.variants.length}</Table.Cell>
        ),
      },
    ],
    []
  )

  return columns
}
export default usePricesColumns
