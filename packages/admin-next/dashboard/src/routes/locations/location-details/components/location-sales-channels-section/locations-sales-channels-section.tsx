import { Channels, PencilSquare } from "@medusajs/icons"
import { StockLocationDTO } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { ListSummary } from "../../../../../components/common/list-summary"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"

type Props = {
  location: StockLocationDTO
}

function LocationsSalesChannelsSection({ location }: Props) {
  const { t } = useTranslation()
  const { count } = useSalesChannels()

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
        <div className="bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
          <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
            <Channels className="text-ui-fg-subtle" />
          </div>
        </div>
        {noChannels ? (
          <Text size="small" leading="compact">
            {t("location.salesChannels.placeholder")}
          </Text>
        ) : (
          <ListSummary
            n={3}
            className="text-ui-fg-base"
            inline
            list={location.sales_channels.map((sc) => sc.name)}
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
