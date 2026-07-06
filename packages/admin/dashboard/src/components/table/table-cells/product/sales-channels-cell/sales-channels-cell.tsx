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

  // Filter out null/undefined entries that can occur when a sales channel
  // is deleted but the product association is not cleaned up
  const validChannels = salesChannels?.filter(
    (sc): sc is SalesChannelDTO => sc != null
  )

  if (!validChannels || !validChannels.length) {
    return <PlaceholderCell />
  }

  if (validChannels.length > 2) {
    return (
      <div className="flex h-full w-full items-center gap-x-1 overflow-hidden">
        <span className="truncate">
          {validChannels
            .slice(0, 2)
            .map((sc) => sc.name)
            .join(", ")}
        </span>
        <Tooltip
          content={
            <ul>
              {validChannels.slice(2).map((sc) => (
                <li key={sc.id}>{sc.name}</li>
              ))}
            </ul>
          }
        >
          <span className="text-xs">
            {t("general.plusCountMore", {
              count: validChannels.length - 2,
            })}
          </span>
        </Tooltip>
      </div>
    )
  }

  const channels = validChannels.map((sc) => sc.name).join(", ")

  return (
    <div className="flex h-full w-full max-w-[250px] items-center overflow-hidden">
      <span title={channels} className="truncate">
        {channels}
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
