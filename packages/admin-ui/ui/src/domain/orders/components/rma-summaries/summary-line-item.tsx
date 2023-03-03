import clsx from "clsx"
import Thumbnail from "../../../../components/atoms/thumbnail"
import { formatAmountWithSymbol } from "../../../../utils/prices"

type SummaryLineProps = {
  thumbnail?: string | null
  productTitle: string
  variantTitle: string
  quantity: number
  price: number
  total: number
  currencyCode: string
  isFree?: boolean
}

export const SummaryLineItem = ({
  thumbnail,
  productTitle,
  variantTitle,
  quantity,
  price,
  total,
  currencyCode,
  isFree = false,
}: SummaryLineProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-base">
        <div>
          <Thumbnail src={thumbnail} />
        </div>
        <div className="inter-small-regular">
          <p>{productTitle}</p>
          <p className="text-grey-50">{variantTitle}</p>
        </div>
      </div>
      <div className="inter-small-regular flex items-center gap-x-base">
        <p className="text-grey-40">
          {formatAmountWithSymbol({
            amount: price,
            currency: currencyCode,
          })}
        </p>
        <p className="text-grey-40">x {quantity}</p>
        <p
          className={clsx({
            "line-through": isFree,
          })}
        >
          {formatAmountWithSymbol({
            amount: total,
            currency: currencyCode,
          })}
        </p>
      </div>
    </div>
  )
}
