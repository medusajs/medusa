import { useTranslation } from "react-i18next"

export const DisplayIdCell = ({ displayId }: { displayId: number }) => {
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
