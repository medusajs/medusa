import { SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels } from "medusa-react"
import React from "react"
import Tooltip from "../../atoms/tooltip"
import Badge from "../../fundamentals/badge"
import { useTranslation } from "react-i18next"

type Props = {
  channels?: SalesChannel[]
}

const SalesChannelsDisplay = ({ channels = [] }: Props) => {
  const { count } = useAdminSalesChannels()
  const remainder = Math.max(channels.length - 3, 0)
  const { t } = useTranslation()
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
                  + {remainder} {t("more")}
                </div>
              </Badge>
            </Tooltip>
          )}
        </div>
      )}
      <p className="inter-base-regular text-grey-50">
        {t("Available in")}{" "}
        <span className="inter-base-semibold text-grey-90">
          {channels.length ? channels.length : 0}
        </span>{" "}
        {t("out of")}{" "}
        <span className="inter-base-semibold text-grey-90">{count || 0}</span>{" "}
        {t("Sales Channels")}
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
