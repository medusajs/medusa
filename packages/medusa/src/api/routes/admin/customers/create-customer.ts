import { IsEmail, IsObject, IsOptional, IsString } from "class-validator"

import { CustomerService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /customers
 * operationId: "PostCustomers"
 * summary: "Create a Customer"
 * description: "Creates a Customer."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - first_name
 *           - last_name
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             description: The customer's email.
 *             format: email
 *           first_name:
 *             type: string
 *             description: The customer's first name.
 *           last_name:
 *             type: string
 *             description: The customer's last name.
 *           password:
 *             type: string
 *             description: The customer's password.
 *             format: password
 *           phone:
 *             type: string
 *             description: The customer's phone number.
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 * tags:
 *   - Customer
 * responses:
 *   201:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const validated = await validator(AdminPostCustomersReq, req.body)

  const customerService: CustomerService = req.scope.resolve("customerService")
  const manager: EntityManager = req.scope.resolve("manager")
  const customer = await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .create(validated)
  })
  res.status(201).json({ customer })
}

export class AdminPostCustomersReq {
  @IsEmail()
  email: string

  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsString()
  password: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
