export default async (req, res) => {
  const { region_id } = req.params
  const regionService = req.scope.resolve("regionService")
  const region = await regionService.retrieve(region_id, {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
  })

  res.json({ region })
}
