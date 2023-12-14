import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."

import { EntityManager } from "typeorm"
import { IsString } from "class-validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/regions/{id}/fulfillment-providers
 * operationId: "PostRegionsRegionFulfillmentProviders"
 * summary: "Add Fulfillment Provider"
 * description: "Add a Fulfillment Provider to the list of fulfullment providers in a Region."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Region.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostRegionsRegionFulfillmentProvidersReq"
 * x-codegen:
 *   method: addFulfillmentProvider
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.regions.addFulfillmentProvider(regionId, {
 *         provider_id: "manual"
 *       })
 *       .then(({ region }) => {
 *         console.log(region.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/regions/{id}/fulfillment-providers' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "provider_id": "manual"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
  const { region_id } = req.params
  const validated = await validator(
    AdminPostRegionsRegionFulfillmentProvidersReq,
    req.body
  )

  const regionService: RegionService = req.scope.resolve("regionService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await regionService
      .withTransaction(transactionManager)
      .addFulfillmentProvider(region_id, validated.provider_id)
  })

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })
  res.status(200).json({ region })
}

/**
 * @schema AdminPostRegionsRegionFulfillmentProvidersReq
 * type: object
 * required:
 *   - provider_id
 * properties:
 *   provider_id:
 *     description: "The ID of the Fulfillment Provider."
 *     type: string
 */
export class AdminPostRegionsRegionFulfillmentProvidersReq {
  @IsString()
  provider_id: string
}
