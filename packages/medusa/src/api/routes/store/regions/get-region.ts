import RegionService from "../../../../services/region"
/**
 * @oas [get] /regions/{id}
 * operationId: GetRegionsRegion
 * summary: Retrieves a Region
 * description: "Retrieves a Region."
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.regions.retrieve(region_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/regions/{id}'
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

  const regionService: RegionService = req.scope.resolve("regionService")

  const region = await regionService.retrieve(region_id, {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
  })

  res.json({ region })
}
