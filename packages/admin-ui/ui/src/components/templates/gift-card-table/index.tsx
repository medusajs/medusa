import clsx from "clsx"
import { isEmpty } from "lodash"
import { useAdminGiftCards } from "medusa-react"
import qs from "qs"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import Spinner from "../../atoms/spinner"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import useGiftCardTableColums from "./use-gift-card-column"
import { useGiftCardFilters } from "./use-gift-card-filters"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {}

const GiftCardTable = () => {
  const location = useLocation()

  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useGiftCardFilters(location.search, defaultQueryProps)
  const filtersOnLoad = queryObject

  const offs = parseInt(filtersOnLoad?.offset) || 0
  const lim = parseInt(filtersOnLoad.limit) || DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState(filtersOnLoad?.query)
  const [numPages, setNumPages] = useState(0)

  const { gift_cards, isLoading, count } = useAdminGiftCards(queryObject, {
    keepPreviousData: true,
  })

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [gift_cards])

  const [columns] = useGiftCardTableColums()

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
      data: gift_cards || [],
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

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/gift-cards`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = () => {
    const filterObj = representationObject

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    } else {
      updateUrlFromFilter(filterObj)
    }
  }

  useEffect(() => {
    refreshWithFilters()
  }, [representationObject])

  return (
    <TableContainer
      isLoading={isLoading}
      hasPagination
      numberOfRows={queryObject.limit}
      pagingState={{
        count: count!,
        offset: queryObject.offset,
        pageSize: queryObject.offset + rows.length,
        title: "Gift cards",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table
        filteringOptions={null}
        enableSearch
        handleSearch={setQuery}
        searchValue={query}
        {...getTableProps()}
        className={clsx({ ["relative"]: isLoading })}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        {isLoading || !gift_cards ? (
          <Table.Body {...getTableBodyProps()}>
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <div className="absolute mt-10 flex h-full w-full items-center justify-center">
                  <div className="">
                    <Spinner size={"large"} variant={"secondary"} />
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <Table.Row
                  color={"inherit"}
                  linkTo={row.original.id}
                  {...row.getRowProps()}
                  className="group"
                >
                  {row.cells.map((cell, index) => {
                    return cell.render("Cell", { index })
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        )}
      </Table>
    </TableContainer>
  )
}

export default GiftCardTable
