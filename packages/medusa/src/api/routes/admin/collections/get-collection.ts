import { Request, Response } from "express"

import ProductCollectionService from "../../../../services/product-collection"
import { defaultAdminCollectionsRelations } from "."

/**
 * @oas [get] /collections/{id}
 * operationId: "GetCollectionsCollection"
 * summary: "Retrieve a Product Collection"
 * description: "Retrieves a Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product Collection
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.collections.retrieve(collection_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/collections/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            collection:
 *              $ref: "#/components/schemas/product_collection"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const collection = await productCollectionService.retrieve(id, {
    relations: defaultAdminCollectionsRelations,
  })
  res.status(200).json({ collection })
}
