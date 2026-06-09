import { PencilSquare } from "@medusajs/icons"
import { AdminStore } from "@medusajs/types"
import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useSalesChannel, useStockLocation } from "../../../../../hooks/api"
import { useRegion } from "../../../../../hooks/api/regions"
import {
  useRegionPermissions,
  useSalesChannelPermissions,
  useStockLocationPermissions,
  useStorePermissions,
} from "../../../../../hooks/use-resource-permissions"
import { PermissionGuard } from "../../../../../components/common/permission-guard"

type StoreGeneralSectionProps = {
  store: AdminStore
}

export const StoreGeneralSection = ({ store }: StoreGeneralSectionProps) => {
  const { t } = useTranslation()
  const { canUpdate } = useStorePermissions()
  const { canRead: canReadRegions } = useRegionPermissions()
  const { canRead: canReadSalesChannels } = useSalesChannelPermissions()
  const { canRead: canReadStockLocations } = useStockLocationPermissions()

  const { region } = useRegion(store.default_region_id!, undefined, {
    enabled: canReadRegions && !!store.default_region_id,
  })

  const defaultCurrency = store.supported_currencies?.find((c) => c.is_default)

  const { sales_channel } = useSalesChannel(store.default_sales_channel_id!, {
    enabled: canReadSalesChannels && !!store.default_sales_channel_id,
  })

  const { stock_location } = useStockLocation(
    store.default_location_id!,
    {
      fields: "id,name",
    },
    {
      enabled: canReadStockLocations && !!store.default_location_id,
    }
  )

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("store.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("store.manageYourStoresDetails")}
          </Text>
        </div>
        {canUpdate && (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("actions.edit"),
                    to: "edit",
                  },
                ],
              },
            ]}
          />
        )}
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {store.name}
        </Text>
      </div>
      <PermissionGuard permission="currency:read">
        <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("store.defaultCurrency")}
          </Text>
          {defaultCurrency ? (
            <div className="flex items-center gap-x-2">
              <Badge size="2xsmall">
                {defaultCurrency.currency_code?.toUpperCase()}
              </Badge>
              <Text size="small" leading="compact">
                {defaultCurrency.currency?.name}
              </Text>
            </div>
          ) : (
            <Text size="small" leading="compact">
              -
            </Text>
          )}
        </div>
      </PermissionGuard>

      <PermissionGuard permission="region:read">
        <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("store.defaultRegion")}
          </Text>
          <div className="flex items-center gap-x-2">
            {region ? (
              <Badge size="2xsmall" asChild>
                <Link to={`/settings/regions/${region.id}`}>{region.name}</Link>
              </Badge>
            ) : (
              <Text size="small" leading="compact">
                -
              </Text>
            )}
          </div>
        </div>
      </PermissionGuard>

      <PermissionGuard permission="sales_channel:read">
        <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("store.defaultSalesChannel")}
          </Text>
          <div className="flex items-center gap-x-2">
            {sales_channel ? (
              <Badge size="2xsmall" asChild>
                <Link to={`/settings/sales-channels/${sales_channel.id}`}>
                  {sales_channel.name}
                </Link>
              </Badge>
            ) : (
              <Text size="small" leading="compact">
                -
              </Text>
            )}
          </div>
        </div>
      </PermissionGuard>

      <PermissionGuard permission="stock_location:read">
        <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("store.defaultLocation")}
          </Text>
          <div className="flex items-center gap-x-2">
            {stock_location ? (
              <Badge size="2xsmall" asChild>
                <Link to={`/settings/locations/${stock_location.id}`}>
                  {stock_location.name}
                </Link>
              </Badge>
            ) : (
              <Text size="small" leading="compact">
                -
              </Text>
            )}
          </div>
        </div>
      </PermissionGuard>
    </Container>
  )
}
