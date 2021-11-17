import { MedusaError, Validator } from "medusa-core-utils"
import ProductService from "../../../../services/product"

export default async (req, res) => {
  const schema = Validator.object()
    .keys({
      q: Validator.string().required().allow(""),
      offset: Validator.number().optional(),
      limit: Validator.number().optional(),
      filter: Validator.any(),
    })
    .options({ allowUnknown: true })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const { q, offset, limit, filter, ...options } = value
  const paginationOptions = { offset, limit }

  const searchService = req.scope.resolve("searchService")

  const results = await searchService.search(ProductService.IndexName, q, {
    paginationOptions,
    filter,
    additionalOptions: options,
  })

  res.status(200).send(results)
}
