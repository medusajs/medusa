import { Request, Response } from "express"
import ProductOptionService from "../../../../services/product-option"
import { defaultStoreProductOptionRelations } from "./index"

/**
 * @oas [get] /product-options/{id}
 * operationId: "GetProductOptions"
 * summary: "Get a Product Option"
 * description: "Retrieves a Product Option."
 * parameters:
 *   - (path) id=* {string} The id of the Product Option
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.productOptions.retrieve(product_option_id)
 *       .then(({ product_option }) => {
 *         console.log(product_option.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/product-options/{id}'
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
 *              $ref: "#/components/schemas/product_option"
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

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const optionService: ProductOptionService = req.scope.resolve(
    "productOptionService"
  )

  const collection = await optionService.retrieve(id, {
    relations: defaultStoreProductOptionRelations,
  })
  res.status(200).json({ collection })
}
