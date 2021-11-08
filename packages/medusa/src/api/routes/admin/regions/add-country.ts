import { defaultRelations, defaultFields } from "."
import { validator } from "medusa-core-utils"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
/**
 * @oas [post] /regions/{id}/countries
 * operationId: "PostRegionsRegionCountries"
 * summary: "Add Country"
 * description: "Adds a Country to the list of Countries in a Region"
 * x-authenticated: true
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
  const validated = await validator(AdminRegionAddCountryRequest, req.body)

  const regionService = req.scope.resolve("regionService") as RegionService
  await regionService.addCountry(region_id, validated.country_code)

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ region })
}

export class AdminRegionAddCountryRequest {
  country_code: string
}

export class AdminRegionAddCountryResponse {
  region: Region
}
