import { StockLocationExpandedDTO } from "@medusajs/medusa"
import SalesChannelsList from "../../../../../components/molecules/sales-channels-list"
import EditSalesChannels from "../edit-sales-channels"

const SalesChannelsSection = ({
  location,
}: {
  location: StockLocationExpandedDTO
}) => {
  return (
    <div className="py-base">
      <div className="flex items-center justify-between w-full">
        {!location.sales_channels?.length ? (
          <span className="inter-base-regular text-grey-40">
            Not connected to any sales channels yet
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
