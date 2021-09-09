import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object()
    .keys({
      q: Validator.string().required(),
    })
    .options({ allowUnknown: true })

  const { value, error } = schema.validate(req.body)
  if (error) {
    console.log({ error })
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const { q, ...options } = value

    const meiliSearchService = req.scope.resolve("meilisearchService")

    const results = await meiliSearchService.search(q, options)

    res.status(200).send(results)
  } catch (error) {
    throw error
  }
}
