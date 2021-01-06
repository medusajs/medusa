import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id, option_id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().required,
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")

    const product = await productService.updateOption(id, option_id, value)

    res.json({ product })
  } catch (err) {
    throw err
  }
}
