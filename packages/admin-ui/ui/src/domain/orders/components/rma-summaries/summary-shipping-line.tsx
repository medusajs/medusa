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
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-base">
        <div className=" w-[30px] h-10 rounded-rounded flex items-center justify-center text-grey-50">
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
          : "Free"}
      </p>
    </div>
  )
}
