import { IsString, IsNotEmpty } from "class-validator"
import { Response } from "express"
import { AdminStoresRes } from "."
import { StoreService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /store
 * operationId: "PostStore"
 * summary: "Update Store details."
 * description: "Updates the Store details"
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
export default async (req, res: Response<AdminStoresRes>) => {
  const validatedBody = await validator(AdminPostStoreReq, req.body)

  const storeService: StoreService = req.scope.resolve("storeService")
  const store = await storeService.update(validatedBody)
  res.status(200).json({ store })
}

export class AdminPostStoreReq {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  swap_link_template: string

  @IsString()
  @IsNotEmpty()
  payment_link_template: string

  @IsString()
  @IsNotEmpty()
  default_currency_code: string

  @IsString({ each: true })
  @IsNotEmpty()
  currencies: string[]
}
