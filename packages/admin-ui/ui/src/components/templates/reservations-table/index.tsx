import * as RadixPopover from "@radix-ui/react-popover"

import { Cell, Row, TableRowProps, usePagination, useTable } from "react-table"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { ReservationItemDTO, StockLocationDTO } from "@medusajs/types"
import {
  useAdminDeleteReservation,
  useAdminReservations,
  useAdminStockLocations,
  useAdminStore,
} from "medusa-react"
import { useTranslation } from "react-i18next"

import BuildingsIcon from "../../fundamentals/icons/buildings-icon"
import Button from "../../fundamentals/button"
import DeletePrompt from "../../organisms/delete-prompt"
import EditIcon from "../../fundamentals/icons/edit-icon"
import EditReservationDrawer from "../../../domain/orders/details/reservation/edit-reservation-modal"
import Fade from "../../atoms/fade-wrapper"
import NewReservation from "./new"
import { Option } from "../../../types/shared"
import ReservationsFilters from "./components/reservations-filter"
import Table from "../../molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import TagDotIcon from "../../fundamentals/icons/tag-dot-icon"
import Tooltip from "../../atoms/tooltip"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import clsx from "clsx"
import { isEmpty } from "lodash"
import qs from "qs"
import { useLocation } from "react-router-dom"
import { useReservationFilters } from "./use-reservation-filters"
import useReservationsTableColumns from "./use-reservations-columns"
import useToggleState from "../../../hooks/use-toggle-state"

const DEFAULT_PAGE_SIZE = 15

type ReservationsTableProps = {}

const LocationDropdown = ({
  selectedLocation,
  onChange,
}: {
  selectedLocation: string
  onChange: (id: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const { stock_locations: locations, isLoading } = useAdminStockLocations()

  const locationOptions = useMemo(() => {
    let locationOptions: { label: string; value?: string }[] = []
    if (!isLoading && locations) {
      locationOptions = locations.map((l: StockLocationDTO) => ({
        label: l.name,
        value: l.id,
      }))
    }

    locationOptions.unshift({ label: "All locations", value: undefined })

    return locationOptions
  }, [isLoading, locations])

  const selectedLocObj = useMemo(() => {
    if (locationOptions?.length) {
      return (
        locationOptions.find(
          (l: { value?: string; label: string }) => l.value === selectedLocation
        ) ?? locationOptions[0]
      )
    }
  }, [selectedLocation, locationOptions])

  const isEllipsisActive = (
    e: { offsetWidth: number; scrollWidth: number } | null
  ) => {
    if (!e) {
      return false
    }
    return e.offsetWidth < e.scrollWidth
  }

  if (isLoading || !locationOptions?.length) {
    return null
  }

  return (
    <div className="max-w-[220px]">
      <RadixPopover.Root open={open} onOpenChange={setOpen}>
        <RadixPopover.Trigger className="w-full">
          <Tooltip
            className={clsx({ hidden: !isEllipsisActive(ref.current) })}
            delayDuration={1000}
            content={<div>{selectedLocObj?.label}</div>}
          >
            <Button
              size="small"
              variant="secondary"
              spanClassName="flex grow"
              className="max-w-[220px] items-center justify-start"
            >
              <BuildingsIcon size={20} />
              <span ref={ref} className="max-w-[166px] truncate">
                {selectedLocObj?.label}
              </span>
            </Button>
          </Tooltip>
        </RadixPopover.Trigger>
        <RadixPopover.Content
          side="bottom"
          align="center"
          sideOffset={2}
          className="rounded-rounded z-50 w-[220px] border bg-white p-1"
        >
          {locationOptions.map((o, i) => (
            <div
              key={i}
              className="hover:bg-grey-5 rounded-rounded mb-1 flex py-1.5 px-2"
              onClick={() => {
                setOpen(false)
                onChange(o!.value)
              }}
            >
              <div className="mr-2 h-[20px] w-[20px]">
                {selectedLocObj?.value === o.value && (
                  <TagDotIcon size={20} outerColor="#FFF" color="#111827" />
                )}
              </div>
              <p className="w-[166px]">{o.label}</p>
            </div>
          ))}
        </RadixPopover.Content>
      </RadixPopover.Root>
    </div>
  )
}

const ReservationsTable: React.FC<ReservationsTableProps> = () => {
  const { t } = useTranslation()
  const { store } = useAdminStore()
  const {
    state: createReservationState,
    close: closeReservationCreate,
    open: openReservationCreate,
  } = useToggleState()

  const location = useLocation()

  const defaultQuery = useMemo(() => {
    if (store) {
      return {
        location_id: store.default_location_id,
      }
    }
    return {}
  }, [store])

  const {
    reset,
    paginate,
    setLocationFilter,
    setQuery: setFreeText,
    queryObject,
    representationObject,
    filters,
    setFilters,
    setDefaultFilters,
  } = useReservationFilters(location.search, defaultQuery)

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit)

  const [query, setQuery] = useState(queryObject.query)
  const [numPages, setNumPages] = useState(0)

  const { reservations, isLoading, count } = useAdminReservations(
    {
      ...queryObject,
      expand: "line_item,inventory_item",
    },
    {
      enabled: !!store,
    }
  )

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [reservations])

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/reservations`, "", `${`?${stringified}`}`)
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
      data: reservations || [],
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
          title: t("reservations-table-reservations", "Reservations"),
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
          searchClassName="h-[40px]"
          handleSearch={setQuery}
          searchValue={query}
          tableActions={
            <div className="flex gap-2">
              <ReservationsFilters
                submitFilters={setFilters}
                clearFilters={setDefaultFilters}
                filters={filters}
              />
              <LocationDropdown
                selectedLocation={queryObject.location_id}
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
              return <ReservationRow row={row} key={key} {...rest} />
            })}
          </Table.Body>
        </Table>
      </TableContainer>
      <Fade isVisible={createReservationState} isFullScreen={true}>
        <NewReservation
          locationId={queryObject.location_id}
          onClose={closeReservationCreate}
        />
      </Fade>
    </>
  )
}

const ReservationRow = ({
  row,
  ...rest
}: {
  row: Row<ReservationItemDTO>
} & TableRowProps) => {
  const inventory = row.original

  const { t } = useTranslation()
  const { mutate: deleteReservation } = useAdminDeleteReservation(inventory.id)

  const [showEditReservation, setShowEditReservation] =
    useState<ReservationItemDTO | null>(null)
  const [showDeleteReservation, setShowDeleteReservation] = useState(false)

  const getRowActionables = () => {
    const actions = [
      {
        label: t("reservations-table-edit", "Edit"),
        onClick: () => setShowEditReservation(row.original),
        icon: <EditIcon size={20} />,
      },
      {
        label: t("reservations-table-delete", "Delete"),
        variant: "danger",
        icon: <TrashIcon size={20} />,
        onClick: () => setShowDeleteReservation(true),
      },
    ]

    return actions
  }

  return (
    <>
      <Table.Row
        color={"inherit"}
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
      {showEditReservation && (
        <EditReservationDrawer
          close={() => setShowEditReservation(null)}
          reservation={row.original}
        />
      )}
      {showDeleteReservation && (
        <DeletePrompt
          text={t(
            "reservations-table-confirm-delete",
            "Are you sure you want to remove this reservation?"
          )}
          heading={t(
            "reservations-table-remove-reservation",
            "Remove reservation"
          )}
          successText={t(
            "reservations-table-reservation-has-been-removed",
            "Reservation has been removed"
          )}
          onDelete={async () => await deleteReservation(undefined)}
          handleClose={() => setShowDeleteReservation(false)}
        />
      )}
    </>
  )
}

export default ReservationsTable
