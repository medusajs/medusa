import { IsEmail } from "class-validator"
import { validator } from "medusa-core-utils"
import { defaultRelations, defaultFields, CustomerResponse } from "."
import { Address } from "../../../.."

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

  const validated = await validator(StoreUpdateCustomerRequest, req.body)

  const customerService = req.scope.resolve("customerService")
  await customerService.update(id, validated)

  const customer: CustomerResponse = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
  })

  res.status(200).json({ customer })
}

export class StoreUpdateCustomerRequest {
  @IsEmail()
  email?: string
  billing_address?: Omit<
    Address,
    | "id"
    | "customer_id"
    | "customer"
    | "updated_at"
    | "created_at"
    | "deleted_at"
  >
  first_name?: string
  last_name?: string
  password?: string
  phone?: string
  metadata?: object
}

export class StoreUpdateCustomerResponse {
  customer: CustomerResponse
}
