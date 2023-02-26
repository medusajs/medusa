import { SalesChannel } from "@medusajs/medusa"
import Tooltip from "../../atoms/tooltip"
import IconBadge from "../../fundamentals/icon-badge"
import ChannelsIcon from "../../fundamentals/icons/channels-icon"

type Props = {
  salesChannels: SalesChannel[]
  showMax?: number
}

const SalesChannelsList = ({ salesChannels, showMax = 3 }: Props) => {
  const truncateSalesChannels = salesChannels.length > showMax
  return (
    <div className="flex items-center py-1">
      <IconBadge className="mr-4">
        <ChannelsIcon />
      </IconBadge>
      {salesChannels
        .slice(0, showMax)
        .map((salesChannel, index, slicedArray) => (
          <span className="ml-1 inter-base-regular text-grey-90 first-of-type:ml-0">
            {salesChannel.name}
            {index < slicedArray.length - 1 && ", "}
          </span>
        ))}
      {truncateSalesChannels && (
        <Tooltip
          content={
            <>
              {salesChannels.slice(showMax).map((channel) => (
                <div className="inter-small-regular">{channel.name}</div>
              ))}
            </>
          }
          side="top"
        >
          <span className="ml-1 text-grey-50">
            + {salesChannels.length - showMax} more
          </span>
        </Tooltip>
      )}
    </div>
  )
}

export default SalesChannelsList
