import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /regions/{id}/countries
 * operationId: "PostRegionsRegionCountries"
 * summary: "Add Country"
 * description: "Adds a Country to the list of Countries in a Region"
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           country_code:
 *             description: "The 2 character ISO code for the Country."
 *             type: string
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             region:
 *               $ref: "#/components/schemas/region"
 */
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

    const region = await regionService.retrieve(region_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ region })
  } catch (err) {
    throw err
  }
}
