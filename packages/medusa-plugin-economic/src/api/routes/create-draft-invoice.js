import { isObject, isString } from "@medusa/utils"

export default async (req, res) => {
  const requestIsValid = isObject(req.body) && isString(req.body.orderId)

  if (!requestIsValid) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const economicService = req.scope.resolve("economicService")
    await economicService.draftEconomicInvoice(req.body.orderId)
    res.sendStatus(200)
  } catch (error) {
    throw error
  }
}
