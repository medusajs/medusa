import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { region_id } = req.params
  const schema = Validator.object().keys({
    country_code: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.addCountry(region_id, value.country_code)

    const data = await regionService.retrieve(region_id)
    res.status(200).json({ region: data })
  } catch (err) {
    throw err
  }
}
