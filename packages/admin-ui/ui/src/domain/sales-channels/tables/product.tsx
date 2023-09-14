import { Product, SalesChannel } from "@medusajs/medusa"
import clsx from "clsx"
import {
  useAdminAddProductsToSalesChannel,
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
} from "medusa-react"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { usePagination, useRowSelect, useTable } from "react-table"
import { useTranslation } from "react-i18next"

import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Modal from "../../../components/molecules/modal"
import Table from "../../../components/molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import { useProductFilters } from "../../../components/templates/product-table/use-filter-tabs"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import useNotification from "../../../hooks/use-notification"
import useQueryFilters from "../../../hooks/use-query-filters"
import { SALES_CHANNEL_PRODUCTS_TABLE_COLUMNS } from "./config"
import Placeholder from "./placeholder"

/* ****************************************** */
/* ************** TABLE CONFIG ************** */
/* ****************************************** */

const DEFAULT_PAGE_SIZE = 7

/**
 * Default filtering config for querying products endpoint.
 */
const defaultQueryProps = {
  additionalFilters: {
    expand: "collection,type,sales_channels",
    fields: "id,title,thumbnail,status",
  },
  limit: DEFAULT_PAGE_SIZE,
  offset: 0,
}

/* ******************************************** */
/* ************** PRODUCTS TABLE ************** */
/* ******************************************** */

type ProductTableProps = {
  isAddTable: boolean
  count: number
  products: Product[]
  setSelectedRowIds: (ids: string[]) => void
  selectedRowIds: string[]
  currentSalesChannelId?: string
  removeProductFromSalesChannel: (id: string) => void
  productFilters: Record<string, any>
  isLoading?: boolean
}

/**
 * Renders a table of sales channel products.
 */
export const ProductTable = forwardRef(
  (props: ProductTableProps, ref: React.Ref<any>) => {
    const {
      tableActions,
      currentSalesChannelId,
      productFilters: {
        setTab,
        saveTab,
        removeTab,
        availableTabs: filterTabs,
        activeFilterTab,
        setFilters,
        filters,
        reset,
      },
      paginate,
      setQuery: setFreeText,
      queryObject,
      isLoading,

      // CONTAINER props
      isAddTable,
      count,
      products,
      setSelectedRowIds,
      removeProductFromSalesChannel,
    } = props

    const offs = parseInt(queryObject.offset) || 0
    const limit = parseInt(queryObject.limit)

    const navigate = useNavigate()
    const { t } = useTranslation()

    const [query, setQuery] = useState(queryObject.query)
    const [numPages, setNumPages] = useState(0)

    const clearFilters = () => {
      reset()
      setQuery("")
    }

    useEffect(() => {
      if (typeof count !== "undefined") {
        const controlledPageCount = Math.ceil(count / limit)
        setNumPages(controlledPageCount)
      }
    }, [count])

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
      toggleAllRowsSelected,
      toggleRowSelected,
      // Get the state from the instance
      state: { pageIndex, pageSize, ...state },
    } = useTable(
      {
        columns: SALES_CHANNEL_PRODUCTS_TABLE_COLUMNS,
        data: products || [],
        manualPagination: true,
        initialState: {
          pageIndex: Math.floor(offs / limit),
          pageSize: limit,
        },
        pageCount: numPages,
        autoResetPage: false,
        autoResetSelectedRows: false,
        getRowId: (row) => row.id,
        stateReducer: (newState, action) => {
          switch (action.type) {
            case "toggleAllRowsSelected":
              return {
                ...newState,
                selectedRowIds: {},
              }

            default:
              return newState
          }
        },
      },
      usePagination,
      useRowSelect
    )

    useImperativeHandle(ref, () => ({
      toggleAllRowsSelected: toggleAllRowsSelected,
    }))

    useEffect(() => {
      setSelectedRowIds(Object.keys(state.selectedRowIds))
    }, [state.selectedRowIds])

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (query) {
          setFreeText(query)
          gotoPage(0)
        } else {
          if (typeof query !== "undefined") {
            // if we delete query string, we reset the table view
            setFreeText("")
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

    const getActions = (id: string) => [
      {
        label: t("tables-details", "Details"),
        onClick: () => navigate(`/a/products/${id}`),
        icon: <DetailsIcon size={20} />,
      },
      {
        label: t("tables-remove-from-the-channel", "Remove from the channel"),
        variant: "danger",
        onClick: () => removeProductFromSalesChannel(id),
        icon: <TrashIcon size={20} />,
      },
    ]

    return (
      <TableContainer
        isLoading={isLoading}
        numberOfRows={DEFAULT_PAGE_SIZE}
        hasPagination
        pagingState={{
          count: count!,
          offset: offs,
          pageSize: offs + rows.length,
          title: t("tables-products", "Products"),
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
      >
        <Table
          tableActions={tableActions}
          containerClassName="flex-1"
          filteringOptions={
            filters && (
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
            )
          }
          enableSearch={isAddTable}
          handleSearch={setQuery}
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
              return (
                <ProductRow
                  onClick={() => toggleRowSelected(row.id)}
                  disabled={
                    !!row.original.sales_channels.find(
                      (sc) => sc.id === currentSalesChannelId
                    )
                  }
                  row={row}
                  actions={
                    !isAddTable ? getActions(row.original.id) : undefined
                  }
                />
              )
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    )
  }
)

/**
 * Renders product table row.
 */
const ProductRow = ({ row, actions, onClick, disabled }) => {
  return (
    <Table.Row
      onClick={!disabled && onClick}
      color={"inherit"}
      className={clsx("cursor-pointer", {
        "bg-grey-5": row.isSelected,
        "pointer-events-none cursor-not-allowed opacity-40": disabled,
      })}
      actions={actions}
      {...row.getRowProps()}
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

type RemoveProductsPopupProps = {
  onClose: () => void
  onRemove: () => void
  total: number
}

/**
 * Popup for removing selected products from a sales channel.
 */
function RemoveProductsPopup({
  onClose,
  onRemove,
  total,
}: RemoveProductsPopupProps) {
  const classes = {
    "translate-y-1 opacity-0": !total,
    "translate-y-0 opacity-100": total,
  }
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        "pointer-events-none absolute bottom-1 flex w-full justify-center transition-all duration-200",
        classes
      )}
    >
      <div className="shadow-toaster pointer-events-auto flex h-[48px] min-w-[224px] items-center justify-around gap-3 rounded-lg border px-4 py-3">
        <span className="text-small text-grey-50">
          {t(
            "sales-channels-table-placeholder-selected-with-counts",
            "{{count}}",
            { count: total }
          )}
        </span>
        <div className="bg-grey-20 h-[20px] w-[1px]" />
        <Button variant="danger" size="small" onClick={onRemove}>
          {t("tables-remove", "Remove")}
        </Button>
        <button onClick={onClose} className="text-grey-50 cursor-pointer">
          <CrossIcon size={20} />
        </button>
      </div>
    </div>
  )
}

/* **************************************** */
/* ************** CONTAINERS ************** */
/* **************************************** */

type SalesChannelProductsTableProps = {
  salesChannelId: string
  showAddModal: () => void
}

/**
 * Sales channel products table container.
 */
function SalesChannelProductsTable(props: SalesChannelProductsTableProps) {
  const tableRef = useRef()
  const { salesChannelId, showAddModal } = props
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const notification = useNotification()

  const params = useQueryFilters(defaultQueryProps)
  const filters = useProductFilters()

  const { mutate: deleteProductsFromSalesChannel } =
    useAdminDeleteProductsFromSalesChannel(salesChannelId)

  const { products, count, isLoading } = useAdminProducts({
    ...params.queryObject,
    ...filters.queryObject,
    sales_channel_id: [props.salesChannelId],
  })

  const resetSelection = () => {
    setSelectedRowIds([])
    tableRef.current?.toggleAllRowsSelected(false)
  }

  useEffect(() => {
    resetSelection()
  }, [products, salesChannelId])

  const removeProductFromSalesChannel = (id: string) => {
    deleteProductsFromSalesChannel({ product_ids: [{ id }] })

    notification("Success", "Product successfully removed", "success")
  }

  const removeSelectedProducts = async () => {
    await deleteProductsFromSalesChannel({
      product_ids: selectedRowIds.map((id) => ({ id })),
    })

    notification(
      "Success",
      "Products successfully removed from the sales channel",
      "success"
    )
    resetSelection()
  }

  const isFilterOn = Object.keys(filters.queryObject).length
  const hasSearchTerm = params.queryObject.q

  if (!products?.length && !isLoading && !isFilterOn && !hasSearchTerm) {
    return <Placeholder showAddModal={showAddModal} />
  }

  const toBeRemoveCount = selectedRowIds.length

  return (
    <div className="relative">
      <ProductTable
        ref={tableRef}
        count={count || 0}
        isLoading={isLoading}
        products={(products as Product[]) || []}
        removeProductFromSalesChannel={removeProductFromSalesChannel}
        setSelectedRowIds={setSelectedRowIds}
        productFilters={filters}
        {...params}
      />
      <RemoveProductsPopup
        total={toBeRemoveCount}
        onRemove={removeSelectedProducts}
        onClose={resetSelection}
      />
    </div>
  )
}

type SalesChannelProductsSelectModalProps = {
  handleClose: () => void
  salesChannel: SalesChannel
}

/**
 * Sales channels products add container.
 * Renders product table for adding/editing sales channel products
 * in a modal.
 */
function SalesChannelProductsSelectModal(
  props: SalesChannelProductsSelectModalProps
) {
  const { handleClose, salesChannel } = props
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const notification = useNotification()

  const params = useQueryFilters(defaultQueryProps)
  const filters = useProductFilters()

  const { products, count, isLoading } = useAdminProducts({
    ...params.queryObject,
    ...filters.queryObject,
    expand: "sales_channels",
  })

  const { mutate: addProductsBatch, isLoading: isMutating } =
    useAdminAddProductsToSalesChannel(salesChannel.id)

  const handleSubmit = () => {
    addProductsBatch({ product_ids: selectedRowIds.map((i) => ({ id: i })) })
    handleClose()
    notification(
      "Success",
      "Products successfully added to the sales channel",
      "success"
    )
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Add products</span>
        </Modal.Header>
        <Modal.Content>
          <ProductTable
            isAddTable
            isLoading={isLoading}
            products={(products as Product[]) || []}
            count={count || 0}
            setSelectedRowIds={setSelectedRowIds}
            productFilters={filters}
            currentSalesChannelId={salesChannel.id}
            {...params}
          />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={handleSubmit}
              loading={isMutating}
              disabled={isMutating}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export { SalesChannelProductsSelectModal, SalesChannelProductsTable }
