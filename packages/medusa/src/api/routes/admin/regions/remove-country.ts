import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."

import { EntityManager } from "typeorm"
import RegionService from "../../../../services/region"

/**
 * @oas [delete] /admin/regions/{id}/countries/{country_code}
 * operationId: "PostRegionsRegionCountriesCountry"
 * summary: "Delete Country"
 * x-authenticated: true
 * description: "Removes a Country from the list of Countries in a Region"
 * parameters:
 *   - (path) id=* {string} The ID of the Region.
 *   - in: path
 *     name: country_code
 *     description: The 2 character ISO code for the Country.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 * x-codegen:
 *   method: deleteCountry
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.regions.deleteCountry(region_id, 'dk')
 *       .then(({ region }) => {
 *         console.log(region.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/regions/{id}/countries/dk' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Regions
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRegionsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { region_id, country_code } = req.params

  const regionService: RegionService = req.scope.resolve("regionService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await regionService
      .withTransaction(transactionManager)
      .removeCountry(region_id, country_code)
  })

  const region = await regionService.retrieve(region_id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.json({ region })
}
