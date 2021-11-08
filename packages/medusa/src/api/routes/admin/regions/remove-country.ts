import { defaultRelations, defaultFields } from "."
import { validator } from "medusa-core-utils"
import Region from "../../../.."
import RegionService from "../../../../services/region"

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
  const validated = await validator(
    AdminRemoveCountryFromRegionRequest,
    req.query
  )
  const { region_id, country_code } = validated

  const regionService = req.scope.resolve("regionService") as RegionService
  await regionService.removeCountry(region_id, country_code)

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ region })
}

export class AdminRemoveCountryFromRegionRequest {
  region_id: string
  country_code: string
}

export class AdminRemoveCountryFromRegionResponse {
  region: Region
}
