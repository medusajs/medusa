import { useTranslation } from "react-i18next"
import CornerDownRightIcon from "../../../../components/fundamentals/icons/corner-down-right-icon"
import { formatAmountWithSymbol } from "../../../../utils/prices"

type ShippingLineProps = {
  type: "return" | "replacement"
  title: string
  price?: number
  currencyCode: string
}

export const SummaryShippingLine = ({
  type,
  title,
  price,
  currencyCode,
}: ShippingLineProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between">
      <div className="gap-x-base flex items-center">
        <div className=" rounded-rounded text-grey-50 flex h-10 w-[30px] items-center justify-center">
          <CornerDownRightIcon size={16} />
        </div>
        <div className="inter-small-regular">
          <p>
            {type === "return" ? "Return shipping" : "Replacement shipping"}
          </p>
          <p className="text-grey-50">{title}</p>
        </div>
      </div>

      <p className="inter-small-regular">
        {price
          ? formatAmountWithSymbol({
              amount: price,
              currency: currencyCode,
            })
          : t("rma-summaries-free", "Free")}
      </p>
    </div>
  )
}
