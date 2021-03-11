import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [delete] /regions/{id}/countries/{country_code}
 * operationId: "PostRegionsRegionCountriesCountry"
 * summary: "Remove Country"
 * description: "Removes a Country from the list of Countries in a Region"
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 *   - (path) country_code=* {string} The 2 character ISO code for the Country.
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
  const { region_id, country_code } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.removeCountry(region_id, country_code)

    const region = await regionService.retrieve(region_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ region })
  } catch (err) {
    throw err
  }
}
