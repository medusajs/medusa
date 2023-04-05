import React from "react"
import Button from "../../fundamentals/button"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { AmountInput } from "../amount-input"

type RMAShippingPriceProps = {
  inclTax: boolean
  useCustomShippingPrice: boolean
  shippingPrice: number | undefined
  currencyCode: string
  updateShippingPrice: (price: number | undefined) => void
  setUseCustomShippingPrice: (useCustomShippingPrice: boolean) => void
}

const RMAShippingPrice: React.FC<RMAShippingPriceProps> = ({
  useCustomShippingPrice,
  inclTax,
  shippingPrice,
  currencyCode,
  updateShippingPrice,
  setUseCustomShippingPrice,
}) => {
  return useCustomShippingPrice ? (
    <div className="gap-x-base mt-4 flex w-full items-end">
      <AmountInput
        label={`Shipping price (${inclTax ? "incl. tax" : "excl. tax"})`}
        currencyCode={currencyCode}
        onChange={(amount) => updateShippingPrice(amount ?? 0)}
        value={shippingPrice}
      />
      <Button
        onClick={() => setUseCustomShippingPrice(false)}
        className="text-grey-40 h-10 w-10"
        variant="ghost"
        size="small"
      >
        <TrashIcon size={20} />
      </Button>
    </div>
  ) : (
    <div className="mt-4 flex w-full justify-end">
      <Button
        onClick={() => setUseCustomShippingPrice(true)}
        variant="ghost"
        className="border-grey-20 border"
        size="small"
      >
        Add custom price
      </Button>
    </div>
  )
}

export default RMAShippingPrice
