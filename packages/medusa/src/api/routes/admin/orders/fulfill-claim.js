import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id, claim_id } = req.params

  const schema = Validator.object().keys({
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const claimService = req.scope.resolve("claimService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      await claimService
        .withTransaction(manager)
        .createFulfillment(claim_id, value.metadata)
    })

    const order = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
