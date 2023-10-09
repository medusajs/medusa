import { PricingService, ProductService } from "../../../../services"
import IsolateProductDomainFeatureFlag from "../../../../loaders/feature-flags/isolate-product-domain"
import { defaultAdminProductRemoteQueryObject } from "./index"
import { MedusaError } from "@medusajs/utils"

/**
 * @oas [get] /admin/products/{id}
 * operationId: "GetProductsProduct"
 * summary: "Get a Product"
 * description: "Retrieve a Product's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.retrieve(productId)
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/products/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
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

  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")

  let rawProduct
  if (featureFlagRouter.isFeatureEnabled(IsolateProductDomainFeatureFlag.key)) {
    rawProduct = await getProductWithIsolatedProductModule(
      req,
      id,
      req.retrieveConfig
    )
  } else {
    rawProduct = await productService.retrieve(id, req.retrieveConfig)
  }

  // We only set prices if variants.prices are requested
  const shouldSetPricing = ["variants", "variants.prices"].every((relation) =>
    req.retrieveConfig.relations?.includes(relation)
  )

  const product = rawProduct

  if (!shouldSetPricing) {
    await pricingService.setProductPrices([product])
  }

  res.json({ product })
}

async function getProductWithIsolatedProductModule(req, id, retrieveConfig) {
  // TODO: Add support for fields/expands
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id }

  const query = {
    product: {
      __args: variables,
      ...defaultAdminProductRemoteQueryObject,
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
