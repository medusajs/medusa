import { isDefined } from "medusa-core-utils"
import { MedusaError } from "@medusajs/utils"

import { InputAlias } from "../../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function attachAddressesToCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const regionService = container.resolve("regionService")
  const addressRepository = container.resolve("addressRepository")
  const shippingAddress = data[InputAlias.Cart].shipping_address
  const shippingAddressId = data[InputAlias.Cart].shipping_address_id
  const billingAddress = data[InputAlias.Cart].billing_address
  const billingAddressId = data[InputAlias.Cart].billing_address_id

  const region = await regionService
    .retrieve(data[InputAlias.Cart].region_id!, {
      relations: ["countries"],
    })

  const regionCountries = region.countries.map(({ iso_2 }) => iso_2)

  if (!shippingAddress && !shippingAddressId) {
    if (region.countries.length === 1) {
      data[InputAlias.Cart].shipping_address = addressRepository.create({
        country_code: regionCountries[0],
      })
    }
  } else {
    if (shippingAddress) {
      if (!regionCountries.includes(shippingAddress.country_code!)) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Shipping country not in region"
        )
      }
    }

    if (shippingAddressId) {
      const address = await regionService.findOne({
        where: { id: shippingAddressId },
      })

      if (
        address?.country_code &&
        !regionCountries.includes(address.country_code)
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Shipping country not in region"
        )
      }

      data[InputAlias.Cart].shipping_address_id = address.id
    }
  }

  if (billingAddress) {
    if (!regionCountries.includes(billingAddress.country_code!)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Billing country not in region"
      )
    }
  }

  if (billingAddressId) {
    const address = await regionService.findOne({
      where: { id: billingAddressId },
    })

    if (address?.country_code && !regionCountries.includes(address.country_code)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Billing country not in region"
      )
    }

    data[InputAlias.Cart].billing_address_id = billingAddressId
  }

  return data[InputAlias.Cart]
}
