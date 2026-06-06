import { Tooltip } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../../../hooks/use-date"
import { PlaceholderCell } from "../placeholder-cell"

type DateCellProps = {
  date: Date | string | undefined
}

export const CreatedAtCell = ({ date }: DateCellProps) => {
  const { getFullDate } = useDate()

  if (!date) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <Tooltip
        className="z-10"
        content={
          <span className="text-pretty">{`${getFullDate({
            date,
            includeTime: true,
          })}`}</span>
        }
      >
        <span className="truncate">
          {getFullDate({ date, includeTime: true })}
        </span>
      </Tooltip>
    </div>
  )
}

export const CreatedAtHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.createdAt")}</span>
    </div>
  )
}
