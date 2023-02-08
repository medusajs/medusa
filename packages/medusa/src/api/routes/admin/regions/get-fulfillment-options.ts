import { FulfillmentOption } from "."
import FulfillmentProviderService from "../../../../services/fulfillment-provider"
import RegionService from "../../../../services/region"

/**
 * @oas [get] /regions/{id}/fulfillment-options
 * operationId: "GetRegionsRegionFulfillmentOptions"
 * summary: "List Fulfillment Options"
 * description: "Gathers all the fulfillment options available to in the Region."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Region.
 * x-codegen:
 *   method: retrieveFulfillmentOptions
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.regions.retrieveFulfillmentOptions(region_id)
 *       .then(({ fulfillment_options }) => {
 *         console.log(fulfillment_options.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/regions/{id}/fulfillment-options' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminGetRegionsRegionFulfillmentOptionsRes"
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

  const fulfillmentProviderService: FulfillmentProviderService =
    req.scope.resolve("fulfillmentProviderService")

  const regionService: RegionService = req.scope.resolve("regionService")
  const region = await regionService.retrieve(region_id, {
    relations: ["fulfillment_providers"],
  })

  const fpsIds = region.fulfillment_providers.map((fp) => fp.id) || []

  const options: FulfillmentOption[] =
    await fulfillmentProviderService.listFulfillmentOptions(fpsIds)

  res.status(200).json({
    fulfillment_options: options,
  })
}
