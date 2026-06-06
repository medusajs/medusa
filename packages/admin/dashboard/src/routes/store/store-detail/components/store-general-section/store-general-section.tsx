import { PencilSquare } from "@zjedene-medusa/icons"
import { AdminStore } from "@zjedene-medusa/types"
import { Badge, Container, Heading, Text } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"

import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useSalesChannel, useStockLocation } from "../../../../../hooks/api"
import { useRegion } from "../../../../../hooks/api/regions"

type StoreGeneralSectionProps = {
  store: AdminStore
}

export const StoreGeneralSection = ({ store }: StoreGeneralSectionProps) => {
  const { t } = useTranslation()

  const { region } = useRegion(store.default_region_id!, undefined, {
    enabled: !!store.default_region_id,
  })

  const defaultCurrency = store.supported_currencies?.find((c) => c.is_default)

  const { sales_channel } = useSalesChannel(store.default_sales_channel_id!, {
    enabled: !!store.default_sales_channel_id,
  })

  const { stock_location } = useStockLocation(
    store.default_location_id!,
    {
      fields: "id,name",
    },
    {
      enabled: !!store.default_location_id,
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
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {store.name}
        </Text>
      </div>
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
    </Container>
  )
}
