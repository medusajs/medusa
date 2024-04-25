import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { StockLocationDTO } from "@medusajs/types"

import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { NoRecords } from "../../../../../components/common/empty-table-content"

type Props = {
  location: StockLocationDTO
}

function LocationsSalesChannelsSection({ location }: Props) {
  const { t } = useTranslation()

  // TODO: we should be able to get this relation with the location
  const { sales_channels, isPending } = useSalesChannels({
    location_id: location.id,
  })

  const noChannels = !isPending && !sales_channels?.length

  return (
    <div className="shadow-elevation-card-rest rounded-md bg-white p-4">
      <Heading level="h2">{t("shipping.salesChannels.title")}</Heading>
      {noChannels && (
        <NoRecords
          className="h-fit py-8"
          message={t("shipping.salesChannels.placeholder")}
          action={{
            label: t("shipping.salesChannels.connectChannels"),
            to: `/settings/shipping/${location.id}/sales-channels/edit`,
          }}
        />
      )}
    </div>
  )
}

export default LocationsSalesChannelsSection
