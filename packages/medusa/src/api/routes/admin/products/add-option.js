import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    optionTitle: Validator.string().required(),
  })
  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.retrieve(id)
    await productService.addOption(product._id, value.optionTitle)
    const newProduct = await productService.retrieve(product.id)
    res.json(newProduct)
  } catch (err) {
    throw err
  }
}
