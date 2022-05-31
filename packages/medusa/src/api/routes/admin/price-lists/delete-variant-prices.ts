import PriceListService from "../../../../services/price-list"

/**
 * @oas [delete] /price-lists/{id}/variants/{variant_id}/prices
 * operationId: "DeletePriceListsPriceListVariantsVariantPrices"
 * summary: "Delete all the prices related to a specific variant in a price list"
 * description: "Delete all the prices related to a specific variant in a price list"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Price List that the Money Amounts that will be deleted belongs to.
 *   - (path) variant_id=* {string} The id of the variant from which the money amount will be deleted.
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *              ids:
 *               type: number
 *               description: The price ids that have been deleted.
 *             count:
 *               type: number
 *               description: The number of prices that have been deleted.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { id, variant_id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const [deletedPriceIds] = await priceListService.deleteVariantPrices(id, [
    variant_id,
  ])

  return res.json({
    ids: deletedPriceIds,
    object: "money-amount",
    deleted: true,
  })
}
