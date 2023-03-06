import clsx from "clsx"
import CopyToClipboard from "../../../../components/atoms/copy-to-clipboard"
import Thumbnail from "../../../../components/atoms/thumbnail"
import { formatAmountWithSymbol } from "../../../../utils/prices"

type SummaryLineProps = {
  thumbnail?: string | null
  productTitle: string
  variantTitle: string
  quantity: number
  price: number
  total: number
  sku?: string | null
  currencyCode: string
  isFree?: boolean
}

export const SummaryLineItem = ({
  thumbnail,
  productTitle,
  variantTitle,
  sku,
  quantity,
  price,
  total,
  currencyCode,
  isFree = false,
}: SummaryLineProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="gap-x-base flex items-center">
        <div>
          <Thumbnail src={thumbnail} />
        </div>
        <div className="inter-small-regular">
          <div className="gap-x-2xsmall flex items-center">
            <p>{productTitle}</p>
            {variantTitle && <p className="text-grey-50">({variantTitle})</p>}
          </div>
          {sku && (
            <span>
              <CopyToClipboard value={sku} displayValue={sku} iconSize={14} />
            </span>
          )}
        </div>
      </div>
      <div className="inter-small-regular gap-x-base flex items-center">
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
