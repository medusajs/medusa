import { defaultStoreVariantRelations } from "."
import ProductVariantService from "../../../../services/product-variant"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /variants/{variant_id}
 * operationId: GetVariantsVariant
 * summary: Retrieve a Product Variant
 * description: "Retrieves a Product Variant by id"
 * parameters:
 *   - (path) variant_id=* {string} The id of the Product Variant.
 * tags:
 *   - Product Variant
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             variant:
 *               $ref: "#/components/schemas/product_variant"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(PriceSelectionParams, req.query)

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const customer_id = req.user?.customer_id

  const variant = await variantService.retrieve(id, {
    relations: defaultStoreVariantRelations,
    cart_id: validated.cart_id,
    customer_id: customer_id,
    region_id: validated.region_id,
    currency_code: validated.currency_code,
    include_discount_prices: true,
  })

  res.json({ variant })
}
