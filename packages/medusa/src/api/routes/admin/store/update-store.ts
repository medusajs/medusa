import { IsArray, IsOptional, IsString } from "class-validator"
import { StoreService } from "../../../../services"
import { validator } from "../../../../utils/validator"

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
 *           default_currency_code:
 *             description: "The default currency code for the Store."
 *             type: string
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

  const store = await storeService.update(validatedBody)

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
  default_currency_code?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currencies?: string[]
}
