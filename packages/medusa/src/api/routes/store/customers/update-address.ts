import { validator } from "medusa-core-utils"
import { defaultRelations, defaultFields, CustomerResponse } from "."
import { Address } from "../../../.."
import CustomerService from "../../../../services/customer"

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

  const validated = await validator(StoreUpdateAddressRequest, req.body)

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService

  let customer = await customerService.updateAddress(id, address_id, validated)

  customer = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
  })

  res.json({ customer })
}

export class StoreUpdateAddressRequest {
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: number
  phone?: string
  metadata?: JSON
}

export class StoreUpdateAddressResponse {
  customer: CustomerResponse
}
