import { defaultStoreVariantRelations } from "."
import {
  CartService,
  RegionService,
  ProductVariantService,
  PricingService,
} from "../../../../services"
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
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")

  const customer_id = req.user?.customer_id

  const rawVariant = await variantService.retrieve(id, {
    relations: defaultStoreVariantRelations,
  })

  let regionId = validated.region_id
  let currencyCode = validated.currency_code
  if (validated.cart_id) {
    const cart = await cartService.retrieve(validated.cart_id, {
      select: ["id", "region_id"],
    })
    const region = await regionService.retrieve(cart.region_id, {
      select: ["id", "currency_code"],
    })
    regionId = region.id
    currencyCode = region.currency_code
  }

  const [variant] = await pricingService.setVariantPrices([rawVariant], {
    cart_id: validated.cart_id,
    customer_id: customer_id,
    region_id: regionId,
    currency_code: currencyCode,
    include_discount_prices: true,
  })

  res.json({ variant })
}
