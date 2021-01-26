import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { region_id } = req.params
  const schema = Validator.object().keys({
    provider_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.addPaymentProvider(region_id, value.provider_id)

    const data = await regionService.retrieve(region_id, {
      select: defaultFields,
      relations: defaultRelations,
    })
    res.status(200).json({ region: data })
  } catch (err) {
    throw err
  }
}
