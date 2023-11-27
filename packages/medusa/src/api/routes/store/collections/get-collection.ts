import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [get] /store/collections/{id}
 * operationId: "GetCollectionsCollection"
 * summary: "Get a Collection"
 * description: "Retrieve a Product Collection's details."
 * parameters:
 *   - (path) id=* {string} The id of the Product Collection
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.collections.retrieve(collectionId)
 *       .then(({ collection }) => {
 *         console.log(collection.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/collections/{id}'
 * tags:
 *   - Product Collections
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreCollectionsRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */

export default async (req, res) => {
  const { id } = req.params
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const collection = await productCollectionService.retrieve(id)
  res.status(200).json({ collection })
}
