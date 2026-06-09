import { HttpTypes } from "@medusajs/types"
import { PencilSquare, Trash } from "@medusajs/icons"
import {
  createDataTableColumnHelper,
  DataTableAction,
  StatusBadge,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FetchError } from "@medusajs/js-sdk"

import { PlaceholderCell } from "../../../components/table/table-cells/common/placeholder-cell"
import { getFormattedAddress } from "../../../lib/addresses"
import { FulfillmentSetType } from "../common/constants"
import { queryClient } from "../../../lib/query-client"
import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { ListSummary } from "../../../components/common/list-summary"
import { sdk } from "../../../lib/client"
import {
  useFulfillmentSetPermissions,
  useSalesChannelPermissions,
  useStockLocationPermissions,
} from "../../../hooks/use-resource-permissions"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminStockLocation>()

export const useLocationListTableColumns = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const { canUpdate, canDelete } = useStockLocationPermissions()
  const { canRead: canReadSalesChannels } = useSalesChannelPermissions()
  const { canRead: canReadFulfillmentSets } = useFulfillmentSetPermissions()

  const handleDelete = useCallback(
    async (location: HttpTypes.AdminStockLocation) => {
      const result = await prompt({
        title: t("general.areYouSure"),
        description: t("stockLocations.delete.confirmation", {
          name: location.name,
        }),
        confirmText: t("actions.remove"),
        cancelText: t("actions.cancel"),
      })

      if (!result) {
        return
      }

      try {
        await sdk.admin.stockLocation.delete(location.id)
        queryClient.invalidateQueries({
          queryKey: stockLocationsQueryKeys.lists(),
        })

        queryClient.invalidateQueries({
          queryKey: stockLocationsQueryKeys.detail(location.id),
        })

        toast.success(
          t("stockLocations.delete.successToast", {
            name: location.name,
          })
        )
      } catch (e) {
        toast.error((e as FetchError).message)
      }
    },
    [prompt, t]
  )

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
      ...(canReadFulfillmentSets
        ? [
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
                      fulfillmentSetExists
                        ? "statuses.enabled"
                        : "statuses.disabled"
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
                      fulfillmentSetExists
                        ? "statuses.enabled"
                        : "statuses.disabled"
                    )}
                  </StatusBadge>
                )
              },
            }),
          ]
        : []),
      ...(canReadSalesChannels
        ? [
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
          ]
        : []),
      ...(canUpdate || canDelete
        ? [
            columnHelper.action({
              actions: (ctx) => {
                const location = ctx.row.original
                // eslint-disable-next-line max-len
                const groups: DataTableAction<HttpTypes.AdminStockLocation>[][] =
                  []

                if (canUpdate) {
                  groups.push([
                    {
                      icon: <PencilSquare />,
                      label: t("actions.edit"),
                      onClick: () => {
                        navigate(`/settings/locations/${location.id}/edit`)
                      },
                    },
                  ])
                }

                if (canDelete) {
                  groups.push([
                    {
                      icon: <Trash />,
                      label: t("actions.delete"),
                      onClick: () => handleDelete(location),
                    },
                  ])
                }

                return groups
              },
            }),
          ]
        : []),
    ],
    [
      canUpdate,
      canDelete,
      canReadSalesChannels,
      handleDelete,
      canReadFulfillmentSets,
      navigate,
      t,
    ]
  )
}
