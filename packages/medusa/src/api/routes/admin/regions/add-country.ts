import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."

import { EntityManager } from "typeorm"
import { IsString } from "class-validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /regions/{id}/countries
 * operationId: "PostRegionsRegionCountries"
 * summary: "Add Country"
 * description: "Adds a Country to the list of Countries in a Region"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Region.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - country_code
 *         properties:
 *           country_code:
 *             description: "The 2 character ISO code for the Country."
 *             type: string
 *             externalDocs:
 *               url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *               description: See a list of codes.
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
  const validated = await validator(
    AdminPostRegionsRegionCountriesReq,
    req.body
  )

  const regionService: RegionService = req.scope.resolve("regionService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await regionService
      .withTransaction(transactionManager)
      .addCountry(region_id, validated.country_code)
  })

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.status(200).json({ region })
}

export class AdminPostRegionsRegionCountriesReq {
  @IsString()
  country_code: string
}
