import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import CustomerService from "../../../../services/customer"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { MedusaError } from "medusa-core-utils"
import { Type } from "class-transformer"
import { defaultAdminCustomersRelations } from "."
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers/{id}
 * operationId: "PostCustomersCustomer"
 * summary: "Update a Customer"
 * description: "Updates a Customer."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Customer.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each customer.
 *   - (query) fields {string} (Comma separated) Which fields should be retrieved in each customer.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           email:
 *             type: string
 *             description: The Customer's email.
 *             format: email
 *           first_name:
 *             type: string
 *             description:  The Customer's first name.
 *           last_name:
 *             type: string
 *             description:  The Customer's last name.
 *           phone:
 *             type: string
 *             description: The Customer's phone number.
 *           password:
 *             type: string
 *             description: The Customer's password.
 *             format: password
 *           groups:
 *             type: array
 *             items:
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   description: The ID of a customer group
 *                   type: string
 *             description: A list of customer groups to which the customer belongs.
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
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
  const { id } = req.params

  const validatedBody = await validator(AdminPostCustomersCustomerReq, req.body)
  const validatedQuery = await validator(FindParams, req.query)

  const customerService: CustomerService = req.scope.resolve("customerService")

  let customer = await customerService.retrieve(id)

  if (validatedBody.email && customer.has_account) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Email cannot be changed when the user has registered their account"
    )
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  let expandFields: string[] = []
  if (validatedQuery.expand) {
    expandFields = validatedQuery.expand.split(",")
  }

  const findConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultAdminCustomersRelations,
  }

  customer = await customerService.retrieve(id, findConfig)

  res.status(200).json({ customer })
}

class Group {
  @IsString()
  id: string
}

export class AdminPostCustomersCustomerReq {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  first_name?: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsString()
  @IsOptional()
  password?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  @IsArray()
  @IsOptional()
  @Type(() => Group)
  @ValidateNested({ each: true })
  groups?: Group[]
}
