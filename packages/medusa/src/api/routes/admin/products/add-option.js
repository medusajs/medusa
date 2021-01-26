import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().required(),
  })
  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")

    await productService.addOption(id, value.title)
    const product = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ product })
  } catch (err) {
    throw err
  }
}
