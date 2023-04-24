import { isEmpty } from "lodash"
import { useAdminProducts } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { useSelectedVendor } from "../../../context/vendor"
import { useLocation } from "react-router-dom"
import { usePagination, useTable, useRowSelect, Row } from "react-table"
import { useAnalytics } from "../../../context/analytics"
import { useFeatureFlag } from "../../../context/feature-flag"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import ProductOverview from "./overview"
import useProductActions from "./use-product-actions"
import useProductTableColumn from "./use-product-column"
import { useProductFilters } from "./use-product-filters"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import { Product } from "@medusajs/medusa"
import Button from "../../fundamentals/button"
import { MinusIcon } from "@heroicons/react/20/solid"
import CheckIcon from "../../fundamentals/icons/check-icon"

const DEFAULT_PAGE_SIZE = 50
const DEFAULT_PAGE_SIZE_TILE_VIEW = 18

const defaultQueryProps = {
  fields: "id,title,thumbnail,status,handle,vendor_id,collection_id",
  expand:
    "variants,options,variants.prices,variants.options,collection,tags,type,images",
  is_giftcard: false,
}

export interface ProductTableProps {
  selectedIds: string[]
  updateSelectedIds: (ids: string[]) => void
}

const ProductTable = ({
  selectedIds,
  updateSelectedIds,
}: ProductTableProps) => {
  const location = useLocation()
  const { isVendorView, selectedVendor } = useSelectedVendor()

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

  const queryString = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  })

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit)

  const [query, setQuery] = useState(queryString.q)
  const [numPages, setNumPages] = useState(0)

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  const { products, isLoading, count } = useAdminProducts(
    {
      ...queryObject,
      vendor_id: isVendorView ? [selectedVendor?.id] : undefined,
    },
    {
      keepPreviousData: true,
      onSuccess: ({ count }) => trackNumberOfProducts({ count }),
    }
  )

  const someSelectedIdsExist = (productsOnPage: Product[]) =>
    selectedIds.some((id) => productsOnPage?.some((p) => p.id === id))

  const allSelectedIdsExist = (productsOnPage: Product[]) =>
    productsOnPage?.every((p) => selectedIds.includes(p.id as string))

  const selectedStatus = (productsOnPage: Product[]) =>
    !someSelectedIdsExist(productsOnPage)
      ? "none"
      : allSelectedIdsExist(productsOnPage)
      ? "all"
      : "some"

  const removePageFromSelection = (productsOnPage: Product[]) => {
    if (!productsOnPage) return
    const newSelected = selectedIds.filter(
      (id) => !productsOnPage.some((p) => p.id === id)
    )
    updateSelectedIds(newSelected)
  }

  const addPageToSelection = (productsOnPage: Product[]) => {
    if (!productsOnPage) return
    const newSelected = [
      ...selectedIds,
      ...productsOnPage
        .filter((p) => !selectedIds.includes(p.id as string))
        .map((p) => p.id),
    ]
    updateSelectedIds(newSelected as string[])
  }

  const removeAllFromSelection = () => updateSelectedIds([])

  const handleSelectionChange = (productsOnPage: Product[]) => {
    if (
      selectedStatus(productsOnPage) === "some" ||
      selectedStatus(productsOnPage) === "none"
    )
      addPageToSelection(productsOnPage)
    if (selectedStatus(productsOnPage) === "all")
      removePageFromSelection(productsOnPage)
  }

  const useSelectionColumn = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      {
        id: "selection",
        Header: ({ data: productsOnPage }) => {
          return (
            <Button
              className="ml-1.5 p-0 w-5 h-5 relative border-grey-30 border cursor-pointer rounded-base"
              variant="ghost"
              size="small"
              onClick={() => handleSelectionChange(productsOnPage)}
            >
              {selectedStatus(productsOnPage) === "some" && (
                <MinusIcon className="h-4 w-4 absolute top-[1px] left-[1px]" />
              )}
              {selectedStatus(productsOnPage) === "all" && (
                <CheckIcon
                  size={16}
                  className="absolute top-[1px] left-[1px]"
                />
              )}
            </Button>
          )
        },
        Cell: ({ row }) => {
          return (
            <Table.Cell onClick={(e) => e.stopPropagation()} className="w-8">
              <div className="flex justify-center">
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            </Table.Cell>
          )
        },
      },
      ...columns,
    ])
  }

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  // Update the query params when the filters change
  useEffect(() => {
    const filterObj = representationObject

    if (!isEmpty(filterObj)) {
      const stringified = qs.stringify(filterObj, { addQueryPrefix: true })

      if (stringified !== location.search.slice(1)) {
        // note: setting location.search here helps keep the existing filters in place
        location.search = stringified
        window.history.replaceState(
          null,
          "",
          `${location.pathname}${stringified}`
        )
      }
    }
  }, [location, representationObject])

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
    state: { pageIndex, selectedRowIds },
  } = useTable(
    {
      columns,
      data: products || [],
      manualPagination: true,
      manualFilters: true,
      initialState: {
        pageIndex: Math.floor(offs / limit),
        pageSize: limit,
        hiddenColumns,
        selectedRowIds: selectedIds.reduce((acc, id) => {
          acc[id] = true
          return acc
        }, {}),
      },
      pageCount: numPages,
      autoResetPage: false,
      autoResetSelectedRows: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      autoResetSortBy: false,
      getRowId: (row) => row.id as string,
    },
    usePagination,
    useRowSelect,
    useSelectionColumn
  )

  useEffect(() => {
    const newSelectedRowIds = Object.keys(selectedRowIds)
    if (selectedIds.length !== newSelectedRowIds.length)
      updateSelectedIds(Object.keys(selectedRowIds))
  }, [selectedIds.length, selectedRowIds, updateSelectedIds])

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query != null) {
        setFreeText(query)
        gotoPage(0)
      } else {
        // Note: commenting this out, not sure why we want to reset all of the filters when the query is cleared
        // if (typeof query !== "undefined") {
        //   // if we delete query string, we reset the table view
        //   reset()
        // }
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
      numberOfRows={rows.length}
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
          <div className="flex items-center min-h-[34px]">
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
            {selectedIds.length > 0 && (
              <div className="flex items-center ml-4">
                <span className="text-xs font-bold">
                  {selectedIds.length} selected{" "}
                </span>
                <Button
                  className="ml-2"
                  variant="secondary"
                  size="xsmall"
                  onClick={removeAllFromSelection}
                >
                  clear
                </Button>
              </div>
            )}
          </div>
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

const ProductRow = ({ row, ...rest }: { row: Row<Product> }) => {
  const product = row.original
  const { getActions } = useProductActions(product)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/vendor/${product.vendor_id}/products/${product.id}`}
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
