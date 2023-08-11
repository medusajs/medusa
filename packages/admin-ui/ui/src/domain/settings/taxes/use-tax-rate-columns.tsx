import { useMemo } from "react"
import { Column } from "react-table"
import Badge from "../../../components/fundamentals/badge"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import { TaxRateTableEntries } from "./details"

const useTaxRateColumns = () => {
  const columns: Column<TaxRateTableEntries>[] = useMemo(
    () => [
      {
        Header: <div className="pl-2">Name</div>,
        accessor: "name",
        Cell: ({ row, cell: { value } }) => {
          return (
            <div className="text-grey-90 group-hover:text-violet-60 pl-2">
              {row.original.type === "region" ? (
                <div className="gap-x-xsmall text-grey-40 flex items-center">
                  <LockIcon size={"12"} /> {value}
                </div>
              ) : (
                value
              )}
            </div>
          )
        },
      },
      {
        Header: "Code",
        accessor: "code",
        Cell: ({ cell: { value } }) => (
          <div>
            <Badge variant="default">{value}</Badge>
          </div>
        ),
      },
      {
        Header: "Tax Rate",
        accessor: "rate",
        Cell: ({ cell: { value } }) => <div>{value} %</div>,
      },
    ],
    []
  )

  return [columns]
}

export default useTaxRateColumns
