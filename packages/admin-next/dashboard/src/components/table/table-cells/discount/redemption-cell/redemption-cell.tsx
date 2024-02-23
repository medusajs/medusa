import { useTranslation } from "react-i18next"

type DiscountCellProps = {
  redemptions: number
}

export const RedemptionCell = ({ redemptions }: DiscountCellProps) => {
  return (
    <div className="flex h-full w-full items-center justify-end gap-x-3">
      <span>{redemptions}</span>
    </div>
  )
}

export const RedemptionHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center justify-end">
      <span>{t("fields.totalRedemptions")}</span>
    </div>
  )
}
