import { Text, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../hooks/use-date"

type DateRangeDisplayProps = {
  startsAt?: Date | string | null
  endsAt?: Date | string | null
  showTime?: boolean
}

export const DateRangeDisplay = ({
  startsAt,
  endsAt,
  showTime = false,
}: DateRangeDisplayProps) => {
  const startDate = startsAt ? new Date(startsAt) : null
  const endDate = endsAt ? new Date(endsAt) : null

  const { t } = useTranslation()
  const { getFullDate } = useDate()

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="shadow-elevation-card-rest bg-ui-bg-component text-ui-fg-subtle flex items-center gap-x-3 rounded-md px-3 py-1.5">
        <Bar date={startDate} />
        <div>
          <Text weight="plus" size="small">
            {t("fields.startDate")}
          </Text>
          <Text size="small">
            {startDate
              ? getFullDate({
                  date: startDate,
                  includeTime: showTime,
                })
              : "-"}
          </Text>
        </div>
      </div>

      <div className="shadow-elevation-card-rest bg-ui-bg-component text-ui-fg-subtle flex items-center gap-x-3 rounded-md px-3 py-1.5">
        <Bar date={endDate} />
        <div>
          <Text size="small" weight="plus">
            {t("fields.endDate")}
          </Text>
          <Text size="small">
            {endDate
              ? getFullDate({
                  date: endDate,
                  includeTime: showTime,
                })
              : "-"}
          </Text>
        </div>
      </div>
    </div>
  )
}

const Bar = ({ date }: { date: Date | null }) => {
  const now = new Date()

  const isDateInFuture = date && date > now

  return (
    <div
      className={clx("bg-ui-tag-neutral-icon h-8 w-1 rounded-full", {
        "bg-ui-tag-orange-icon": isDateInFuture,
      })}
    />
  )
}
