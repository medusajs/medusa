import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string(),
    description: Validator.string(),
    tags: Validator.string(),
    images: Validator.array().items(Validator.string()),
    variants: Validator.array().items(Validator.string()),
    metadata: Validator.object(),
    handle: Validator.string(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const productService = req.scope.resolve("productService")
  const oldProduct = await productService.retrieve(id)
  if (!oldProduct) {
    res.sendStatus(404)
    return
  }

  try {
    await productService.update(oldProduct._id, value)
    const newProduct = await productService.retrieve(oldProduct._id)
    // Return the created product draft
    res.json(newProduct)
  } catch (err) {
    throw err
  }
}
