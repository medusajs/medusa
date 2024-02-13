import { useTranslation } from "react-i18next"
import { DateCell } from "../../common/date-cell"

type FirstSeenCellProps = {
  createdAt: Date
}

export const FirstSeenCell = ({ createdAt }: FirstSeenCellProps) => {
  return <DateCell date={createdAt} />
}

export const FirstSeenHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("customers.firstSeen")}</span>
    </div>
  )
}
