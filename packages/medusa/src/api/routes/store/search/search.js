import { Validator, MedusaError } from "medusa-core-utils"
import { INDEX_NS } from "../../../../utils/index-ns"

export default async (req, res) => {
  const schema = Validator.object()
    .keys({
      q: Validator.string().required(),
      indexName: Validator.string().required(),
    })
    .options({ allowUnknown: true })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const { q, indexName, ...options } = value

    const searchService = req.scope.resolve("searchService")

    const results = await searchService.search(
      `${INDEX_NS}_${indexName}`,
      q,
      options
    )

    res.status(200).send(results)
  } catch (error) {
    throw error
  }
}
