import { useLocation } from "react-router-dom"
import { isEmpty } from "lodash"
import {
  useAdminStore,
  useAdminStockLocations,
  useAdminInventoryItems,
  useAdminVariant,
  useAdminUpdateLocationLevel,
} from "medusa-react"
import qs from "qs"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useTable } from "react-table"
import InventoryFilter from "../../../domain/inventory/filter-dropdown"
import Table from "../../molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import { NextSelect } from "../../molecules/select/next-select"
import useInventoryActions from "./use-inventory-actions"
import useInventoryTableColumn from "./use-inventory-column"
import { useInventoryFilters } from "./use-inventory-filters"
import { InventoryItemDTO } from "@medusajs/medusa"
import Modal from "../../molecules/modal"
import useToggleState from "../../../hooks/use-toggle-state"
import InputField from "../../molecules/input"
import Button from "../../fundamentals/button"
import InputHeader from "../../fundamentals/input-header"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import Spinner from "../../atoms/spinner"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

const DEFAULT_PAGE_SIZE = 15

type InventoryTableProps = {}

const defaultQueryProps = {}

const LocationDropdown = ({
  selectedLocation,
  onChange,
}: {
  selectedLocation: string
  onChange: (id: string) => void
}) => {
  const { stock_locations: locations, isLoading } = useAdminStockLocations()

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

const InventoryTable: React.FC<InventoryTableProps> = () => {
  const { store, isLoading: isLoadingStore } = useAdminStore()

  const location = useLocation()

  const defaultQuery = useMemo(() => {
    if (!isLoadingStore && store) {
      return {
        ...defaultQueryProps,
        location_id: store.default_location_id,
      }
    }
    return defaultQueryProps
  }, [store, isLoadingStore])

  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    setLocationFilter,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useInventoryFilters(location.search, defaultQuery)

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit)

  const [query, setQuery] = useState(queryObject.query)
  const [numPages, setNumPages] = useState(0)

  const clearFilters = () => {
    reset()
    setQuery("")
  }

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

  const [columns] = useInventoryTableColumn()

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
        filteringOptions={
          <InventoryFilter
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
        searchValue={query}
        tableActions={
          <LocationDropdown
            selectedLocation={
              queryObject.location_id || store?.default_location_id
            }
            onChange={(id) => {
              setLocationFilter(id)
              gotoPage(0)
            }}
          />
        }
        {...getTableProps()}
      >
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
            return <InventoryRow row={row} {...row.getRowProps()} />
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

const InventoryRow = ({ row, ...rest }) => {
  const inventory = row.original
  const { getActions } = useInventoryActions(inventory)

  const {
    state: isShowingAdjustAvailabilityModal,
    open: showAdjustAvailabilityModal,
    close: closeAdjustAvailabilityModal,
  } = useToggleState()
  return (
    <Table.Row
      color={"inherit"}
      actions={getActions()}
      onClick={showAdjustAvailabilityModal}
      forceDropdown={true}
      {...rest}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
      {isShowingAdjustAvailabilityModal && (
        <AdjustAvailabilityModal
          inventory={inventory}
          handleClose={closeAdjustAvailabilityModal}
        />
      )}
    </Table.Row>
  )
}

const AdjustAvailabilityModal = ({
  inventory,
  handleClose,
}: {
  inventory: InventoryItemDTO
  handleClose: () => void
}) => {
  const inventoryVariantId = inventory["variants"][0].id
  const locationLevel = inventory["location_levels"]?.[0]
  const { variant, isLoading } = useAdminVariant(inventoryVariantId)
  const {
    mutate: updateLocationLevelForInventoryItem,
    isLoading: isSubmitting,
  } = useAdminUpdateLocationLevel(inventory.id)

  const notification = useNotification()

  const [stockedQuantity, setStockedQuantity] = useState(
    locationLevel?.stocked_quantity || 0
  )

  const disableSubmit =
    stockedQuantity === (locationLevel.stocked_quantity || 0)

  const onSubmit = () => {
    updateLocationLevelForInventoryItem(
      {
        stockLocationId: locationLevel.location_id,
        stocked_quantity: stockedQuantity,
      },
      {
        onSuccess: () => {
          notification(
            "Success",
            "Inventory item updated successfully",
            "success"
          )
          handleClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }
  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h1 className="inter-large-semibold">Adjust availability</h1>
        </Modal.Header>
        <Modal.Content>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-2">
              <InputHeader label="Item" />
              <InputHeader label="Quantity" />
              <div className="flex flex-col">
                <span className="pr-base">
                  <div className="float-left my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                    {variant?.product?.thumbnail ? (
                      <img
                        src={variant?.product?.thumbnail}
                        className="object-cover h-full rounded-rounded"
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="truncate">
                      {variant?.product?.title}
                      <span className="truncate text-grey-50">
                        ({inventory.sku})
                      </span>
                    </span>
                    <span className="text-grey-50">
                      {variant?.options?.map((o) => (
                        <span>{o.value}</span>
                      ))}
                    </span>
                  </div>
                </span>
              </div>
              <InputField
                onChange={(e) => setStockedQuantity(e.target.valueAsNumber)}
                autoFocus
                type="number"
                value={stockedQuantity}
              />
            </div>
          )}
        </Modal.Content>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full gap-x-xsmall">
          <Button
            size="small"
            variant="ghost"
            className="border"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            disabled={disableSubmit}
            loading={isSubmitting}
            onClick={onSubmit}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
export default InventoryTable
