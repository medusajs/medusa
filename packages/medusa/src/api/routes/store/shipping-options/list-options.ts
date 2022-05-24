import { IsBooleanString, IsOptional, IsString } from "class-validator"
import ProductService from "../../../../services/product"
import ShippingOptionService from "../../../../services/shipping-option"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /shipping-options
 * operationId: GetShippingOptions
 * summary: Retrieve Shipping Options
 * description: "Retrieves a list of Shipping Options."
 * parameters:
 *   - (query) is_return {boolean} Whether return Shipping Options should be included. By default all Shipping Options are returned.
 *   - (query) product_ids {string} A comma separated list of Product ids to filter Shipping Options by.
 *   - (query) region_id {string} the Region to retrieve Shipping Options from.
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_options:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/shipping_option"
 */
export default async (req, res) => {
  const validated = await validator(StoreGetShippingOptionsParams, req.query)

  const productIds =
    (validated.product_ids && validated.product_ids.split(",")) || []
  const regionId = validated.region_id
  const productService: ProductService = req.scope.resolve("productService")
  const shippingOptionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )

  // should be selector
  const query: Record<string, unknown> = {}

  if ("is_return" in req.query) {
    query.is_return = validated.is_return === "true"
  }

  if (regionId) {
    query.region_id = regionId
  }

  query.admin_only = false

  if (productIds.length) {
    const prods = await productService.list({ id: productIds })
    query.profile_id = prods.map((p) => p.profile_id)
  }

  const options = await shippingOptionService.list(query, {
    relations: ["requirements"],
  })

  res.status(200).json({ shipping_options: options })
}

export class StoreGetShippingOptionsParams {
  @IsOptional()
  @IsString()
  product_ids?: string

  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsBooleanString()
  is_return?: string
}
