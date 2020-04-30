import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id, optionId } = req.params

  const schema = Validator.object().keys({
    title: Validator.string(),
    values: Validator.array().items(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.retrieve(id)

    await productService.updateOption(product._id, optionId, value)

    let newProduct = await productService.retrieve(product._id)
    newProduct = await productService.decorate(newProduct, [
      "title",
      "description",
      "tags",
      "handle",
      "images",
      "options",
      "variants",
      "published",
    ])

    res.json(newProduct)
  } catch (err) {
    throw err
  }
}
