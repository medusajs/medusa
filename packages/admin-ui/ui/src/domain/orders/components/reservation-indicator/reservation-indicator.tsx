import React from "react"
import { LineItem } from "@medusajs/medusa"
import { sum } from "lodash"
import { ReservationItemDTO } from "@medusajs/types"
import { useAdminStockLocations, useAdminVariantsInventory } from "medusa-react"
import Tooltip from "../../../../components/atoms/tooltip"
import CircleQuarterSolid from "../../../../components/fundamentals/icons/circle-quarter-solid"
import WarningCircleIcon from "../../../../components/fundamentals/icons/warning-circle"
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon"
import EditAllocationDrawer from "../../details/allocations/edit-allocation-modal"
import Button from "../../../../components/fundamentals/button"

const ReservationIndicator = ({
  reservations,
  lineItem,
}: {
  reservations?: ReservationItemDTO[]
  lineItem: LineItem
}) => {
  const { variant, isLoading, isFetching } = useAdminVariantsInventory(
    lineItem.variant_id!,
    {
      enabled: !!lineItem?.variant_id,
    }
  )

  const { stock_locations } = useAdminStockLocations({
    id: reservations?.map((r) => r.location_id) || [],
  })

  const [reservation, setReservation] =
    React.useState<ReservationItemDTO | null>(null)

  const locationMap = new Map(stock_locations?.map((l) => [l.id, l.name]) || [])

  const reservationsSum = sum(reservations?.map((r) => r.quantity) || [])

  const allocatableSum = lineItem.quantity - (lineItem?.fulfilled_quantity || 0)

  const awaitingAllocation = allocatableSum - reservationsSum

  if (
    isLoading ||
    isFetching ||
    !lineItem.variant_id ||
    !variant?.inventory.length
  ) {
    return <div className="w-[20px]" />
  }

  return (
    <div className={awaitingAllocation ? "text-rose-50" : "text-grey-40"}>
      <Tooltip
        content={
          <div className="inter-small-regular flex flex-col items-center px-1 pt-1 pb-2">
            {reservationsSum || awaitingAllocation ? (
              <div className="gap-y-base grid grid-cols-1 divide-y">
                {!!awaitingAllocation && (
                  <span className="flex w-full items-center">
                    {awaitingAllocation} items await allocation
                  </span>
                )}
                {reservations?.map((reservation) => (
                  <EditAllocationButton
                    key={reservation.id}
                    locationName={locationMap.get(reservation.location_id)}
                    totalReservedQuantity={reservationsSum}
                    reservation={reservation}
                    lineItem={lineItem}
                    onClick={() => setReservation(reservation)}
                  />
                ))}
              </div>
            ) : (
              <span className="flex w-full items-center">
                This item has been fulfilled.
              </span>
            )}
          </div>
        }
        side="bottom"
      >
        {awaitingAllocation ? (
          reservationsSum ? (
            <CircleQuarterSolid size={20} />
          ) : (
            <WarningCircleIcon fillType="solid" size={20} />
          )
        ) : (
          <CheckCircleFillIcon size={20} />
        )}
      </Tooltip>

      {reservation && (
        <EditAllocationDrawer
          totalReservedQuantity={reservationsSum}
          close={() => setReservation(null)}
          reservation={reservation}
          item={lineItem}
        />
      )}
    </div>
  )
}

const EditAllocationButton = ({
  reservation,
  locationName,
  onClick,
}: {
  reservation: ReservationItemDTO
  totalReservedQuantity: number
  locationName?: string
  lineItem: LineItem
  onClick: () => void
}) => {
  return (
    <div className="pt-base first:pt-0">
      {`${reservation.quantity} item: ${locationName}`}
      <Button
        onClick={onClick}
        variant="ghost"
        size="small"
        className="mt-2 w-full border"
      >
        Edit Allocation
      </Button>
    </div>
  )
}

export default ReservationIndicator
