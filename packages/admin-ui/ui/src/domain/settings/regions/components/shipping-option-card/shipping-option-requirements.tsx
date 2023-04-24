import { ShippingOption, ShippingOptionRequirement } from "@medusajs/medusa"
import React, { FC } from "react"
import { stringDisplayPrice } from "../../../../../utils/prices"

export const ShippingOptionRequirements: FC<{ option: ShippingOption }> = ({
  option,
}) => {
  const minWeight = option.requirements.find((r) => r.type === "min_weight")
  const maxWeight = option.requirements.find((r) => r.type === "max_weight")
  const minSubtotal = option.requirements.find((r) => r.type === "min_subtotal")
  const maxSubtotal = option.requirements.find((r) => r.type === "max_subtotal")

  return (
    <>
      {!!minSubtotal && (
        <Requirement
          name={"Min. Subtotal"}
          requirement={minSubtotal}
          option={option}
        />
      )}
      {!!maxSubtotal && (
        <Requirement
          name={"Max. Subtotal"}
          requirement={maxSubtotal}
          option={option}
        />
      )}
      {!!minWeight && (
        <Requirement
          name={"Min. Weight"}
          requirement={minWeight}
          option={option}
        />
      )}
      {!!maxWeight && (
        <Requirement
          name={"Max. Weight"}
          requirement={maxWeight}
          option={option}
        />
      )}
    </>
  )
}

const Requirement: FC<{
  requirement: ShippingOptionRequirement
  name: string
  option: ShippingOption
}> = ({ requirement: { type, amount }, option, name }) => {
  const displayAmount =
    type === "min_subtotal" || type == "max_subtotal"
      ? stringDisplayPrice({
          amount: amount,
          currencyCode: option.region.currency_code,
        })
      : `${amount} oz`

  return (
    <>
      - {name}: {displayAmount}{" "}
    </>
  )
}
