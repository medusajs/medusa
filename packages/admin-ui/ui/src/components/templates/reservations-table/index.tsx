import { Cell, Row, TableRowProps, usePagination, useTable } from "react-table"
import {
  InventoryItemDTO,
  InventoryLevelDTO,
  ProductVariant,
} from "@medusajs/medusa"
import React, { useEffect, useMemo, useState } from "react"
import {
  useAdminInventoryItems,
  useAdminStockLocations,
  useAdminStore,
} from "medusa-react"
import { useLocation, useNavigate } from "react-router-dom"

import Button from "../../fundamentals/button"
import Fade from "../../atoms/fade-wrapper"
import NewReservation from "./new"
import { NextSelect } from "../../molecules/select/next-select"
import Table from "../../molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import { isEmpty } from "lodash"
import qs from "qs"
import { useInventoryFilters } from "./use-inventory-filters"
import useReservationsTableColumns from "./use-reservations-columns"
import useToggleState from "../../../hooks/use-toggle-state"

const DEFAULT_PAGE_SIZE = 15

type ReservationsTableProps = {}

const defaultQueryProps = {}

const LocationDropdown = ({
  selectedLocation,
  onChange,
}: {
  selectedLocation: string
  onChange: (id: string) => void
}) => {
  const { stock_locations: locations, isLoading } = useAdminStockLocations()

  useEffect(() => {
    if (!selectedLocation && !isLoading && locations?.length) {
      onChange(locations[0].id)
    }
  }, [isLoading, locations, onChange, selectedLocation])

  const selectedLocObj = useMemo(() => {
    if (!isLoading && locations) {
      return locations.find((l) => l.id === selectedLocation)
    }
    return null
  }, [selectedLocation, locations, isLoading])

  if (isLoading || !locations || !selectedLocObj) {
    return null
  }

  return (
    <div className="h-[40px] w-[200px]">
      <NextSelect
        isMulti={false}
        onChange={(loc) => {
          onChange(loc!.value)
        }}
        options={locations.map((l) => ({
          label: l.name,
          value: l.id,
        }))}
        value={{ value: selectedLocObj.id, label: selectedLocObj.name }}
      />
    </div>
  )
}

const ReservationsTable: React.FC<ReservationsTableProps> = () => {
  const { store } = useAdminStore()
  const {
    state: createReservationState,
    close: closeReservationCreate,
    open: openReservationCreate,
  } = useToggleState()

  const location = useLocation()

  const { stock_locations, isLoading: locationsLoading } =
    useAdminStockLocations()

  const defaultQuery = useMemo(() => {
    if (store) {
      return {
        ...defaultQueryProps,
        location_id: store.default_location_id,
      }
    }
    return defaultQueryProps
  }, [store])

  const {
    reset,
    paginate,
    setLocationFilter,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useInventoryFilters(location.search, defaultQuery)

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit)

  const [query, setQuery] = useState(queryObject.query)
  const [numPages, setNumPages] = useState(0)

  // const { reservations } = useAdminReservations()

  const { inventory_items, isLoading, count } = useAdminInventoryItems(
    {
      ...queryObject,
    },
    {
      enabled: !!store,
    }
  )

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [inventory_items])

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/inventory`, "", `${`?${stringified}`}`)
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

  const [columns] = useReservationsTableColumns()

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
      data: inventory_items || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offs / limit),
        pageSize: limit,
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
    <>
      <TableContainer
        hasPagination
        pagingState={{
          count: count || 0,
          offset: offs,
          pageSize: offs + rows.length,
          title: "Inventory Items",
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
        numberOfRows={limit}
        isLoading={isLoading}
      >
        <Table
          enableSearch
          searchClassName="h-[40px]"
          handleSearch={setQuery}
          searchValue={query}
          tableActions={
            <div className="flex gap-2">
              <LocationDropdown
                selectedLocation={
                  queryObject.location_id || store?.default_location_id
                }
                onChange={(id) => {
                  setLocationFilter(id)
                  gotoPage(0)
                }}
              />
              <Button
                variant="secondary"
                size="small"
                onClick={openReservationCreate}
              >
                Create reservation
              </Button>
            </div>
          }
          {...getTableProps()}
        >
          <Table.Head>
            {headerGroups?.map((headerGroup) => {
              const { key, ...rest } = headerGroup.getHeaderGroupProps()

              return (
                <Table.HeadRow key={key} {...rest}>
                  {headerGroup.headers.map((col) => {
                    const { key, ...rest } = col.getHeaderProps()
                    return (
                      <Table.HeadCell
                        className="min-w-[100px]"
                        key={key}
                        {...rest}
                      >
                        {col.render("Header")}
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
              const { key, ...rest } = row.getRowProps()
              return <InventoryRow row={row} key={key} {...rest} />
            })}
          </Table.Body>
        </Table>
      </TableContainer>
      <Fade isVisible={createReservationState} isFullScreen={true}>
        <NewReservation onClose={closeReservationCreate} />
      </Fade>
    </>
  )
}

const InventoryRow = ({
  row,
  ...rest
}: {
  row: Row<
    Partial<InventoryItemDTO> & {
      location_levels?: InventoryLevelDTO[] | undefined
      variants?: ProductVariant[] | undefined
    }
  >
} & TableRowProps) => {
  const inventory = row.original

  const navigate = useNavigate()

  const {
    state: isShowingAdjustAvailabilityModal,
    open: showAdjustAvailabilityModal,
    close: closeAdjustAvailabilityModal,
  } = useToggleState()

  const getRowActionables = () => {
    const productId = inventory.variants?.[0]?.product_id

    const actions = [
      {
        label: "Edit",
        onClick: showAdjustAvailabilityModal,
      },
    ]

    if (productId) {
      return [
        {
          label: "View Product",
          onClick: () => navigate(`/a/products/${productId}`),
        },
        ...actions,
      ]
    }

    return actions
  }

  return (
    <Table.Row
      color={"inherit"}
      onClick={showAdjustAvailabilityModal}
      clickable
      forceDropdown
      actions={getRowActionables()}
      {...rest}
    >
      {row.cells.map((cell: Cell, index: number) => {
        const { key, ...rest } = cell.getCellProps()
        return (
          <Table.Cell {...rest} key={key}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default ReservationsTable
