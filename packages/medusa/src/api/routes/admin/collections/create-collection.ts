import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { defaultAdminCollectionsRelations } from "."

/**
 * @oas [post] /admin/collections
 * operationId: "PostCollections"
 * summary: "Create a Collection"
 * description: "Creates a Product Collection."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostCollectionsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.collections.create({
 *         title: 'New Collection'
 *       })
 *       .then(({ collection }) => {
 *         console.log(collection.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/collections' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "New Collection"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Collections
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminCollectionsRes"
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
  const { validatedBody } = req as { validatedBody: AdminPostCollectionsReq }

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const created = await manager.transaction(async (transactionManager) => {
    return await productCollectionService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  const collection = await productCollectionService.retrieve(created.id, {
    relations: defaultAdminCollectionsRelations,
  })

  res.status(200).json({ collection })
}

/**
 * @schema AdminPostCollectionsReq
 * type: object
 * required:
 *   - title
 * properties:
 *   title:
 *     type: string
 *     description:  The title to identify the Collection by.
 *   handle:
 *     type: string
 *     description:  An optional handle to be used in slugs, if none is provided we will kebab-case the title.
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 */
export class AdminPostCollectionsReq {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
