import { MedusaError } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"
import { AddressDTO } from "../../types"

type AttachAddressDTO = {
  shipping_address_id?: string
  billing_address_id?: string
}

type HandlerInputData = {
  cart: AttachAddressDTO & {
    billing_address?: AddressDTO
    shipping_address?: AddressDTO
  }
  cartRegion: {
    region_id?: string
  }
}

enum Aliases {
  Cart = "cart",
  CartRegion = "cartRegion",
}

export async function attachAddressesToCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<AttachAddressDTO> {
  const regionService = container.resolve("regionService")
  const addressRepository = container.resolve("addressRepository")
  const shippingAddress = data[Aliases.Cart].shipping_address
  const shippingAddressId = data[Aliases.Cart].shipping_address_id
  const billingAddress = data[Aliases.Cart].billing_address
  const billingAddressId = data[Aliases.Cart].billing_address_id
  const addressesDTO: AttachAddressDTO = {}

  const region = await regionService.retrieve(
    data[Aliases.CartRegion].region_id,
    {
      relations: ["countries"],
    }
  )

  const regionCountries = region.countries.map(({ iso_2 }) => iso_2)

  if (!shippingAddress && !shippingAddressId) {
    if (region.countries.length === 1) {
      const shippingAddress = addressRepository.create({
        country_code: regionCountries[0],
      })

      addressesDTO.shipping_address_id = shippingAddress?.id
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

    if (
      address?.country_code &&
      !regionCountries.includes(address.country_code)
    ) {
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
