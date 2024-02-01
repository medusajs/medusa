import {
  AdminGetVariantsVariantInventoryRes,
  DraftOrder,
  VariantInventory,
} from "@medusajs/medusa"
import React, { useMemo } from "react"
import { useAdminReservations, useMedusa } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionType } from "../../../../components/molecules/actionables"
import Badge from "../../../../components/fundamentals/badge"
import BodyCard from "../../../../components/organisms/body-card"
import { DisplayTotal } from "../templates"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import ReservationIndicator from "../../components/reservation-indicator/reservation-indicator"
import { ReservationItemDTO } from "@medusajs/types"
import ReserveItemsModal from "../reservation/reserve-items-modal"
import { Response } from "@medusajs/medusa-js"
import StatusIndicator from "../../../../components/fundamentals/status-indicator"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { sum } from "lodash"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import useToggleState from "../../../../hooks/use-toggle-state"

type DraftSummaryCardProps = {
  order: DraftOrder
}

const DraftSummaryCard: React.FC<DraftSummaryCardProps> = ({ order }) => {
  const { t } = useTranslation()

  const { client } = useMedusa()
  const { isFeatureEnabled } = useFeatureFlag()
  const inventoryEnabled = useMemo(() => {
    return isFeatureEnabled("inventoryService")
  }, [isFeatureEnabled])

  const { cart } = order
  const { region } = cart

  const [variantInventoryMap, setVariantInventoryMap] = React.useState<
    Map<string, VariantInventory>
  >(new Map())

  React.useEffect(() => {
    if (!inventoryEnabled) {
      return
    }

    const fetchInventory = async () => {
      const inventory = await Promise.all(
        cart.items.map(async (item) => {
          if (!item.variant_id) {
            return
          }
          return await client.admin.variants.getInventory(item.variant_id)
        })
      )

      setVariantInventoryMap(
        new Map(
          inventory
            .filter(
              (
                inventoryItem
                // eslint-disable-next-line max-len
              ): inventoryItem is Response<AdminGetVariantsVariantInventoryRes> =>
                !!inventoryItem
            )
            .map((i) => {
              return [i.variant.id, i.variant]
            })
        )
      )
    }

    fetchInventory()
  }, [cart.items, inventoryEnabled, client.admin.variants])

  const { reservations } = useAdminReservations(
    {
      line_item_id: cart?.items.map((item) => item.id),
    },
    {
      enabled: inventoryEnabled,
    }
  )

  const reservationItemsMap = useMemo(() => {
    if (!reservations?.length || !inventoryEnabled) {
      return {}
    }

    return reservations.reduce(
      (acc: Record<string, ReservationItemDTO[]>, item: ReservationItemDTO) => {
        if (!item.line_item_id) {
          return acc
        }
        acc[item.line_item_id] = acc[item.line_item_id]
          ? [...acc[item.line_item_id], item]
          : [item]
        return acc
      },
      {}
    )
  }, [reservations, inventoryEnabled])

  const {
    state: reservationModalIsOpen,
    open: showReservationModal,
    close: closeReservationModal,
  } = useToggleState()

  const allItemsReserved = useMemo(() => {
    return cart.items.every((item) => {
      if (
        !item.variant_id ||
        !variantInventoryMap.get(item.variant_id)?.inventory.length
      ) {
        return true
      }

      const reservations = reservationItemsMap[item.id]

      return (
        item.quantity === item.fulfilled_quantity ||
        (reservations &&
          sum(reservations.map((r) => r.quantity)) ===
            item.quantity - (item.fulfilled_quantity || 0))
      )
    })
  }, [cart.items, variantInventoryMap, reservationItemsMap])

  const actionables = useMemo(() => {
    const actionables: ActionType[] = []
    if (inventoryEnabled && !allItemsReserved) {
      actionables.push({
        label: "Allocate",
        onClick: showReservationModal,
      })
    }
    return actionables
  }, [inventoryEnabled, showReservationModal, allItemsReserved])

  return (
    <BodyCard
      className={"mb-4 h-auto min-h-0 w-full"}
      title="Summary"
      status={
        isFeatureEnabled("inventoryService") &&
        Array.isArray(reservations) && (
          <StatusIndicator
            onClick={allItemsReserved ? undefined : showReservationModal}
            variant={allItemsReserved ? "success" : "danger"}
            title={
              allItemsReserved
                ? t("detail-cards-allocated", "Allocated")
                : t("detail-cards-not-fully-allocated", "Not fully allocated")
            }
            className="rounded-rounded border px-3 py-1.5"
          />
        )
      }
      actionables={actionables}
    >
      <div className="mt-6">
        {cart?.items?.map((item, i) => (
          <div
            key={i}
            className="hover:bg-grey-5 rounded-rounded mx-[-5px] mb-1 flex h-[64px] justify-between py-2 px-[5px]"
          >
            <div className="flex justify-center space-x-4">
              <div className="rounded-rounded flex h-[48px] w-[36px] items-center justify-center">
                {item?.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    className="rounded-rounded object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="inter-small-regular text-grey-90 max-w-[225px] truncate">
                  {item.title}
                </span>
                {item?.variant && (
                  <span className="inter-small-regular text-grey-50">
                    {item.variant.sku}
                  </span>
                )}
              </div>
            </div>
            <div className="flex  items-center">
              <div className="small:space-x-2 medium:space-x-4 large:space-x-6 mr-3 flex">
                <div className="inter-small-regular text-grey-50">
                  {formatAmountWithSymbol({
                    amount: (item?.total ?? 0) / item.quantity,
                    currency: region?.currency_code ?? "",
                    digits: 2,
                    tax: [],
                  })}
                </div>
                <div className="inter-small-regular text-grey-50">
                  x {item.quantity}
                </div>
                {inventoryEnabled && (
                  <ReservationIndicator
                    reservations={reservationItemsMap[item.id]}
                    lineItem={item}
                  />
                )}
                <div className="inter-small-regular text-grey-90">
                  {formatAmountWithSymbol({
                    amount: item.total ?? 0,
                    currency: region?.currency_code ?? "",
                    digits: 2,
                    tax: [],
                  })}
                </div>
              </div>
              <div className="inter-small-regular text-grey-50">
                {region?.currency_code.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
        <DisplayTotal
          currency={region?.currency_code}
          totalAmount={order?.cart?.subtotal}
          totalTitle={t("detail-cards-subtotal", "Subtotal")}
        />
        {cart?.discounts?.map((discount, index) => (
          <div key={index} className="mt-4 flex items-center justify-between">
            <div className="inter-small-regular text-grey-90 flex items-center">
              Discount:{" "}
              <Badge className="ml-3" variant="default">
                {discount.code}
              </Badge>
            </div>
            <div className="inter-small-regular text-grey-90">
              -
              {formatAmountWithSymbol({
                amount: cart?.discount_total,
                currency: region?.currency_code || "",
                digits: 2,
                tax: region?.tax_rate,
              })}
            </div>
          </div>
        ))}
        <DisplayTotal
          currency={region?.currency_code}
          totalAmount={cart?.shipping_total}
          totalTitle={t("detail-cards-shipping", "Shipping")}
        />
        <DisplayTotal
          currency={region?.currency_code}
          totalAmount={cart?.tax_total}
          totalTitle={t("detail-cards-tax", "Tax")}
        />
        <DisplayTotal
          currency={region?.currency_code}
          variant="large"
          totalAmount={cart?.total}
          totalTitle={t("detail-cards-total", "Total")}
        />
      </div>
      {reservationModalIsOpen && (
        <ReserveItemsModal
          reservationItemsMap={reservationItemsMap}
          items={cart.items}
          close={closeReservationModal}
        />
      )}
    </BodyCard>
  )
}

export default DraftSummaryCard
