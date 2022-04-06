import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."
import { PriceList } from "../../../.."
import PriceListService from "../../../../services/price-list"

/**
 * @oas [get] /price-lists/{id}
 * operationId: "GetPriceListsPriceList"
 * summary: "Retrieve a Price List"
 * description: "Retrieves a Price List."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Price List.
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             price_list:
 *               $ref: "#/components/schemas/price_list"
 */
export default async (req, res) => {
  const { id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const priceList = await priceListService.retrieve(id, {
    select: defaultAdminPriceListFields as (keyof PriceList)[],
    relations: defaultAdminPriceListRelations,
  })

  res.status(200).json({ price_list: priceList })
}
