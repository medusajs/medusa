import { useTranslation } from "react-i18next"

export const DisplayIdCell = ({ displayId }: { displayId: string }) => {
  return (
    <div className="w-full h-full overflow-hidden text-ui-fg-subtle txt-compact-small flex items-center">
      <span className="truncate">#{displayId}</span>
    </div>
  )
}

export const DisplayIdHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full flex items-center">
      <span className="truncate">{t("fields.order")}</span>
    </div>
  )
}
