import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    handle: Validator.string().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productCollectionService = req.scope.resolve(
      "productCollectionService"
    )

    const updated = await productCollectionService.update(id, value)
    const collection = await productCollectionService.retrieve(updated.id)

    res.status(200).json({ collection })
  } catch (err) {
    throw err
  }
}
