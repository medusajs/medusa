import { MedusaError } from "medusa-core-utils"
import { isObject, isEmail, isDefined } from "@medusa/utils"

export default async (req, res) => {
  const requestIsValid =
    isObject(req.body) &&
    isEmail(req.body.email) &&
    (!isDefined(req.body.data) || isObject(req.body.data))

  if (!requestIsValid) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const mailchimpService = req.scope.resolve("mailchimpService")
    await mailchimpService.subscribeNewsletter(
      req.body.email,
      req.body.data || {}
    )
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}
