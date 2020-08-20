import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    title: Validator.string().required(),
    description: Validator.string(),
    tags: Validator.string(),
    images: Validator.array().items(Validator.string()),
    variants: Validator.array().items(Validator.string()),
    metadata: Validator.object(),
    handle: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    let newProduct = await productService.createDraft(value)
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
    res.json({ product: newProduct })
  } catch (err) {
    throw err
  }
}
