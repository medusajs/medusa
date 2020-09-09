import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object({
    product_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(region_id)

  if (error) {
    throw error
  }

  try {
    const addOnService = req.scope.resolve("addOnService")
    const addOn = await addOnService.retrieveByProduct(value.product_id)
    res.json({ add_on: addOn })
  } catch (err) {
    throw err
  }
}
