import { IsOptional, IsString } from "class-validator"
import {
  CartService,
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  RegionService,
} from "../../../../services"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [get] /store/products/{id}
 * operationId: GetProductsProduct
 * summary: Get a Product
 * description: "Retrieves a Product."
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (query) sales_channel_id {string} The sales channel used when fetching the product.
 *   - (query) cart_id {string} The ID of the customer's cart.
 *   - (query) region_id {string} The ID of the region the customer is using. This is helpful to ensure correct prices are retrieved for a region.
 *   - (query) fields {string} (Comma separated) Which fields should be included in the result.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product of the result.
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: The 3 character ISO currency code to set prices based on. This is helpful to ensure correct prices are retrieved for a currency.
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 * x-codegen:
 *   method: retrieve
 *   queryParams: StoreGetProductsProductParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.products.retrieve(product_id)
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/products/{id}'
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreProductsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = req.validatedQuery as StoreGetProductsProductParams

  const customer_id = req.user?.customer_id

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const rawProduct = await productService.retrieve(id, req.retrieveConfig)

  let sales_channel_id = validated.sales_channel_id
  if (req.publishableApiKeyScopes?.sales_channel_ids.length === 1) {
    sales_channel_id = req.publishableApiKeyScopes.sales_channel_ids[0]
  }

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

  const pricedProductArray = await pricingService.setProductPrices(
    [rawProduct],
    {
      cart_id: validated.cart_id,
      customer_id: customer_id,
      region_id: regionId,
      currency_code: currencyCode,
      include_discount_prices: true,
    }
  )

  const [product] = await productVariantInventoryService.setProductAvailability(
    pricedProductArray,
    sales_channel_id
  )

  res.json({
    product: cleanResponseData(product, req.allowedProperties || []),
  })
}

export class StoreGetProductsProductParams extends PriceSelectionParams {
  @IsString()
  @IsOptional()
  sales_channel_id?: string

  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  expand?: string
}
