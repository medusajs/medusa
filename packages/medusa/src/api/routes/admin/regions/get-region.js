import { defaultRelations, defaultFields } from "./"

/**
 * @oas [get] /regions/{id}
 * operationId: "GetRegionsRegion"
 * summary: "Retrieve a Region"
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
  const data = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ region: data })
}
