import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [delete] /regions/{id}/payment-providers/{provider_id}
 * operationId: "PostRegionsRegionPaymentProvidersProvider"
 * summary: "Remove Payment Provider"
 * description: "Removes a Payment Provider."
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 *   - (path) provider_id=* {string} The id of the Payment Provider.
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
  const { region_id, provider_id } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.removePaymentProvider(region_id, provider_id)

    const region = await regionService.retrieve(region_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ region })
  } catch (err) {
    throw err
  }
}
