import { Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { SalesChannelDTO } from "@medusajs/types"
import { PlaceholderCell } from "../../common/placeholder-cell"

type SalesChannelsCellProps = {
  salesChannels?: SalesChannelDTO[] | null
}

export const SalesChannelsCell = ({
  salesChannels,
}: SalesChannelsCellProps) => {
  const { t } = useTranslation()

  if (!salesChannels || !salesChannels.length) {
    return <PlaceholderCell />
  }

  if (salesChannels.length > 2) {
    return (
      <div className="flex h-full w-full items-center gap-x-1 overflow-hidden">
        <span className="truncate">
          {salesChannels
            .slice(0, 2)
            .map((sc) => sc.name)
            .join(", ")}
        </span>
        <Tooltip
          content={
            <ul>
              {salesChannels.slice(2).map((sc) => (
                <li key={sc.id}>{sc.name}</li>
              ))}
            </ul>
          }
        >
          <span className="text-xs">
            {t("general.plusCountMore", {
              count: salesChannels.length - 2,
            })}
          </span>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">
        {salesChannels.map((sc) => sc.name).join(", ")}
      </span>
    </div>
  )
}

export const SalesChannelHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span>{t("fields.salesChannels")}</span>
    </div>
  )
}
