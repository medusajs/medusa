import _ from "lodash"

export default async (req, res) => {
  try {
    const query = _.pick(req.query, ["region_id", "region_id[]", "is_return"])

    const optionService = req.scope.resolve("shippingOptionService")
    const data = await optionService.list(query)

    res.status(200).json({ shipping_options: data })
  } catch (err) {
    throw err
  }
}
