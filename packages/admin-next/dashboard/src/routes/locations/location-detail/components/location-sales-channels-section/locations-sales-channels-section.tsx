import { Channels, PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
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

  const hasConnectedChannels = !!location.sales_channels?.length

  return (
    <Container className="flex flex-col px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">{t("stockLocations.salesChannels.header")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "sales-channels",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      {hasConnectedChannels ? (
        <div className="flex flex-col gap-y-4 pt-4">
          <div className="grid grid-cols-[28px_1fr] items-center gap-x-3">
            <IconAvatar>
              <Channels className="text-ui-fg-subtle" />
            </IconAvatar>
            <ListSummary
              n={3}
              className="text-ui-fg-base"
              inline
              list={location.sales_channels?.map((sc) => sc.name) ?? []}
            />
          </div>
          <Text className="text-ui-fg-subtle" size="small" leading="compact">
            {t("stockLocations.salesChannels.connectedTo", {
              count: location.sales_channels?.length,
              total: count,
            })}
          </Text>
        </div>
      ) : (
        <NoRecords
          className="h-fit pb-2 pt-6"
          action={{
            label: t("stockLocations.salesChannels.action"),
            to: "sales-channels",
          }}
          message={t("stockLocations.salesChannels.noChannels")}
        />
      )}
    </Container>
  )
}

export default LocationsSalesChannelsSection
