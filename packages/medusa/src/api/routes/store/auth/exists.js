import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { email } = req.params

  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieveByEmail(email)
    res.status(200).json({ exists: !!customer.password_hash })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}
