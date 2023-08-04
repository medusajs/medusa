import { MedusaError } from "@medusajs/utils"

import { AddressDTO } from "../../types"
import { WorkflowArguments } from "../../helper"

type AttachAddressDTO = {
  shipping_address?: AddressDTO
  shipping_address_id?: string
  billing_address_id?: string
}

enum Aliases {
  Cart = "cart",
  CartRegion = "cartRegion",
}

export async function attachAddressesToCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<AttachAddressDTO> {
  const regionService = container.resolve("regionService")
  const addressRepository = container.resolve("addressRepository")
  const shippingAddress = data[Aliases.Cart].shipping_address
  const shippingAddressId = data[Aliases.Cart].shipping_address_id
  const billingAddress = data[Aliases.Cart].billing_address
  const billingAddressId = data[Aliases.Cart].billing_address_id
  const addressesDTO: AttachAddressDTO = {}

  const region = await regionService
    .retrieve(data[Aliases.CartRegion].region_id!, {
      relations: ["countries"],
    })

  const regionCountries = region.countries.map(({ iso_2 }) => iso_2)

  if (!shippingAddress && !shippingAddressId) {
    if (region.countries.length === 1) {
      addressesDTO.shipping_address = addressRepository.create({
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

      addressesDTO.shipping_address_id = address.id
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

    addressesDTO.billing_address_id = billingAddressId
  }

  return addressesDTO
}

attachAddressesToCart.aliases = Aliases
