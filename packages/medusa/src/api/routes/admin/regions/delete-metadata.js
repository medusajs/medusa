import { defaultRelations, defaultFields } from "./"

/**
 * @oas [delete] /regions/{id}/metadata/{key}
 * operationId: "DeleteRegionsRegionMetadataKey"
 * summary: "Delete Metadata"
 * description: "Deletes a metadata key."
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 *   - (path) key=* {string} The metadata key.
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
  const { id, key } = req.params

  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.deleteMetadata(id, key)

    const region = await regionService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ region })
  } catch (err) {
    throw err
  }
}
