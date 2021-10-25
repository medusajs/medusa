import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

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

  const productService = req.scope.resolve("productService")
  await productService.update(id, {
    metadata: { [value.key]: value.value },
  })

  const product = await productService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ product })
}
