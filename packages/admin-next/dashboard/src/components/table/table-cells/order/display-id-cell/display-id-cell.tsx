import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../common/placeholder-cell"

export const DisplayIdCell = ({ displayId }: { displayId?: number | null }) => {
  if (!displayId) {
    return <PlaceholderCell />
  }

  return (
    <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
      <span className="truncate">#{displayId}</span>
    </div>
  )
}

export const DisplayIdHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.order")}</span>
    </div>
  )
}
