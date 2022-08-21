import { IsArray, IsObject, IsOptional, IsString } from "class-validator"

import { StoreService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /store
 * operationId: "PostStore"
 * summary: "Update Store details."
 * description: "Updates the Store details"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Store"
 *             type: string
 *           swap_link_template:
 *             description: "A template for Swap links - use `{{cart_id}}` to insert the Swap Cart id"
 *             type: string
 *           payment_link_template:
 *             description: "A template for payment links links - use `{{cart_id}}` to insert the Cart id"
 *             type: string
 *           invite_link_template:
 *             description: "A template for invite links - use `{{invite_token}}` to insert the invite token"
 *             type: string
 *           default_currency_code:
 *             description: "The default currency code for the Store."
 *             type: string
 *             externalDocs:
 *               url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *               description: See a list of codes.
 *           currencies:
 *             description: "Array of currencies in 2 character ISO code format."
 *             type: array
 *             items:
 *               type: string
 *           metadata:
 *             description: "An optional set of key-value pairs with additional information."
 *             type: object
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             store:
 *               $ref: "#/components/schemas/store"
 */
export default async (req, res) => {
  const validatedBody = await validator(AdminPostStoreReq, req.body)

  const storeService: StoreService = req.scope.resolve("storeService")

  const manager: EntityManager = req.scope.resolve("manager")
  const store = await manager.transaction(async (transactionManager) => {
    return await storeService
      .withTransaction(transactionManager)
      .update(validatedBody)
  })

  res.status(200).json({ store })
}

export class AdminPostStoreReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsString()
  @IsOptional()
  swap_link_template?: string

  @IsString()
  @IsOptional()
  payment_link_template?: string

  @IsString()
  @IsOptional()
  invite_link_template?: string

  @IsString()
  @IsOptional()
  default_currency_code?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currencies?: string[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
