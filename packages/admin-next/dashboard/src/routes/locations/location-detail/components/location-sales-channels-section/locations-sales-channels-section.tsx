import { Channels, PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { ListSummary } from "../../../../../components/common/list-summary"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"

type LocationsSalesChannelsSectionProps = {
  location: HttpTypes.AdminStockLocation
}

function LocationsSalesChannelsSection({
  location,
}: LocationsSalesChannelsSectionProps) {
  const { t } = useTranslation()
  const { count } = useSalesChannels({ limit: 1, fields: "id" })

  const noChannels = !location.sales_channels?.length

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">{t("location.salesChannels.title")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "sales-channels/edit",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-[28px_1fr] items-center gap-x-3">
        <IconAvatar>
          <Channels className="text-ui-fg-subtle" />
        </IconAvatar>
        {noChannels ? (
          <Text size="small" leading="compact">
            {t("location.salesChannels.placeholder")}
          </Text>
        ) : (
          <ListSummary
            n={3}
            className="text-ui-fg-base"
            inline
            list={location.sales_channels?.map((sc) => sc.name) ?? []}
          />
        )}
      </div>
      <Text className="text-ui-fg-subtle" size="small" leading="compact">
        {t("location.connectedToSalesChannels", {
          to: location.sales_channels?.length,
          of: count,
        })}
      </Text>
    </Container>
  )
}

export default LocationsSalesChannelsSection
