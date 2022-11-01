import ProductTypeService from "../../../../services/product-type"

/**
 * @oas [get] /product-types/{id}
 * operationId: "GetProductType"
 * summary: "Get a Product Type"
 * description: "Retrieves a Product Type."
 * parameters:
 *   - (path) id=* {string} The id of the Product Type
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
 *       curl --location --request GET 'https://medusa-url.com/store/product-types/{id}'
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
 *              $ref: "#/components/schemas/product_type"
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
  const typeService: ProductTypeService =
    req.scope.resolve("productTypeService")

  const type = await typeService.retrieve(id)
  res.status(200).json({ product_type: type })
}
