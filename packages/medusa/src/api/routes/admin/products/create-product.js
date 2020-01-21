import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  try {
    const variantService = req.scope.resolve("productVariantService")
  } catch (err) {
    console.log(err)
  }

  res.sendStatus(200)
}
