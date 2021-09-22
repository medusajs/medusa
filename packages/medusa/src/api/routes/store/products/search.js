import { Validator, MedusaError } from "medusa-core-utils"
import ProductService from "../../../../services/product"

export default async (req, res) => {
  const schema = Validator.object()
    .keys({
      q: Validator.string().required(),
    })
    .options({ allowUnknown: true })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const { q, ...options } = value

    const searchService = req.scope.resolve("searchService")

    const results = await searchService.search(
      ProductService.IndexName,
      q,
      options
    )

    res.status(200).send(results)
  } catch (error) {
    throw error
  }
}
