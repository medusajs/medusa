import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.delete(id)
    res.json({})
  } catch (err) {
    throw err
  }
}
