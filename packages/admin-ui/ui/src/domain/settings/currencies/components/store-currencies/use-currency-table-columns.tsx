import { Currency } from "@medusajs/medusa"
import { useMemo } from "react"
import { Column } from "react-table"
import SortingIcon from "../../../../../components/fundamentals/icons/sorting-icon"
import IndeterminateCheckbox from "../../../../../components/molecules/indeterminate-checkbox"

export const useCurrencyColumns = (): Column<Currency>[] => {
  const columns: Column<Currency>[] = useMemo(() => {
    return [
      {
        id: "selection",
        className: "w-[52px] px-base",
        disableSortBy: true,
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <span className="flex justify-center">
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
          </span>
        ),
        Cell: ({ row }) => {
          return (
            <span
              onClick={(e) => e.stopPropagation()}
              className="flex justify-center"
            >
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </span>
          )
        },
      },
      {
        Header: ({ column: { isSorted, isSortedDesc } }) => (
          <div className="gap-x-2xsmall flex items-center">
            <span>Name</span>
            <SortingIcon
              className="text-grey-40"
              ascendingColor={isSorted && !isSortedDesc ? "#111827" : undefined}
              descendingColor={isSortedDesc ? "#111827" : undefined}
              size={16}
            />
          </div>
        ),
        accessor: "name",
        Cell: ({ row, value }) => {
          return (
            <div className="gap-x-xsmall inter-small-regular flex items-center">
              <span className="inter-small-semibold">
                {row.original.code.toUpperCase()}
              </span>
              <p>{value}</p>
            </div>
          )
        },
      },
    ]
  }, [])

  return columns
}
