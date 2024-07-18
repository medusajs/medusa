import { useMemo } from "react"
import { Column } from "react-table"
import Table from "../../molecules/table"
import { decideStatus, SimpleProductType } from "./utils"

const useCollectionProductColumns = () => {
  const columns: Column<SimpleProductType>[] = useMemo(
    () => [
      {
        accessor: "thumbnail",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="w-[5%]">
            <div className="bg-grey-5 rounded-soft my-xsmall h-[40px] w-[30px] overflow-hidden">
              {value ? (
                <img
                  src={value}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          </Table.Cell>
        ),
      },
      {
        accessor: "title",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="w-3/6">{value}</Table.Cell>
        ),
      },
      {
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="pe-base w-[10%]">
            <div className="flex items-center justify-end">
              {decideStatus(value)}
            </div>
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return columns
}

export default useCollectionProductColumns
