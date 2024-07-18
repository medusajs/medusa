import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Column } from "react-table"
import Table from "../../molecules/table"
import { decideStatus, SimpleProductType } from "./utils"

const useViewProductColumns = () => {
  const columns: Column<SimpleProductType>[] = useMemo(
    () => [
      {
        id: "selection",
        Cell: ({ row }) => {
          return (
            <Table.Cell className="ps-base pe-large w-[0%]">
              <div>{row.index + 1}</div>
            </Table.Cell>
          )
        },
      },
      {
        accessor: "thumbnail",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="pe-base w-[0%]">
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
        Cell: ({ cell: { row, value } }) => (
          <Table.Cell className="w-[20%]">
            <Link to={`/a/products/${row.original.id}`}>{value}</Link>
          </Table.Cell>
        ),
      },
      {
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <Table.Cell className="w-[50%] justify-start">
            {decideStatus(value)}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return columns
}

export default useViewProductColumns
