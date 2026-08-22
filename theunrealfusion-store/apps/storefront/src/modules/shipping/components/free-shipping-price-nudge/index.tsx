"use client"

import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, XMark } from "@medusajs/icons"
import {
  HttpTypes,
  StoreCart,
  StoreCartShippingOption,
  StorePrice,
} from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, clx } from "@modules/common/components/ui"
import { useState } from "react"
import { StoreFreeShippingPrice } from "types/global"

const computeTarget = (
  cart: HttpTypes.StoreCart,
  price: HttpTypes.StorePrice
) => {
  const priceRule = (price.price_rules || []).find(
    (pr) => pr.attribute === "item_total"
  )!

  const currentAmount = cart.item_total
  const targetAmount = parseFloat(priceRule.value)

  if (priceRule.operator === "gt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount + 1 - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "gte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount + 1 - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount === targetAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  }
}

export default function ShippingPriceNudge({
  variant = "inline",
  cart,
  shippingOptions,
}: {
  variant?: "popup" | "inline"
  cart: StoreCart
  shippingOptions: StoreCartShippingOption[]
}) {
  if (!cart || !shippingOptions?.length) {
    return
  }

  // Check if any shipping options have a conditional price based on item_total
  const freeShippingPrice = shippingOptions
    .map((shippingOption) => {
      const calculatedPrice = shippingOption.calculated_price

      if (!calculatedPrice) {
        return
      }

      // Get all prices that are:
      // 1. Currency code is same as the cart's
      // 2. Have a rule that is set on item_total
      const validCurrencyPrices = shippingOption.prices.filter(
        (price) =>
          price.currency_code === cart.currency_code &&
          (price.price_rules || []).some(
            (priceRule) => priceRule.attribute === "item_total"
          )
      )

      return validCurrencyPrices.map((price) => {
        return {
          ...price,
          shipping_option_id: shippingOption.id,
          ...computeTarget(cart, price),
        }
      })
    })
    .flat(1)
    .filter(Boolean)
    // We focus here entirely on free shipping, but this can be edited to handle multiple layers
    // of reduced shipping prices.
    .find((price) => price?.amount === 0)

  if (!freeShippingPrice) {
    return
  }

  if (variant === "popup") {
    return <FreeShippingPopup cart={cart} price={freeShippingPrice} />
  } else {
    return <FreeShippingInline cart={cart} price={freeShippingPrice} />
  }
}

function FreeShippingInline({
  cart,
  price,
}: {
  cart: StoreCart
  price: StorePrice & {
    target_reached: boolean
    target_remaining: number
    remaining_percentage: number
  }
}) {
  return (
    <div className="bg-neutral-100 p-2 rounded-lg border">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-neutral-600">
          <div>
            {price.target_reached ? (
              <div className="flex items-center gap-1.5">
                {" "}
                <CheckCircleSolid className="text-green-500 inline-block" />{" "}
                Free Shipping unlocked!
              </div>
            ) : (
              `Unlock Free Shipping`
            )}
          </div>

          <div
            className={clx("visible", {
              "opacity-0 invisible": price.target_reached,
            })}
          >
            Only{" "}
            <span className="text-neutral-950">
              {convertToLocale({
                amount: price.target_remaining,
                currency_code: cart.currency_code,
              })}
            </span>{" "}
            away
          </div>
        </div>
        <div className="flex justify-between gap-1">
          <div
            className={clx(
              "bg-gradient-to-r from-zinc-400 to-zinc-500 h-1 rounded-full max-w-full duration-500 ease-in-out",
              {
                "from-green-400 to-green-500": price.target_reached,
              }
            )}
            style={{ width: `${price.remaining_percentage}%` }}
          ></div>
          <div className="bg-neutral-300 h-1 rounded-full w-fit flex-grow"></div>
        </div>
      </div>
    </div>
  )
}

function FreeShippingPopup({
  cart,
  price,
}: {
  cart: StoreCart
  price: StoreFreeShippingPrice
}) {
  const [isClosed, setIsClosed] = useState(false)

  return (
    <div
      className={clx(
        "fixed bottom-5 right-5 flex flex-col items-end gap-2 transition-all duration-500 ease-in-out z-10",
        {
          "opacity-0 invisible delay-1000": price.target_reached,
          "opacity-0 invisible": isClosed,
          "opacity-100 visible": !price.target_reached && !isClosed,
        }
      )}
    >
      <div>
        <Button
          className="rounded-full bg-neutral-900 shadow-none outline-none border-none text-[15px] p-2"
          onClick={() => setIsClosed(true)}
        >
          <XMark />
        </Button>
      </div>

      <div className="w-[400px] bg-black text-white p-6 rounded-lg ">
        <div className="pb-4">
          <div className="space-y-3">
            <div className="flex justify-between text-[15px] text-neutral-400">
              <div>
                {price.target_reached ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircleSolid className="text-green-500 inline-block" />{" "}
                    Free Shipping unlocked!
                  </div>
                ) : (
                  `Unlock Free Shipping`
                )}
              </div>

              <div
                className={clx("visible", {
                  "opacity-0 invisible": price.target_reached,
                })}
              >
                Only{" "}
                <span className="text-white">
                  {convertToLocale({
                    amount: price.target_remaining,
                    currency_code: cart.currency_code,
                  })}
                </span>{" "}
                away
              </div>
            </div>
            <div className="flex justify-between gap-1">
              <div
                className={clx(
                  "bg-gradient-to-r from-zinc-400 to-zinc-500 h-1.5 rounded-full max-w-full duration-500 ease-in-out",
                  {
                    "from-green-400 to-green-500": price.target_reached,
                  }
                )}
                style={{ width: `${price.remaining_percentage}%` }}
              ></div>
              <div className="bg-zinc-600 h-1.5 rounded-full w-fit flex-grow"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <LocalizedClientLink
            className="rounded-2xl bg-transparent shadow-none outline-none border-[1px] border-white text-[15px] py-2.5 px-4"
            href="/cart"
          >
            View cart
          </LocalizedClientLink>

          <LocalizedClientLink
            className="flex-grow rounded-2xl bg-white text-neutral-950 shadow-none outline-none border-[1px] border-white text-[15px] py-2.5 px-4 text-center"
            href="/store"
          >
            View products
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
