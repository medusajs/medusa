import { Heading, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { StockLocationDTO } from "@medusajs/types"
import { Channels, PencilSquare } from "@medusajs/icons"

import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { ListSummary } from "../../../../../components/common/list-summary"

type Props = {
  location: StockLocationDTO
}

function LocationsSalesChannelsSection({ location }: Props) {
  const { t } = useTranslation()
  const { count } = useSalesChannels()

  // TODO: we should be able to get this relation with the location
  const { sales_channels = [], isPending } = useSalesChannels({
    location_id: location.id,
    limit: 9999,
  })

  const noChannels = !isPending && !sales_channels?.length

  return (
    <div className="shadow-elevation-card-rest rounded-md bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <Heading level="h2">{t("shipping.salesChannels.title")}</Heading>
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
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("shipping.salesChannels.placeholder")}
          </Text>
        ) : (
          <ListSummary
            n={3}
            inline
            list={sales_channels.map((sc) => sc.name)}
          />
        )}
      </div>
      <Text className="text-ui-fg-subtle mt-4" size="small" leading="compact">
        {!isPending && (
          <Trans
            i18nKey="sales_channels.availableIn"
            values={{
              x: sales_channels.length,
              y: count,
            }}
            components={[
              <span
                key="x"
                className="text-ui-fg-base txt-compact-medium-plus"
              />,
              <span
                key="y"
                className="text-ui-fg-base txt-compact-medium-plus"
              />,
            ]}
          />
        )}
      </Text>
      {/*{noChannels && (*/}
      {/*  <NoRecords*/}
      {/*    className="h-fit py-8"*/}
      {/*    message={t("shipping.salesChannels.placeholder")}*/}
      {/*    action={{*/}
      {/*      label: t("shipping.salesChannels.connectChannels"),*/}
      {/*      to: `/settings/shipping/${location.id}/sales-channels/edit`,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  )
}

export default LocationsSalesChannelsSection
