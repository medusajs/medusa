/**
 * @oas [get] /regions/{id}
 * operationId: GetRegionsRegion
 * summary: Retrieves a Region
 * description: "Retrieves a Region."
 * parameters:
 *   - (path) id=* {string} The id of the Region.
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
  const regionService = req.scope.resolve("regionService")
  const region = await regionService.retrieve(region_id, {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
  })

  res.json({ region })
}
