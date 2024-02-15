import { ShippingProfileType } from "@medusajs/utils"
import { LoaderOptions } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export async function createDefaultShippingProfilesLoader({
  container,
}: LoaderOptions) {
  const shippingProfilesData = [
    {
      name: "Default shipping profile",
      type: ShippingProfileType.DEFAULT,
    },
    {
      type: ShippingProfileType.GIFT_CARD,
      name: "Gift card shipping profile",
    },
  ]

  const service = container.resolve(ModuleRegistrationName.FULFILLMENT)
  const shippingProfiles = await service.listShippingProfiles({
    type: { $in: [ShippingProfileType.DEFAULT, ShippingProfileType.GIFT_CARD] },
  })

  if (shippingProfiles.length) {
    return
  }

  await service.createShippingProfiles(shippingProfilesData)
}
