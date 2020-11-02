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
    let addOn = await addOnService.retrieveByProduct(value.product_id)
    addOn = await addOnService.decorate(
      addOn,
      ["name", "valid_for", "prices"],
      ["valid_for"]
    )

    res.json({ add_on: addOn })
  } catch (err) {
    throw err
  }
}
