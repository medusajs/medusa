import { IsOptional, IsString } from "class-validator"
import {
  CartService,
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  RegionService,
} from "../../../../services"

import { MedusaError, MedusaV2Flag, promiseAll } from "@medusajs/utils"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { cleanResponseData } from "../../../../utils"
import { defaultStoreProductRemoteQueryObject } from "./index"

/**
 * @oas [get] /store/products/{id}
 * operationId: GetProductsProduct
 * summary: Get a Product
 * description: |
 *   Retrieve a Product's details. For accurate and correct pricing of the product based on the customer's context, it's highly recommended to pass fields such as
 *   `region_id`, `currency_code`, and `cart_id` when available.
 *
 *   Passing `sales_channel_id` ensures retrieving only products available in the current sales channel.
 *   You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
 * externalDocs:
 *   description: "How to pass product pricing parameters"
 *   url: "https://docs.medusajs.com/modules/products/storefront/show-products#product-pricing-parameters"
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 *   - (query) sales_channel_id {string} The ID of the sales channel the customer is viewing the product from.
 *   - (query) cart_id {string} The ID of the cart. This is useful for accurate pricing based on the cart's context.
 *   - (query) region_id {string} The ID of the region. This is useful for accurate pricing based on the selected region.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned product.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned product.
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: A 3 character ISO currency code. This is useful for accurate pricing based on the selected currency.
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
 *       medusa.products.retrieve(productId)
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/products/{id}'
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
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")

  let rawProduct
  if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    rawProduct = await getProductWithIsolatedProductModule(req, id)
  } else {
    rawProduct = await productService.retrieve(id, req.retrieveConfig)
  }

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

  const decoratedProduct = rawProduct

  // We only set prices if variants.prices are requested
  const shouldSetPricing = ["variants", "variants.prices"].every((relation) =>
    req.retrieveConfig.relations?.includes(relation)
  )

  // We only set availability if variants are requested
  const shouldSetAvailability =
    req.retrieveConfig.relations?.includes("variants")

  const decoratePromises: Promise<any>[] = []

  if (shouldSetPricing) {
    decoratePromises.push(
      pricingService.setProductPrices([decoratedProduct], {
        cart_id: validated.cart_id,
        customer_id: customer_id,
        region_id: regionId,
        currency_code: currencyCode,
        include_discount_prices: true,
      })
    )
  }

  if (shouldSetAvailability) {
    decoratePromises.push(
      productVariantInventoryService.setProductAvailability(
        [decoratedProduct],
        sales_channel_id
      )
    )
  }

  // We can run them concurrently as the new properties are assigned to the references
  // of the appropriate entity
  await promiseAll(decoratePromises)

  res.json({
    product: cleanResponseData(decoratedProduct, req.allowedProperties || []),
  })
}

async function getProductWithIsolatedProductModule(req, id: string) {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id }

  const query = {
    product: {
      __args: variables,
      ...defaultStoreProductRemoteQueryObject,
    },
  }

  const [product] = await remoteQuery(query)

  if (!product) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product with id: ${id} not found`
    )
  }

  product.profile_id = product.profile?.id

  return product
}

export class StoreGetProductsProductParams extends PriceSelectionParams {
  @IsString()
  @IsOptional()
  sales_channel_id?: string
}
