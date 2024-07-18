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
  useAdminUpdateLocationLevel,
  useAdminVariant,
} from "medusa-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Button from "../../fundamentals/button"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import InputField from "../../molecules/input"
import InputHeader from "../../fundamentals/input-header"
import Modal from "../../molecules/modal"
import { NextSelect } from "../../molecules/select/next-select"
import Spinner from "../../atoms/spinner"
import Table from "../../molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import { getErrorMessage } from "../../../utils/error-messages"
import { isEmpty } from "lodash"
import qs from "qs"
import { useInventoryFilters } from "./use-inventory-filters"
import useInventoryTableColumn from "./use-inventory-column"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"

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

const InventoryTable: React.FC<InventoryTableProps> = () => {
  const { store } = useAdminStore()

  const location = useLocation()
  const { t } = useTranslation()

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

  const [columns] = useInventoryTableColumn({
    location_id: queryObject.location_id,
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
        title: t("inventory-table-inventory-items", "Inventory Items"),
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
      {!rows.length && !locationsLoading && !stock_locations?.length && (
        <div className="text-grey-50 w-full py-8 text-center">
          You don't have any stock locations. Add one to see inventory.
        </div>
      )}
    </TableContainer>
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
  const { t } = useTranslation()

  const {
    state: isShowingAdjustAvailabilityModal,
    open: showAdjustAvailabilityModal,
    close: closeAdjustAvailabilityModal,
  } = useToggleState()

  const getRowActionables = () => {
    const productId = inventory.variants?.[0]?.product_id

    const actions = [
      {
        label: t(
          "inventory-table-actions-adjust-availability",
          "Adjust Availability"
        ),
        onClick: showAdjustAvailabilityModal,
      },
    ]

    if (productId) {
      return [
        {
          label: t("inventory-table-view-product", "View Product"),
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
  inventory: Partial<InventoryItemDTO> & {
    location_levels?: InventoryLevelDTO[] | undefined
    variants?: ProductVariant[] | undefined
  }
  handleClose: () => void
}) => {
  const inventoryVariantId = inventory.variants?.[0]?.id
  const locationLevel = inventory.location_levels?.[0]

  const { t } = useTranslation()
  const { variant, isLoading } = useAdminVariant(inventoryVariantId || "")
  const {
    mutate: updateLocationLevelForInventoryItem,
    isLoading: isSubmitting,
  } = useAdminUpdateLocationLevel(inventory.id!)

  const notification = useNotification()

  const [stockedQuantity, setStockedQuantity] = useState(
    locationLevel?.stocked_quantity || 0
  )

  const disableSubmit =
    stockedQuantity === (locationLevel?.stocked_quantity || 0) ||
    !variant ||
    !locationLevel

  const onSubmit = () => {
    updateLocationLevelForInventoryItem(
      {
        stockLocationId: locationLevel!.location_id,
        stocked_quantity: stockedQuantity,
      },
      {
        onSuccess: () => {
          notification(
            t("inventory-table-success", "Success"),
            t(
              "inventory-table-inventory-item-updated-successfully",
              "Inventory item updated successfully"
            ),
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
          <h1 className="inter-large-semibold">
            {t("inventory-table-adjust-availability", "Adjust availability")}
          </h1>
        </Modal.Header>
        <Modal.Content>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-2">
              <InputHeader label="Item" />
              <InputHeader label="Quantity" />
              <div className="flex flex-col">
                <span className="pe-base">
                  <div className="float-left my-1.5 me-4 flex h-[40px] w-[30px] items-center">
                    {variant?.product?.thumbnail ? (
                      <img
                        src={variant?.product?.thumbnail}
                        className="rounded-rounded h-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="truncate">
                      {variant?.product?.title}
                      <span className="text-grey-50 truncate">
                        ({inventory.sku})
                      </span>
                    </span>
                    <span className="text-grey-50">
                      {variant?.options?.map((o) => (
                        <span key={o.id}>{o.value}</span>
                      ))}
                    </span>
                  </div>
                </span>
              </div>
              <InputField
                onChange={(e) => setStockedQuantity(e.target.valueAsNumber)}
                autoFocus
                type="number"
                placeholder="0"
                min={0}
                value={stockedQuantity}
              />
            </div>
          )}
        </Modal.Content>
      </Modal.Body>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full justify-end">
          <Button
            size="small"
            variant="ghost"
            className="border"
            onClick={handleClose}
          >
            {t("inventory-table-cancel", "Cancel")}
          </Button>
          <Button
            size="small"
            variant="primary"
            disabled={disableSubmit}
            loading={isSubmitting}
            onClick={onSubmit}
          >
            {t("inventory-table-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
export default InventoryTable
