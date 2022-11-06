import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import ProductTypeService from "../../../../services/product-type"

/**
 * @oas [post] /product-types
 * operationId: "PostProductTypes"
 * summary: "Create a Product Type"
 * description: "Creates a Product Type."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - value
 *         properties:
 *           value:
 *             type: string
 *             description:  The value to identify the type by.
 *           images:
 *             description: Images of the Product Type.
 *             type: array
 *             items:
 *               type: string
 *           thumbnail:
 *             description: The thumbnail to use for the Product Type.
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productTypes.create({
 *         value: 'New Type'
 *       })
 *       .then(({ product_type }) => {
 *         console.log(product_type.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/product-types' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "New Collection"
 *       }'
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
 *              $ref: "#/components/schemas/product_type"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
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
  const { validatedBody } = req as { validatedBody: AdminPostProductTypesReq }

  const typeService: ProductTypeService =
    req.scope.resolve("productTypeService")

  const manager: EntityManager = req.scope.resolve("manager")
  const created = await manager.transaction(async (transactionManager) => {
    return await typeService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  const type = await typeService.retrieve(created.id)

  res.status(200).json({ product_type: type })
}

export class AdminPostProductTypesReq {
  @IsString()
  @IsNotEmpty()
  value: string

  @IsArray()
  @IsOptional()
  images?: string[]

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
