import { MedusaError, Validator } from "medusa-core-utils"

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

    const entityManager = req.scope.resolve("manager")

    await entityManager(async manager => {
      const product = await productService
        .withTransaction(manager)
        .addOption(id, value.title)

      res.json({ product })
    })
  } catch (err) {
    throw err
  }
}
