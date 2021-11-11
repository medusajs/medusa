<<<<<<< HEAD
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
=======
import { IsOptional, IsString } from "class-validator"
import { CustomerResponse, defaultFields, defaultRelations } from "."
>>>>>>> 7053485425693d82237149186811e37953055bff
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers/me/addresses
 * operationId: PostCustomersCustomerAddresses
 * summary: "Add a Shipping Address"
 * description: "Adds a Shipping Address to a Customer's saved addresses."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           address:
 *             description: "The Address to add to the Customer."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 * tags:
 *   - Customer
 * responses:
 *  "200":
 *    description: "A successful response"
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const id = req.user.customer_id

<<<<<<< HEAD
  const validated = await validator(
    StorePostCustomersCustomerAddressesReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve("customerService")

  let customer = await customerService.addAddress(id, validated.address)
  customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
=======
  const validated = await validator(StoreCreateCustomerAddressRequest, req.body)

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService

  let customer = await customerService.addAddress(id, validated)
  customer = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
>>>>>>> 7053485425693d82237149186811e37953055bff
  })

  res.status(200).json({ customer })
}

<<<<<<< HEAD
export class AddressCreatePayload {
=======
export class StoreCreateCustomerAddressRequest {
  @IsOptional()
  @IsString()
  company?: string
>>>>>>> 7053485425693d82237149186811e37953055bff
  @IsString()
  first_name: string
  @IsString()
  last_name: string
<<<<<<< HEAD
  @IsOptional()
  @IsString()
  phone: string
  @IsOptional()
  metadata: object
  @IsOptional()
  @IsString()
  company: string
=======
>>>>>>> 7053485425693d82237149186811e37953055bff
  @IsString()
  address_1: string
  @IsOptional()
  @IsString()
<<<<<<< HEAD
  address_2: string
=======
  address_2?: string
>>>>>>> 7053485425693d82237149186811e37953055bff
  @IsString()
  city: string
  @IsString()
  country_code: string
  @IsOptional()
  @IsString()
<<<<<<< HEAD
  province: string
  @IsString()
  postal_code: string
}

export class StorePostCustomersCustomerAddressesReq {
  @ValidateNested()
  address: AddressCreatePayload
=======
  province?: string
  @IsOptional()
  @IsString()
  phone?: string
}

export type StoreCreateCustomerAddressResponse = {
  customer: CustomerResponse
>>>>>>> 7053485425693d82237149186811e37953055bff
}
