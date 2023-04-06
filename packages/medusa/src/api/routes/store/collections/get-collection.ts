import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [get] /store/collections/{id}
 * operationId: "GetCollectionsCollection"
 * summary: "Get a Collection"
 * description: "Retrieves a Product Collection."
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
 *       medusa.collections.retrieve(collection_id)
 *       .then(({ collection }) => {
 *         console.log(collection.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/collections/{id}'
 * tags:
 *   - Collections
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
