import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /customers/password-token
 * operationId: PostCustomersCustomerPasswordToken
 * summary: Creates a reset password token
 * description: "Creates a reset password token to be used in a subsequent /reset-password request. The password token should be sent out of band e.g. via email and will not be returned."
 * tags:
 *   - Customer
 * responses:
 *   204:
 *     description: OK
 */
export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string().email().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieveByEmail(value.email)

    // Will generate a token and send it to the customer via an email privder
    await customerService.generateResetPasswordToken(customer.id)

    res.sendStatus(204)
  } catch (error) {
    throw error
  }
}
