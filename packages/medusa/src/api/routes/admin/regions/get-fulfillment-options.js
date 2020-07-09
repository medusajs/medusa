import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { region_id } = req.params
  try {
    const fulfillmentProviderService = req.scope.resolve(
      "fulfillmentProviderService"
    )
    const regionService = req.scope.resolve("regionService")
    const region = await regionService.retrieve(region_id)

    const options = await fulfillmentProviderService.listFulfillmentOptions(
      region.fulfillment_providers || []
    )

    res.status(200).json({
      fulfillment_options: options,
    })
  } catch (err) {
    throw err
  }
}
