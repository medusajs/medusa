import React from "react"
import clsx from "clsx"
import { formatAmountWithSymbol } from "../../../../utils/prices"

export const DisplayTotal = ({
  totalAmount,
  totalTitle,
  currency,
  variant = "regular",
  subtitle = "",
  totalColor = "text-grey-90",
}) => (
  <div className="flex justify-between mt-4 items-center">
    <div className="flex flex-col">
      <div
        className={clsx("text-grey-90", {
          "inter-small-regular": variant === "regular",
          "inter-small-semibold": variant === "large" || variant === "bold",
        })}
      >
        {totalTitle}
      </div>
      {subtitle && (
        <div className="inter-small-regular text-grey-50 mt-1">{subtitle}</div>
      )}
    </div>
    <DisplayTotalAmount
      totalAmount={totalAmount}
      currency={currency}
      variant={variant}
      totalColor={totalColor}
    />
  </div>
)

export const DisplayTotalAmount = ({
  totalColor = "text-grey-90",
  variant = "regular",
  totalAmount,
  currency,
}) => (
  <div className="flex">
    <div
      className={clsx(totalColor, {
        "inter-small-regular mr-3": variant === "regular",
        "inter-large-semibold": variant === "bold",
        "inter-xlarge-semibold": variant === "large",
      })}
    >
      {formatAmountWithSymbol({
        amount: totalAmount,
        currency,
      })}
    </div>
    {variant === "regular" && (
      <div className="inter-small-regular text-grey-50">
        {currency.toUpperCase()}
      </div>
    )}
  </div>
)
