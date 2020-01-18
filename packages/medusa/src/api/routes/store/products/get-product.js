import validator from "../../../../utils/validator"

export default async (req, res) => {
  const { productId } = req.params

  const schema = validator.objectId()
  const { value, error } = schema.validate(productId)

  if (error) {
    throw error
  }

  const productService = req.scope.resolve("productService")
  const product = await productService.getProduct(value)

  if (!product) {
    res.sendStatus(404)
    return
  }

  res.json(product)
}
