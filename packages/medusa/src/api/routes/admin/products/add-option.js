import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    option_title: Validator.string().required(),
  })
  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const newProduct = await productService.addOption(id, value.option_title)

    const data = await productService.decorate(newProduct, [
      "title",
      "description",
      "tags",
      "handle",
      "images",
      "options",
      "variants",
      "published",
    ])
    res.json({ product: data })
  } catch (err) {
    throw err
  }
}
