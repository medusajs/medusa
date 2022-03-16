import { ArrayNotEmpty, IsString } from "class-validator"
import PriceListService from "../../../../services/price-list"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /price-lists/{id}/prices/batch
 * operationId: "DeletePriceListsPriceListPricesBatch"
 * summary: "Batch delete prices that belongs to a Price List"
 * description: "Batch delete prices that belongs to a Price List"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Price List that the Money Amounts that will be deleted belongs to.
 * requestBody:
 *  content:
 *   application/json:
 *   schema:
 *    properties:
 *      price_ids:
 *        description: The price id's of the Money Amounts to delete.
 *        type: array
 *        items:
 *          type: string
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             ids:
 *               type: array
 *               items:
 *                 type: string
 *                 description: The id of the deleted Money Amount.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminDeletePriceListPricesPricesReq,
    req.body
  )

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  await priceListService.deletePrices(id, validated.price_ids)

  res.json({ ids: validated.price_ids, object: "money-amount", deleted: true })
}

export class AdminDeletePriceListPricesPricesReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  price_ids: string[]
}
