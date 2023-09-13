import { useAdminProducts } from "medusa-react"
import React, { useEffect, useState } from "react"
import { Column, usePagination, useRowSelect, useTable } from "react-table"
import { useTranslation } from "react-i18next"
import { useDebounce } from "../../../hooks/use-debounce"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import Table from "../../molecules/table"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"
import TableContainer from "../../organisms/table-container"
import useCollectionProductColumns from "./use-collection-product-columns"

type CollectionProductTableProps = {
  addedProducts: any[]
  setProducts: (products: any) => void
}

const CollectionProductTable: React.FC<CollectionProductTableProps> = ({
  addedProducts,
  setProducts,
}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [filteringOptions, setFilteringOptions] = useState<
    FilteringOptionProps[]
  >([])

  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  const debouncedSearchTerm = useDebounce(query, 500)

  const { isLoading, count, products } = useAdminProducts({
    q: debouncedSearchTerm,
    limit: limit,
    offset,
  })

  useEffect(() => {
    setFilteringOptions([
      {
        title: t("collection-product-table-sort-by", "Sort by"),
        options: [
          {
            title: t("collection-product-table-all", "All"),
            onClick: () => {},
          },
          {
            title: t("collection-product-table-newest", "Newest"),
            onClick: () => {},
          },
          {
            title: t("collection-product-table-oldest", "Oldest"),
            onClick: () => {},
          },
        ],
      },
    ])
  }, [products])

  const columns = useCollectionProductColumns() as readonly Column<any[]>[]

  const {
    rows,
    prepareRow,
    getTableBodyProps,
    getTableProps,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      data: products || [],
      columns: columns,
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: limit,
        selectedRowIds: addedProducts?.reduce((prev, { id }) => {
          prev[id] = true
          return prev
        }, {}),
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
          Cell: ({ row }) => {
            return (
              <Table.Cell className="pl-base w-[5%]">
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </Table.Cell>
            )
          },
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    setSelectedProducts((selectedProducts) => [
      ...selectedProducts.filter(
        (sv) => Object.keys(selectedRowIds).findIndex((id) => id === sv.id) > -1
      ),
      ...(products?.filter(
        (p) =>
          selectedProducts.findIndex((sv) => sv.id === p.id) < 0 &&
          Object.keys(selectedRowIds).findIndex((id) => id === p.id) > -1
      ) || []),
    ])
  }, [selectedRowIds])

  const handleNext = () => {
    if (canNextPage) {
      setOffset((old) => old + pageSize)
      setCurrentPage((old) => old + 1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset((old) => old - pageSize)
      setCurrentPage((old) => old - 1)
      previousPage()
    }
  }

  const handleSearch = (q) => {
    setOffset(0)
    setQuery(q)
  }

  return (
    <TableContainer
      isLoading={isLoading}
      numberOfRows={pageSize}
      hasPagination
      pagingState={{
        count: count!,
        offset: offset,
        pageSize: offset + rows.length,
        title: t("collection-product-table-products", "Products"),
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchPlaceholder={t(
          "collection-product-table-search-products",
          "Search Products"
        )}
        filteringOptions={filteringOptions}
        {...getTableProps()}
        className="h-full"
      >
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Table.Row
                color={"inherit"}
                {...row.getRowProps()}
                className="px-base"
              >
                {row.cells.map((cell, index) => {
                  return cell.render("Cell", { index })
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

export default CollectionProductTable
