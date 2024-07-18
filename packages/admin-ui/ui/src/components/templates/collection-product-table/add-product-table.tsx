import { useAdminProducts } from "medusa-react"
import React, { useEffect, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import { useTranslation } from "react-i18next"
import { useDebounce } from "../../../hooks/use-debounce"
import Button from "../../fundamentals/button"
import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
import Modal from "../../molecules/modal"
import Table from "../../molecules/table"
import TableContainer from "../../organisms/table-container"
import useCollectionProductColumns from "./use-collection-product-columns"

type AddProductsTableProps = {
  existingRelations: any[]
  onSubmit: (selectedIds: string[], removedIds: string[]) => void
  onClose: () => void
}

const AddProductsTable: React.FC<AddProductsTableProps> = ({
  existingRelations,
  onSubmit,
  onClose,
}) => {
  const PAGE_SIZE = 10
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [removedProducts, setRemovedProducts] = useState<any[]>([])

  const debouncedSearchTerm = useDebounce(query, 500)

  const { isLoading, count, products } = useAdminProducts({
    q: debouncedSearchTerm,
    limit: PAGE_SIZE,
    offset,
  })

  const columns = useCollectionProductColumns()

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
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      data: products || [],
      columns: columns,
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: PAGE_SIZE,
        selectedRowIds: existingRelations.reduce((prev, { id }) => {
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
              <Table.Cell className="ps-base w-[5%]">
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
    setSelectedProducts((selectedProducts) =>
      [
        ...selectedProducts.filter(
          (sv) =>
            Object.keys(selectedRowIds).findIndex((id) => id === sv.id) > -1
        ),
        ...(products?.filter(
          (p) =>
            selectedProducts.findIndex((sv) => sv.id === p.id) < 0 &&
            Object.keys(selectedRowIds).findIndex((id) => id === p.id) > -1
        ) || []),
      ].filter((p) => existingRelations.findIndex((ap) => ap.id === p.id) < 0)
    )

    setRemovedProducts([
      ...existingRelations.filter(
        (ap) => Object.keys(selectedRowIds).findIndex((id) => id === ap.id) < 0
      ),
    ])
  }, [selectedRowIds])

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / PAGE_SIZE)
    setNumPages(controlledPageCount)
  }, [products, count, PAGE_SIZE])

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

  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (selectedProducts.length > 0 || removedProducts.length > 0) {
      setDisabled(false)
      return
    }

    setDisabled(true)
  }, [selectedProducts, removedProducts])

  const handleSubmit = () => {
    onSubmit(
      selectedProducts.map((p) => p.id),
      removedProducts.map((p) => p.id)
    )
  }

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h3 className="inter-xlarge-semibold">
            {t("collection-product-table-add-products", "Add Products")}
          </h3>
        </Modal.Header>
        <Modal.Content>
          <TableContainer
            hasPagination
            numberOfRows={PAGE_SIZE}
            isLoading={isLoading}
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
              searchValue={query}
              searchPlaceholder={t(
                "collection-product-table-search-products",
                "Search Products"
              )}
              {...getTableProps()}
              className="flex-grow"
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
        </Modal.Content>
        <Modal.Footer>
          <div className="gap-x-xsmall flex w-full items-center justify-end">
            <Button
              variant="ghost"
              size="small"
              className="w-eventButton"
              onClick={onClose}
            >
              {t("collection-product-table-cancel", "Cancel")}
            </Button>
            <Button
              variant="primary"
              size="small"
              className="w-eventButton"
              onClick={handleSubmit}
              disabled={disabled}
            >
              {t("collection-product-table-save", "Save")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default AddProductsTable
