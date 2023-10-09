import { useAdminStockLocations, useAdminVariantsInventory } from "medusa-react"

import Button from "../../../../components/fundamentals/button"
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon"
import CircleQuarterSolid from "../../../../components/fundamentals/icons/circle-quarter-solid"
import EditReservationDrawer from "../../details/reservation/edit-reservation-modal"
import { LineItem } from "@medusajs/medusa"
import React from "react"
import { ReservationItemDTO } from "@medusajs/types"
import Tooltip from "../../../../components/atoms/tooltip"
import WarningCircleIcon from "../../../../components/fundamentals/icons/warning-circle"
import { sum } from "lodash"
import { useTranslation } from "react-i18next"

const ReservationIndicator = ({
  reservations,
  lineItem,
}: {
  reservations?: ReservationItemDTO[]
  lineItem: LineItem
}) => {
  const { t } = useTranslation()
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

  const reservableSum = lineItem.quantity - (lineItem?.fulfilled_quantity || 0)

  const awaitingReservation = reservableSum - reservationsSum

  if (
    isLoading ||
    isFetching ||
    !lineItem.variant_id ||
    !variant?.inventory.length
  ) {
    return <div className="w-[20px]" />
  }

  return (
    <div className={awaitingReservation ? "text-rose-50" : "text-grey-40"}>
      <Tooltip
        content={
          <div className="inter-small-regular flex flex-col items-center px-1 pt-1 pb-2">
            {reservationsSum || awaitingReservation ? (
              <div className="gap-y-base grid grid-cols-1 divide-y">
                {!!awaitingReservation && (
                  <span className="flex w-full items-center">
                    {t(
                      "reservation-indicator-awaiting-reservation-count",
                      "{{awaitingReservation}} items not reserved",
                      {
                        awaitingReservation,
                      }
                    )}
                  </span>
                )}
                {reservations?.map((reservation) => (
                  <EditReservationButton
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
                {t(
                  "reservation-indicator-this-item-has-been-fulfilled",
                  "This item has been fulfilled."
                )}
              </span>
            )}
          </div>
        }
        side="bottom"
      >
        {awaitingReservation ? (
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
        <EditReservationDrawer
          totalReservedQuantity={reservationsSum}
          close={() => setReservation(null)}
          reservation={reservation}
          item={lineItem}
        />
      )}
    </div>
  )
}

const EditReservationButton = ({
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
  const { t } = useTranslation()
  return (
    <div className="pt-base first:pt-0">
      {t(
        "edit-reservation-button-quantity-item-location-name",
        "{{quantity}} item: ${{locationName}}",
        {
          quantity: reservation.quantity,
          locationName,
        }
      )}
      <Button
        onClick={onClick}
        variant="ghost"
        size="small"
        className="mt-2 w-full border"
      >
        {t("reservation-indicator-edit-reservation", "Edit reservation")}
      </Button>
    </div>
  )
}

export default ReservationIndicator
