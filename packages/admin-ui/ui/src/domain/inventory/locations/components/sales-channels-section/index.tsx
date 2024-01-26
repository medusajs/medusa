import { StockLocationExpandedDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import SalesChannelsList from "../../../../../components/molecules/sales-channels-list"
import EditSalesChannels from "../edit-sales-channels"

const SalesChannelsSection = ({
  location,
}: {
  location: StockLocationExpandedDTO
}) => {
  const { t } = useTranslation()
  return (
    <div className="py-base">
      <div className="flex w-full items-center justify-between">
        {!location.sales_channels?.length ? (
          <span className="inter-base-regular text-grey-40">
            {t(
              "sales-channels-section-not-connected-to-any-sales-channels-yet",
              "Not connected to any sales channels yet"
            )}
          </span>
        ) : (
          <SalesChannelsList salesChannels={location.sales_channels} />
        )}
        <EditSalesChannels location={location} />
      </div>
    </div>
  )
}

export default SalesChannelsSection
