import CustomerService from "../../../../services/customer"
import { FindParams } from "../../../../types/common"
import { defaultAdminCustomersRelations } from "."
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /customers/{id}
 * operationId: "GetCustomersCustomer"
 * summary: "Retrieve a Customer"
 * description: "Retrieves a Customer."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Customer.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the customer.
 *   - (query) fields {string} (Comma separated) Which fields should be included in the customer.
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

  const validated = await validator(FindParams, req.query)

  const customerService: CustomerService = req.scope.resolve("customerService")

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
  }

  const findConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultAdminCustomersRelations,
  }

  const customer = await customerService.retrieve(id, findConfig)

  res.json({ customer })
}
