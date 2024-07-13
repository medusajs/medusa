import {
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  SalesChannelService,
} from "../../../../services"

import { MedusaV2Flag, promiseAll } from "@medusajs/utils"
import { FindParams } from "../../../../types/common"
import { retrieveProduct } from "../../../../utils"
import { defaultAdminProductRemoteQueryObject } from "./index"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"

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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminProduct } from "medusa-react"
 *
 *       type Props = {
 *         productId: string
 *       }
 *
 *       const Product = ({ productId }: Props) => {
 *         const {
 *           product,
 *           isLoading,
 *         } = useAdminProduct(productId)
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {product && <span>{product.title}</span>}
 *
 *           </div>
 *         )
 *       }
 *
 *       export default Product
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
  const isMedusaV2FlagOn = featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  let rawProduct
  if (isMedusaV2FlagOn) {
    rawProduct = await retrieveProduct(
      req.scope,
      id,
      defaultAdminProductRemoteQueryObject
    )
  } else {
    rawProduct = await productService.retrieve(id, req.retrieveConfig)
  }

  // We only set prices if variants.prices are requested
  const shouldSetPricing = ["variants", "variants.prices"].every((relation) =>
    req.retrieveConfig.relations?.includes(relation)
  )

  const product = rawProduct

  const decoratePromises: Promise<any>[] = []
  if (shouldSetPricing) {
    decoratePromises.push(pricingService.setAdminProductPricing([product]))
  }

  const shouldSetAvailability =
    req.retrieveConfig.relations?.includes("variants")

  if (shouldSetAvailability) {
    let salesChannels

    if (isMedusaV2FlagOn) {
      const remoteQuery = req.scope.resolve("remoteQuery")
      const query = {
        sales_channel: {
          fields: ["id"],
        },
      }
      salesChannels = await remoteQuery(query)
    } else if (
      featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)
    ) {
      const salesChannelService: SalesChannelService = req.scope.resolve(
        "salesChannelService"
      )
      ;[salesChannels] = await salesChannelService.listAndCount(
        {},
        { select: ["id"] }
      )
    }

    decoratePromises.push(
      productVariantInventoryService.setProductAvailability(
        [product],
        salesChannels.map((salesChannel) => salesChannel.id)
      )
    )
  }
  await promiseAll(decoratePromises)

  res.json({ product })
}

export class AdminGetProductParams extends FindParams {}
