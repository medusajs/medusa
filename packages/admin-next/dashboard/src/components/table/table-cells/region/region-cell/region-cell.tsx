import { useTranslation } from "react-i18next"

type RegionCellProps = {
  name: string
}

export const RegionCell = ({ name }: RegionCellProps) => {
  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{name}</span>
    </div>
  )
}

export const RegionHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.name")}</span>
    </div>
  )
}
