import { IsOptional, IsString } from "class-validator"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers/me/addresses/{address_id}
 * operationId: PostCustomersCustomerAddressesAddress
 * summary: "Update a Shipping Address"
 * description: "Updates a Customer's saved Shipping Address."
 * x-authenticated: true
 * parameters:
 *   - (path) address_id=* {String} The id of the Address to update.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           address:
 *             description: "The updated Address."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 * tags:
 *   - Customer
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const id = req.user.customer_id
  const { address_id } = req.params

  const validated = await validator(
    StorePostCustomersCustomerAddressesAddressReq,
    req.body
  )

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService

  let customer = await customerService.updateAddress(id, address_id, validated)

  customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.json({ customer })
}

export class StorePostCustomersCustomerAddressesAddressReq {
  @IsOptional()
  @IsString()
  company?: string
  @IsOptional()
  @IsString()
  first_name?: string
  @IsOptional()
  @IsString()
  last_name?: string
  @IsOptional()
  @IsString()
  address_1?: string
  @IsOptional()
  @IsString()
  address_2?: string
  @IsOptional()
  @IsString()
  city?: string
  @IsOptional()
  @IsString()
  country_code?: string
  @IsOptional()
  @IsString()
  province?: string
  @IsOptional()
  @IsString()
  postal_code?: number
  @IsOptional()
  @IsString()
  phone?: string
  @IsOptional()
  metadata?: object
}
