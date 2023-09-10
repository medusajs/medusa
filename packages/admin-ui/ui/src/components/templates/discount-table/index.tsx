import { isEmpty } from "lodash"
import { useAdminDiscounts } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import { useTranslation } from "react-i18next"
import { useAnalytics } from "../../../providers/analytics-provider"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import DiscountFilters from "../discount-filter-dropdown"
import { usePromotionTableColumns } from "./use-promotion-columns"
import { usePromotionFilters } from "./use-promotion-filters"
import usePromotionActions from "./use-promotion-row-actions"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {}

const DiscountTable: React.FC = () => {
  const { t } = useTranslation()
  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = usePromotionFilters(location.search, defaultQueryProps)

  const { trackNumberOfDiscounts } = useAnalytics()

  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  const { discounts, isLoading, count } = useAdminDiscounts(
    {
      is_dynamic: false,
      expand: "rule,rule.conditions,rule.conditions.products,regions",
      ...queryObject,
    },
    {
      keepPreviousData: true,
      onSuccess: ({ count }) => {
        trackNumberOfDiscounts({
          count,
        })
      },
    }
  )

  const [query, setQuery] = useState("")
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    if (count && queryObject.limit) {
      const controlledPageCount = Math.ceil(count! / queryObject.limit)
      if (controlledPageCount !== numPages) {
        setNumPages(controlledPageCount)
      }
    }
  }, [count, queryObject.limit])

  const [columns] = usePromotionTableColumns()

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
      data: discounts || [],
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
    window.history.replaceState(`/a/discounts`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = () => {
    const filterObj = representationObject

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    } else {
      updateUrlFromFilter(filterObj)
    }
  }

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  useEffect(() => {
    refreshWithFilters()
  }, [representationObject])

  return (
    <TableContainer
      hasPagination
      isLoading={isLoading}
      numberOfRows={queryObject.limit}
      pagingState={{
        count: count!,
        offset: queryObject.offset,
        pageSize: queryObject.offset + rows.length,
        title: t("discount-table-discounts", "Discounts"),
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table
        filteringOptions={
          <DiscountFilters
            filters={filters}
            submitFilters={setFilters}
            clearFilters={clearFilters}
            tabs={filterTabs}
            onTabClick={setTab}
            activeTab={activeFilterTab}
            onRemoveTab={removeTab}
            onSaveTab={saveTab}
          />
        }
        enableSearch
        handleSearch={setQuery}
        searchPlaceholder={t(
          "discount-table-search-by-code-or-description",
          "Search by code or description..."
        )}
        searchValue={query}
        {...getTableProps()}
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
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return <PromotionRow row={row} key={row.original.id} />
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

const PromotionRow = ({ row }) => {
  const promotion = row.original

  const { getRowActions } = usePromotionActions(promotion)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={row.original.id}
      {...row.getRowProps()}
      actions={getRowActions()}
      className="group"
    >
      {row.cells.map((cell) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell")}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default DiscountTable
