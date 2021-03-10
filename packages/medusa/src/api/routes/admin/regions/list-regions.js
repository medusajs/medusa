import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /regions
 * operationId: "GetRegions"
 * summary: "List Regions"
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
 *             regions:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/region"
 */
export default async (req, res) => {
  try {
    const regionService = req.scope.resolve("regionService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    const listConfig = {
      select: defaultFields,
      relations: defaultRelations,
      skip: offset,
      take: limit,
    }

    let regions = await regionService.list(selector, listConfig)

    res.json({ regions, count: regions.length, offset, limit })
  } catch (err) {
    throw err
  }
}
