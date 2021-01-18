export default async (req, res) => {
  const { region_id } = req.params

  try {
    const fulfillmentProviderService = req.scope.resolve(
      "fulfillmentProviderService"
    )
    const regionService = req.scope.resolve("regionService")
    const region = await regionService.retrieve(region_id, {
      relations: ["fulfillment_providers"],
    })

    const fpsIds = region.fulfillment_providers.map(fp => fp.id) || []

    const options = await fulfillmentProviderService.listFulfillmentOptions(
      fpsIds
    )

    res.status(200).json({
      fulfillment_options: options,
    })
  } catch (err) {
    throw err
  }
}
