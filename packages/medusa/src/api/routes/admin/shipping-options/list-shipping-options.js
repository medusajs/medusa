import _ from "lodash"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  try {
    const query = _.pick(req.query, ["region_id", "is_return", "admin_only"])

    const optionService = req.scope.resolve("shippingOptionService")
    const data = await optionService.list(query, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ shipping_options: data })
  } catch (err) {
    throw err
  }
}
