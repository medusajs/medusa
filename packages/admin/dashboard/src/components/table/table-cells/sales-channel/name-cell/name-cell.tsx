import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../common/placeholder-cell"

type NameCellProps = {
  name?: string | null
}

export const NameCell = ({ name }: NameCellProps) => {
  if (!name) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{name}</span>
    </div>
  )
}

export const NameHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.name")}</span>
    </div>
  )
}
