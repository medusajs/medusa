import { LineItem, ReservationItemDTO } from "@medusajs/medusa"
import { useAdminStockLocations, useAdminVariantsInventory } from "medusa-react"

import Button from "../../../../components/fundamentals/button"
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon"
import CircleQuarterSolid from "../../../../components/fundamentals/icons/circle-quarter-solid"
import EditAllocationDrawer from "../allocations/edit-allocation-modal"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import React from "react"
import Tooltip from "../../../../components/atoms/tooltip"
import WarningCircleIcon from "../../../../components/fundamentals/icons/warning-circle"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { sum } from "lodash"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"

type OrderLineProps = {
  item: LineItem
  currencyCode: string
  reservations?: ReservationItemDTO[]
}

const OrderLine = ({ item, currencyCode, reservations }: OrderLineProps) => {
  const { isFeatureEnabled } = useFeatureFlag()
  return (
    <div className="hover:bg-grey-5 rounded-rounded mx-[-5px] mb-1 flex h-[64px] justify-between py-2 px-[5px]">
      <div className="flex justify-center space-x-4">
        <div className="rounded-rounded flex h-[48px] w-[36px] overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex max-w-[185px] flex-col justify-center">
          <span className="inter-small-regular text-grey-90 truncate">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular text-grey-50 truncate">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <div className="small:space-x-2 medium:space-x-4 large:space-x-6 mr-3 flex">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: (item?.total ?? 0) / item.quantity,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
          <div className="inter-small-regular text-grey-50">
            x {item.quantity}
          </div>
          {isFeatureEnabled("inventoryService") && (
            <ReservationIndicator reservations={reservations} lineItem={item} />
          )}
          <div className="inter-small-regular text-grey-90 min-w-[55px] text-right">
            {formatAmountWithSymbol({
              amount: item.total ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

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

export default OrderLine
