import { useAdminDraftOrders } from "medusa-react"
import { Fragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import { useTranslation } from "react-i18next"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import useDraftOrderTableColumns from "./use-draft-order-column"
import { useDraftOrderFilters } from "./use-draft-order-filters"

const DEFAULT_PAGE_SIZE = 15

const DraftOrderTable = () => {
  const location = useLocation()
  const { t } = useTranslation()

  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
  } = useDraftOrderFilters(location.search, {})

  const filtersOnLoad = queryObject

  const offs = parseInt(filtersOnLoad?.offset) || 0
  const lim = parseInt(filtersOnLoad?.limit) || DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState(filtersOnLoad?.query)
  const [numPages, setNumPages] = useState(0)

  const { draft_orders, isLoading, isRefetching, count } = useAdminDraftOrders(
    queryObject,
    {
      keepPreviousData: true,
    }
  )

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [count, queryObject])

  const [columns] = useDraftOrderTableColumns()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: draft_orders || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query)
        gotoPage(0)
      } else {
        // if we delete query string, we reset the table view
        reset()
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  return (
    <TableContainer
      hasPagination
      numberOfRows={DEFAULT_PAGE_SIZE}
      pagingState={{
        count: count!,
        offset: queryObject.offset,
        pageSize: queryObject.offset + rows.length,
        title: t("draft-order-table-draft-orders", "Draft Orders"),
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
      isLoading={isLoading || isRefetching}
    >
      <Table
        filteringOptions={[]}
        enableSearch
        handleSearch={setQuery}
        searchValue={query}
        {...getTableProps()}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => {
            return (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col, index) => {
                  return (
                    <Table.HeadCell
                      className="w-[100px]"
                      {...col.getHeaderProps()}
                    >
                      {col.render("Header", { customIndex: index })}
                    </Table.HeadCell>
                  )
                })}
              </Table.HeadRow>
            )
          })}
        </Table.Head>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Table.Row
                color={"inherit"}
                linkTo={`/a/draft-orders/${row.original.id}`}
                {...row.getRowProps()}
              >
                {row.cells.map((cell, index) => {
                  return <Fragment key={index}>{cell.render("Cell")}</Fragment>
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

export default DraftOrderTable
