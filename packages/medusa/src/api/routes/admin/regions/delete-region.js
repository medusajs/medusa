import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [delete] /regions/{id}
 * operationId: "DeleteRegionsRegion"
 * summary: "Delete a Region"
 * description: "Deletes a Region."
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
 *             id:
 *               type: string
 *               description: The id of the deleted Region.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { region_id } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.delete(region_id)

    res.status(200).json({
      id: region_id,
      object: "region",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}
