import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    title: Validator.string().required(),
    handle: Validator.string()
      .optional()
      .allow(""),
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

    const created = await productCollectionService.create(value)
    const collection = await productCollectionService.retrieve(created.id)

    res.status(200).json({ collection })
  } catch (err) {
    throw err
  }
}
