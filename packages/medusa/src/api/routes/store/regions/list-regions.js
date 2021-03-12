/**
 * @oas [get] /regions
 * operationId: GetRegions
 * summary: List Regions
 * description: "Retrieves a list of Regions."
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of regions.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of regions to return,
 *               type: integer
 *             regions:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/region"
 */
export default async (req, res) => {
  const regionService = req.scope.resolve("regionService")

  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  const listConfig = {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
    skip: offset,
    take: limit,
  }

  const regions = await regionService.list(selector, listConfig)

  res.json({ regions })
}
