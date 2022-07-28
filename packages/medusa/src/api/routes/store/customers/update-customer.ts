import { IsEmail, IsObject, IsOptional, IsString } from "class-validator"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
import CustomerService from "../../../../services/customer"
import { AddressPayload } from "../../../../types/common"
import { IsType } from "../../../../utils/validators/is-type"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /customers/me
 * operationId: PostCustomersCustomer
 * summary: Update Customer details
 * description: "Updates a Customer's saved details."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           first_name:
 *             description: "The Customer's first name."
 *             type: string
 *           last_name:
 *             description: "The Customer's last name."
 *             type: string
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           password:
 *             description: "The Customer's password."
 *             type: string
 *           phone:
 *             description: "The Customer's phone number."
 *             type: string
 *           email:
 *             description: "The email of the customer."
 *             type: string
 *           metadata:
 *             description: "Metadata about the customer."
 *             type: object
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const id = req.user.customer_id

  const validated = await validator(StorePostCustomersCustomerReq, req.body)

  const customerService: CustomerService = req.scope.resolve("customerService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .update(id, validated)
  })

  const customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.status(200).json({ customer })
}

export class StorePostCustomersCustomerReq {
  @IsOptional()
  @IsType([AddressPayload, String])
  billing_address?: AddressPayload | string

  @IsOptional()
  @IsString()
  first_name?: string

  @IsOptional()
  @IsString()
  last_name?: string

  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>
}
