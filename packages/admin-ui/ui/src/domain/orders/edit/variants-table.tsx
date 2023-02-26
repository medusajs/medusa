import { useAdminVariants } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import { ProductVariant } from "@medusajs/medusa"
import clsx from "clsx"

import { useDebounce } from "../../../hooks/use-debounce"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import Table from "../../../components/molecules/table"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { formatAmountWithSymbol } from "../../../utils/prices"
import TableContainer from "../../../components/organisms/table-container"

const PAGE_SIZE = 12

type Props = {
  isReplace?: boolean
  regionId: string
  customerId: string
  currencyCode: string
  setSelectedVariants: (selectedIds: ProductVariant[]) => void
}

const VariantsTable: React.FC<Props> = (props) => {
  const { isReplace, regionId, currencyCode, customerId, setSelectedVariants } =
    props

  const [query, setQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const debouncedSearchTerm = useDebounce(query, 500)

  const { isLoading, count, variants } = useAdminVariants({
    q: debouncedSearchTerm,
    limit: PAGE_SIZE,
    offset,
    region_id: regionId,
    customer_id: customerId,
  })

  useEffect(() => {
    if (typeof count !== "undefined") {
      setNumPages(Math.ceil(count / PAGE_SIZE))
    }
  }, [count])

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">Name</div>
        ),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.product.thumbnail ? (
                  <img
                    src={original.product.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col">
                <span>{original.product.title}</span>
                {original.title}
              </div>
            </div>
          )
        },
      },
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">SKU</div>
        ),
        accessor: "sku",
        Cell: ({ row: { original } }) => <div>{original.sku}</div>,
      },
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">Options</div>
        ),
        accessor: "options",
        Cell: ({ row: { original } }) => {
          const options = original.options?.map(({ value }) => value).join(", ")

          return (
            <div title={options} className="truncate max-w-[160px]">
              <span>{options}</span>
            </div>
          )
        },
      },
      {
        Header: (
          <div className="text-right text-gray-500 text-small font-semibold">
            In Stock
          </div>
        ),
        accessor: "inventory_quantity",
        Cell: ({ row: { original } }) => (
          <div className="text-right">{original.inventory_quantity}</div>
        ),
      },
      {
        Header: (
          <div className="text-right text-gray-500 text-small font-semibold">
            Price
          </div>
        ),
        accessor: "amount",
        Cell: ({ row: { original } }) => {
          if (!original.original_price_incl_tax) {
            return null
          }

          const showOriginal = original.calculated_price_type !== "default"

          return (
            <div className="flex justify-end items-center gap-2">
              <div className="flex flex-col items-end">
                {showOriginal && (
                  <span className="text-gray-400 line-through">
                    {formatAmountWithSymbol({
                      amount: original.original_price_incl_tax,
                      currency: currencyCode,
                    })}
                  </span>
                )}
                <span>
                  {formatAmountWithSymbol({
                    amount: original.calculated_price_incl_tax,
                    currency: currencyCode,
                  })}
                </span>
              </div>
              <span className="text-gray-400">
                {" "}
                {currencyCode.toUpperCase()}
              </span>
            </div>
          )
        },
      },
    ]
  }, [])

  const table = useTable(
    {
      columns,
      data: variants || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: PAGE_SIZE,
        selectedRowIds: {},
      },
      pageCount: numPages,
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => {
            if (isReplace) {
              return null
            }

            return (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllRowsSelectedProps()}
                  type={isReplace ? "radio" : "checkbox"}
                />
              </div>
            )
          },
          Cell: ({ row, toggleAllRowsSelected, toggleRowSelected }) => {
            const currentState = row.getToggleRowSelectedProps()
            const selectProps = row.getToggleRowSelectedProps()

            return (
              <div className={clsx({ "mr-2": isReplace })}>
                <IndeterminateCheckbox
                  {...selectProps}
                  type={isReplace ? "radio" : "checkbox"}
                  onChange={
                    isReplace
                      ? () => {
                          toggleAllRowsSelected(false)
                          toggleRowSelected(row.id, !currentState.checked)
                        }
                      : selectProps.onChange
                  }
                />
              </div>
            )
          },
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    if (!variants) {
      return
    }

    const selected = variants.filter((v) => table.state.selectedRowIds[v.id])
    setSelectedVariants(selected)
  }, [table.state.selectedRowIds, variants])

  const handleNext = () => {
    if (table.canNextPage) {
      setOffset((old) => old + table.state.pageSize)
      setCurrentPage((old) => old + 1)
      table.nextPage()
    }
  }

  const handlePrev = () => {
    if (table.canPreviousPage) {
      setOffset((old) => Math.max(old - table.state.pageSize, 0))
      setCurrentPage((old) => old - 1)
      table.previousPage()
    }
  }

  const handleSearch = (q) => {
    setOffset(0)
    setCurrentPage(0)
    setQuery(q)
  }

  return (
    <TableContainer
      hasPagination
      isLoading={isLoading}
      numberOfRows={PAGE_SIZE}
      pagingState={{
        count: count!,
        offset: offset,
        pageSize: offset + table.rows.length,
        title: "Products",
        currentPage: table.state.pageIndex + 1,
        pageCount: table.pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: table.canNextPage,
        hasPrev: table.canPreviousPage,
      }}
    >
      <Table
        immediateSearchFocus
        enableSearch
        searchPlaceholder="Search Product Variants..."
        searchValue={query}
        handleSearch={handleSearch}
        {...table.getTableProps()}
      >
        {table.headerGroups.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <Table.HeadCell {...col.getHeaderProps()}>
                {col.render("Header")}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        ))}

        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)
            return (
              <Table.Row {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Table.Cell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

export default VariantsTable
