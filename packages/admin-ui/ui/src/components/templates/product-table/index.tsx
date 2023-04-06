import { isEmpty } from "lodash"
import { useAdminProducts } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import { useAnalytics } from "../../../providers/analytics-provider"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import ProductOverview from "./overview"
import useProductActions from "./use-product-actions"
import useProductTableColumn from "./use-product-column"
import { useProductFilters } from "./use-product-filters"

const DEFAULT_PAGE_SIZE = 15
const DEFAULT_PAGE_SIZE_TILE_VIEW = 18

const defaultQueryProps = {
  fields: "id,title,thumbnail,status,handle,collection_id",
  expand:
    "variants,options,variants.prices,variants.options,collection,tags,type,images",
  is_giftcard: false,
}

const ProductTable = () => {
  const location = useLocation()

  const { isFeatureEnabled } = useFeatureFlag()
  const { trackNumberOfProducts } = useAnalytics()

  let hiddenColumns = ["sales_channel"]
  if (isFeatureEnabled("sales_channels")) {
    defaultQueryProps.expand =
      "variants,options,variants.prices,variants.options,collection,tags,type,images,sales_channels"
    hiddenColumns = []
  }

  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    setLimit,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useProductFilters(location.search, defaultQueryProps)

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit)

  const [query, setQuery] = useState(queryObject.query)
  const [numPages, setNumPages] = useState(0)

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  const { products, isLoading, count } = useAdminProducts(
    {
      ...queryObject,
    },
    {
      keepPreviousData: true,
      onSuccess: ({ count }) => trackNumberOfProducts({ count }),
    }
  )

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/products`, "", `${`?${stringified}`}`)
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

  const setTileView = () => {
    setLimit(DEFAULT_PAGE_SIZE_TILE_VIEW)
    setShowList(false)
  }

  const setListView = () => {
    setLimit(DEFAULT_PAGE_SIZE)
    setShowList(true)
  }
  const [showList, setShowList] = React.useState(true)
  const [columns] = useProductTableColumn({
    setTileView,
    setListView,
    showList,
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: products || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offs / limit),
        pageSize: limit,
        hiddenColumns,
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
        if (typeof query !== "undefined") {
          // if we delete query string, we reset the table view
          reset()
        }
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
      numberOfRows={DEFAULT_PAGE_SIZE}
      hasPagination
      pagingState={{
        count: count!,
        offset: offs,
        pageSize: offs + rows.length,
        title: "Products",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
      isLoading={isLoading}
    >
      <Table
        filteringOptions={
          <ProductsFilter
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
        searchValue={query}
        handleSearch={setQuery}
        {...getTableProps()}
      >
        {showList ? (
          <>
            <Table.Head>
              {headerGroups?.map((headerGroup) => (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col) => (
                    <Table.HeadCell
                      className="min-w-[100px]"
                      {...col.getHeaderProps()}
                    >
                      {col.render("Header")}
                    </Table.HeadCell>
                  ))}
                </Table.HeadRow>
              ))}
            </Table.Head>

            <Table.Body {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                return <ProductRow row={row} {...row.getRowProps()} />
              })}
            </Table.Body>
          </>
        ) : (
          <ProductOverview products={products} toggleListView={setListView} />
        )}
      </Table>
    </TableContainer>
  )
}

const ProductRow = ({ row, ...rest }) => {
  const product = row.original
  const { getActions } = useProductActions(product)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/products/${product.id}`}
      actions={getActions()}
      {...rest}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
export default ProductTable
