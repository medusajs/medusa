import { SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels } from "medusa-react"
import React from "react"
import Tooltip from "../../atoms/tooltip"
import Badge from "../../fundamentals/badge"
import { Trans, useTranslation } from "react-i18next"

type Props = {
  channels?: SalesChannel[]
}

const SalesChannelsDisplay = ({ channels = [] }: Props) => {
  const { count } = useAdminSalesChannels()
  const remainder = Math.max(channels.length - 3, 0)
  const { t } = useTranslation()

  const availableChannelsCount = channels.length ? channels.length : 0
  const totalChannelsCount = count || 0
  return (
    <div className="gap-y-small flex flex-col">
      {channels.length > 0 && (
        <div className="flex gap-x-1">
          <div className="flex max-w-[600px] gap-x-1 overflow-clip">
            {channels.slice(0, 3).map((sc) => (
              <SalesChannelBadge key={sc.id} channel={sc} />
            ))}
          </div>
          {remainder > 0 && (
            <Tooltip
              content={
                <div className="flex flex-col">
                  {channels.slice(3).map((sc) => {
                    return <span key={sc.id}>{sc.name}</span>
                  })}
                </div>
              }
            >
              <Badge variant="ghost" className="px-3 py-1.5">
                <div className="inter-small-regular text-grey-50 flex h-full items-center">
                  + {remainder} more
                </div>
              </Badge>
            </Tooltip>
          )}
        </div>
      )}
      <p className="inter-base-regular text-grey-50">
        <Trans
          i18nKey="sales-channels-display-available-count"
          availableChannelsCount={availableChannelsCount}
          totalChannelsCount={totalChannelsCount}
        >
          Available in{" "}
          <span className="inter-base-semibold text-grey-90">
            {{ availableChannelsCount }}
          </span>{" "}
          out of{" "}
          <span className="inter-base-semibold text-grey-90">
            {{ totalChannelsCount }}
          </span>{" "}
          Sales Channels
        </Trans>
      </p>
    </div>
  )
}

type SalesChannelBadgeProps = {
  channel: SalesChannel
}

const SalesChannelBadge: React.FC<SalesChannelBadgeProps> = ({ channel }) => {
  return (
    <Badge variant="ghost" className="px-3 py-1.5">
      <div className="flex items-center">
        <span className="inter-small-regular text-grey-90">{channel.name}</span>
      </div>
    </Badge>
  )
}

export default SalesChannelsDisplay
