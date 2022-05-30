import PriceListService from "../../../../services/price-list"

/**
 * @oas [delete] /price-lists/{id}/products/{product_id}/prices
 * operationId: "DeletePriceListsPriceListProductsProductPrices"
 * summary: "Delete all the prices related to a specific product in a price list"
 * description: "Delete all the prices related to a specific product in a price list"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Price List that the Money Amounts that will be deleted belongs to.
 *   - (path) product_id=* {string} The id of the product from which the money amount will be deleted.
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
  const { id, product_id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const [deletedPriceIds] = await priceListService.deleteProductPrices(id, [
    product_id,
  ])

  return res.json({
    ids: deletedPriceIds,
    object: "money-amount",
    deleted: true,
  })
}
