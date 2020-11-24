import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    key: Validator.string().required(),
    value: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    let product = await productService.setMetadata(id, value.key, value.value)
    product = await productService.decorate(
      product,
      [
        "title",
        "description",
        "is_giftcard",
        "tags",
        "thumbnail",
        "handle",
        "images",
        "options",
        "published",
      ],
      ["variants"]
    )

    res.status(200).json({ product })
  } catch (err) {
    throw err
  }
}
