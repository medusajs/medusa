import { SalesChannel } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

export const SalesChannelCell = ({
  channel,
}: {
  channel: SalesChannel | null
}) => {
  if (!channel) {
    return <span className="text-ui-fg-muted">-</span>
  }

  const { name } = channel

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{name}</span>
    </div>
  )
}

export const SalesChannelHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.salesChannel")}</span>
    </div>
  )
}
