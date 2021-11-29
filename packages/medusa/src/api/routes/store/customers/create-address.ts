import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
import { CustomerService, ServiceIdentifiers } from "../../../../services"
import { AddressCreatePayload } from "../../../../types/common"
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
 *       required:
 *         - address
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

  const validated = await validator(
    StorePostCustomersCustomerAddressesReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve(ServiceIdentifiers.customerService)

  let customer = await customerService.addAddress(id, validated.address)
  customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.status(200).json({ customer })
}

export class StorePostCustomersCustomerAddressesReq {
  @ValidateNested()
  @Type(() => AddressCreatePayload)
  address: AddressCreatePayload
}
