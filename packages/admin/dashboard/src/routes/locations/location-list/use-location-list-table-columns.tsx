import { HttpTypes } from "@medusajs/types"
import { createDataTableColumnHelper, StatusBadge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"

import { PlaceholderCell } from "../../../components/table/table-cells/common/placeholder-cell"
import { getFormattedAddress } from "../../../lib/addresses"
import { FulfillmentSetType } from "../common/constants"
import { ListSummary } from "../../../components/common/list-summary"
import { LocationListTableActions } from "./location-list-table-actions"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminStockLocation>()

export const useLocationListTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => {
          const name = getValue()
          if (!name) {
            return <PlaceholderCell />
          }

          return (
            <span className="text-ui-fg-subtle text-small truncate">
              {name}
            </span>
          )
        },
      }),
      columnHelper.accessor("address", {
        header: t("fields.address"),
        cell: ({ getValue, row }) => {
          const address = getValue()
          const location = row.original

          if (!address) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex flex-col">
              <span className="text-ui-fg-subtle text-small truncate">
                {getFormattedAddress({
                  address: location.address as HttpTypes.AdminOrderAddress,
                }).join(", ")}
              </span>
            </div>
          )
        },
      }),
      columnHelper.accessor("fulfillment_sets", {
        id: "shipping_fulfillment",
        header: t("stockLocations.fulfillmentSets.shipping.header"),
        cell: ({ getValue }) => {
          const fulfillmentSets = getValue()
          const shippingSet = fulfillmentSets?.find(
            (f) => f.type === FulfillmentSetType.Shipping
          )
          const fulfillmentSetExists = !!shippingSet

          return (
            <StatusBadge color={fulfillmentSetExists ? "green" : "grey"}>
              {t(
                fulfillmentSetExists ? "statuses.enabled" : "statuses.disabled"
              )}
            </StatusBadge>
          )
        },
      }),
      columnHelper.accessor("fulfillment_sets", {
        id: "pickup_fulfillment",
        header: t("stockLocations.fulfillmentSets.pickup.header"),
        cell: ({ getValue }) => {
          const fulfillmentSets = getValue()
          const pickupSet = fulfillmentSets?.find(
            (f) => f.type === FulfillmentSetType.Pickup
          )
          const fulfillmentSetExists = !!pickupSet

          return (
            <StatusBadge color={fulfillmentSetExists ? "green" : "grey"}>
              {t(
                fulfillmentSetExists ? "statuses.enabled" : "statuses.disabled"
              )}
            </StatusBadge>
          )
        },
      }),
      columnHelper.accessor("sales_channels", {
        header: t("stockLocations.salesChannels.label"),
        cell: ({ getValue }) => {
          const salesChannels = getValue()

          if (!salesChannels?.length) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex items-center">
              <ListSummary
                inline
                n={1}
                list={salesChannels.map((s) => s.name)}
              />
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "action",
        cell: ({ row }) => <LocationListTableActions location={row.original} />,
      }),
    ],
    [t]
  )
}
