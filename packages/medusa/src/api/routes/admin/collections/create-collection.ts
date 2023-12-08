import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { defaultAdminCollectionsRelations } from "."

/**
 * @oas [post] /admin/collections
 * operationId: "PostCollections"
 * summary: "Create a Collection"
 * description: "Create a Product Collection."
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
 *         title: "New Collection"
 *       })
 *       .then(({ collection }) => {
 *         console.log(collection.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/collections' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "New Collection"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Product Collections
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
 *     description: The title of the collection.
 *   handle:
 *     type: string
 *     description: An optional handle to be used in slugs. If none is provided, the kebab-case version of the title will be used.
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
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
