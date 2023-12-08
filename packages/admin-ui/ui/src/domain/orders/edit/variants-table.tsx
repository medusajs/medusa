import { useAdminVariants, useAdminVariantsInventory } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import { InventoryLevelDTO, ProductVariant } from "@medusajs/medusa"
import clsx from "clsx"
import pluralize from "pluralize"
import { useTranslation } from "react-i18next"
import { useDebounce } from "../../../hooks/use-debounce"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import Table from "../../../components/molecules/table"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { formatAmountWithSymbol } from "../../../utils/prices"
import TableContainer from "../../../components/organisms/table-container"
import Tooltip from "../../../components/atoms/tooltip"
import useStockLocations from "../../../hooks/use-stock-locations"
import Skeleton from "../../../components/atoms/skeleton"

const PAGE_SIZE = 12

type Props = {
  isReplace?: boolean
  regionId: string
  customerId: string
  currencyCode: string
  setSelectedVariants: (selectedIds: ProductVariant[]) => void
}

const VariantsTable: React.FC<Props> = (props) => {
  const { t } = useTranslation()
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

  const VariantInventoryCell = ({ row: { original } }) => {
    const { getLocationNameById } = useStockLocations()

    const { variant, isLoading } = useAdminVariantsInventory(original.id)

    if (isLoading) {
      return (
        <div className="flex justify-end">
          <Skeleton isLoading={true}>
            <div className="h-[20px] w-[50px]" />
          </Skeleton>
        </div>
      )
    }

    if (!isLoading && !variant?.inventory?.length) {
      return <div className="text-right">{original.inventory_quantity}</div>
    }

    const { inventory } = variant

    const total = inventory[0].location_levels.reduce(
      (sum: number, location_level: InventoryLevelDTO) =>
        (sum += location_level.stocked_quantity),
      0
    )

    const LocationTooltip = (
      <>
        {inventory[0].location_levels.map(
          (location_level: InventoryLevelDTO) => (
            <div key={location_level.id} className="font-normal">
              <span className="font-semibold">
                {location_level.stocked_quantity}
              </span>
              {t("variants-table-location", " in {{location}}", {
                location: getLocationNameById(location_level.location_id),
              })}
            </div>
          )
        )}
      </>
    )

    return (
      <Tooltip content={LocationTooltip} side="top" className="translate-x-1/4">
        <div className="text-right">
          {total} in {inventory[0].location_levels.length}{" "}
          {pluralize("location", inventory[0].location_levels.length)}
        </div>
      </Tooltip>
    )
  }

  const ProductCell = ({ row: { original } }) => {
    return (
      <div className="flex items-center">
        <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
          {original.product.thumbnail ? (
            <img
              src={original.product.thumbnail}
              className="rounded-soft h-full object-cover"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex max-w-[200px] flex-col">
          <Tooltip
            content={
              <span className="font-normal">{original.product.title}</span>
            }
            maxWidth={400}
          >
            <div className="truncate">
              {original.sku ?? original.product.title}
            </div>
          </Tooltip>
          <span className="text-grey-50">{original.title}</span>
        </div>
      </div>
    )
  }

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <div className="text-small font-semibold text-gray-500">
            {t("edit-product", "Product")}
          </div>
        ),
        accessor: "sku",
        Cell: ProductCell,
      },
      {
        Header: (
          <div className="text-small text-right font-semibold text-gray-500">
            {t("edit-in-stock", "In Stock")}
          </div>
        ),
        accessor: "inventory_quantity",
        Cell: VariantInventoryCell,
      },
      {
        Header: (
          <div className="text-small text-right font-semibold text-gray-500">
            {t("edit-price", "Price")}
          </div>
        ),
        accessor: "amount",
        Cell: ({ row: { original } }) => {
          if (!original.original_price_incl_tax) {
            return null
          }

          const showOriginal = original.calculated_price_type !== "default"

          return (
            <div className="flex items-center justify-end gap-2">
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
        title: t("edit-products", "Products"),
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
        searchPlaceholder={t(
          "edit-search-product-variants",
          "Search Product Variants..."
        )}
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
